import { createRoom, generateSecureId } from "../utils/roomManager.js";
import signal from "../utils/MediaSignal.js";
import { PeerStore } from "../utils/PeerStore.js";

/** @typedef {import("socket.io").Server} SocketIOServer 
 * @typedef {import("mediasoup").types.Worker} Worker
 **/

/**
 * @param {SocketIOServer} io
  * @param {Worker} worker
 */
export default function MediaSocket(io, worker) {
  const mediaSocker = io.of('/media');
  const peerStore = new PeerStore();
  let transportParms;
  if (process.env.NODE_ENV === 'production') {
    transportParms =
    {
      listenIps: [
        {
          ip: '0.0.0.0',               // bind internally
          announcedIp: process.env.ANNOUNCED_IP
        }
      ],
      enableUdp: true,
      enableTcp: true,   // TCP helps if UDP is blocked
      preferUdp: true,
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ],
    }
  } else {
    transportParms =
    {
      listenIps: [{
        ip: '127.0.0.1',
      }],
      enableUdp: true,
      enableTcp: false,
      preferUdp: true,
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' } // <- works for localhost development
      ],
    }
  }

  mediaSocker.on('connection', (socket) => {
    console.log('Media Client connected:', socket.id);

    socket.on('joinRoom', async (roomState, roomId, callback) => {
      if (roomState == 'create') {
        socket.data.roomId = generateSecureId();
      }
      else {
        socket.data.roomId = roomId;
      }
      let router = await createRoom(socket.data.roomId, worker);
      let lt = peerStore.getAllProducers(socket.data.roomId);
      const existingProducers = peerStore.getAllProducers(socket.data.roomId)
        .map(({ producer, socketId }) => ({
          id: producer.id,
          kind: producer.kind,
          rtpParameters: producer.rtpParameters,
          appData: producer.appData,
          socketId,
        }));


      callback({
        roomId: socket.data.roomId,
        routerRtpCapabilities: router.rtpCapabilities,
        existingProducers,
      });
    })
    socket.on('createSendTransport', async () => {
      const router = await createRoom(socket.data.roomId, worker);
      const transport = await router.createWebRtcTransport(transportParms)
      mediaSocker.to(socket.id).emit('sendTransport', {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters
      });
      peerStore.setSendTransport(socket.data.roomId, socket.id, transport);
      //    setSendTransport(socket.id, transport);
    })

    socket.on('createReciveTransport', async (callback) => {
      try {
        const router = await createRoom(socket.data.roomId, worker);
        const transport = await router.createWebRtcTransport(transportParms)
        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
        peerStore.setRecvTransport(socket.data.roomId, socket.id, transport);
        //setRecvTransport(socket.id, transport);
      } catch (error) {
        callback({ error: "transport creation failed" });
      }
    })
    socket.on('sendTransportConnect', async (dtlsParameters) => {

      //      const webRtcTransport = getSendTransportById(socket.id);
      const webRtcTransport = peerStore.getSendTransport(socket.data.roomId, socket.id);
      if (webRtcTransport == null) {
        console.error("WebRTC transport not found for socket:", socket.id);
        return;
      }
      if (dtlsParameters && webRtcTransport != null) {
        await webRtcTransport.connect({ dtlsParameters });
      }

    })
    socket.on('recvTransportConnect', async (dtlsParameters) => {

      //      const webRtcTransport = getRecvTransportById(socket.id);
      const webRtcTransport = peerStore.getRecvTransport(socket.data.roomId, socket.id);
      if (dtlsParameters) {
        await webRtcTransport.connect({ dtlsParameters });
      }

    })
    socket.on('produce', async ({ transportId, kind, rtpParameters, appData }, callback) => {
      //const transport = getSendTransportById(socket.id);
      const transport = peerStore.getSendTransport(socket.data.roomId, socket.id);
      console.log("Produce called", transportId, kind, appData);
      try {
        const producer = await transport.produce({
          kind,
          rtpParameters,
          appData,
        });
        socket.broadcast.emit("newProducer", {
          producerId: producer.id,
          socketId: socket.id
        });
        //setProducers(producer.id, producer);
        peerStore.setProducer(socket.data.roomId, socket.id, producer.kind, producer);
        callback({ id: producer.id });

      } catch (err) {
        console.error("Produce error:", err);
      }
    });
    socket.on("consume", async ({ producerId, clientRtpCapabilites, socketId }, callback) => {
      console.log("Consume called", producerId, socketId);
      const router = await createRoom(socket.data.roomId, worker);
      if (!router.canConsume({ producerId, rtpCapabilities: clientRtpCapabilites })) {
        console.error(socketId, "socket", socket.id, "Client cannot consume this producer");
        return callback({ error: "Cannot consume" });
      }
      try {
        //const consumer = await getRecvTransportById(socket.id).consume({
        const consumer = await peerStore.getRecvTransport(socket.data.roomId, socket.id).consume({
          producerId,
          rtpCapabilities: clientRtpCapabilites,
          paused: true
        });

        //consumers.set(consumer.id, consumer);
        peerStore.setConsumer(socket.data.roomId, socket.id, consumer.id, consumer);

        console.log("Consumer created", consumer.id, "kind:", consumer.kind);
        callback({
          id: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters
        });
      } catch (error) {
        console.log("Consume error:", error);
      }
    }

    );
    socket.on("consumerResume", async ({ consumerId }) => {
      //const consumer = consumers.get(consumerId);
      const consumer = peerStore.getConsumer(socket.data.roomId, socket.id, consumerId);
      if (consumer) {
        await consumer.resume();
      } else {
        console.error("Consumer not found:", consumerId);
      }
    })

    socket.on("disconnect", () => {
      console.log("Media Client disconnected:", socket.id);

      // Cleanup associated transports, producers, consumers, etc.
      //const transport = getSendTransportById(socket.id);
      const transport = peerStore.getSendTransport(socket.data.roomId, socket.id);
      if (transport) {
        try {
          transport.close(); // Gracefully close mediasoup transport
        } catch (e) {
          console.warn("Failed to close transport:", e.message);
        }
      }
      //deleteSendTransport(socket.id);
      peerStore.deleteSocket(socket.data.roomId, socket.id);
    });
  });

  //  mediaSocker.on('getRtpCapabilities', async (_, callback) => {
  //      const router = await createRoom(socket.data.roomId, worker);
  //    console.log("getRtpCapabilities called");
  //    if (!router) {
  //      console.error('Router not initialized');
  //      return;
  //    }
  //    callback(router.rtpCapabilities);
  //  });
  mediaSocker.on("hello", () => {
    console.log("hello from media socket")
  })
  io.engine.on("connection_error", (err) => {
    console.log(err.code);     // 3
    console.log(err.message);  // "Bad request"
    console.log(err.context);  // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
  });
}
