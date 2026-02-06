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
  const webRtcServer = worker.appData.webRtcServer;
  let transportParms;
  transportParms =
  {
    webRtcServer,
    enableUdp: true,
    enableTcp: false,
    preferUdp: true,
  }

  mediaSocker.on('connection', (socket) => {

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
      console.log("create send transport", socket.data.roomId,);
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
      } catch (error) {
        callback({ error: "transport creation failed" });
      }
    })
    socket.on("sendTransportConnect", async (dtlsParameters, callback) => {
      console.log("connect on send")
      const transport = peerStore.getSendTransport(socket.data.roomId, socket.id);

      if (!transport) {
        console.error("Send transport not found");
        return;
      }

      await transport.connect({ dtlsParameters });

      callback();
    });
    socket.on('recvTransportConnect', async (dtlsParameters) => {

      const webRtcTransport = peerStore.getRecvTransport(socket.data.roomId, socket.id);
      if (dtlsParameters) {
        await webRtcTransport.connect({ dtlsParameters });
      }

    })
    socket.on('produce', async ({ transportId, kind, rtpParameters, appData }, callback) => {
      const transport = peerStore.getSendTransport(socket.data.roomId, socket.id);
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
        peerStore.setProducer(socket.data.roomId, socket.id, producer);
        callback({ id: producer.id });

      } catch (err) {
      }
    });
    socket.on("consume", async ({ producerId, rtpCapabilities, socketId }, callback) => {
      const router = await createRoom(socket.data.roomId, worker);
      if (!router.canConsume({ producerId, rtpCapabilities: rtpCapabilities })) {
        console.error(socketId, "socket", socket.id, "Client cannot consume this producer");
        return callback({ error: "Cannot consume" });
      }
      try {
        const consumer = await peerStore.getRecvTransport(socket.data.roomId, socket.id).consume({
          producerId,
          rtpCapabilities,
          paused: true
        });

        peerStore.setConsumer(socket.data.roomId, socket.id, consumer.id, consumer);

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
      const consumer = peerStore.getConsumer(socket.data.roomId, socket.id, consumerId);
      if (consumer) {
        await consumer.resume();
      } else {
        console.error("Consumer not found:", consumerId);
      }
    })

    socket.on("disconnect", () => {
      console.log("Media Client disconnected:", socket.id);

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

  mediaSocker.on("hello", () => {
    console.log("hello from media socket")
  })
  io.engine.on("connection_error", (err) => {
    console.log(err.code);
    console.log(err.message);
    console.log(err.context);
  });
}
