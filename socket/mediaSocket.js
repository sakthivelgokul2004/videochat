import { createRoom, generateSecureId, roomExist } from "../utils/roomManager.js";
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

    socket.on("room", async (roomId, callback) => {
      if (roomExist(roomId)) {
        callback(true);
      } else {
        callback(false);
      };
    })

    socket.on('joinRoom', async (roomState, roomId, userState, callback) => {
      if (roomState == 'create') {
        socket.data.roomId = generateSecureId();
      }
      else {
        socket.data.roomId = roomId;
      }
      console.log("userState", userState);
      let router = await createRoom(socket.data.roomId, worker);
      peerStore.setUserMetadata(socket.data.roomId, socket.id, userState);
      const existingProducers = peerStore.getAllProducers(socket.data.roomId)
        .map(({ producer, socketId }) => {
          const producerMetadata = peerStore.getMetadata(socket.data.roomId, socketId);
          return {
            id: producer.id,
            kind: producer.kind,
            rtpParameters: producer.rtpParameters,
            appData: producer.appData,
            socketId,
            metadata: producerMetadata,
            paused: producer.paused, // ← add this
          };
        });

      socket.join(socket.data.roomId)

      callback({
        roomId: socket.data.roomId,
        routerRtpCapabilities: router.rtpCapabilities,
        existingProducers,
      });
    })
    // When a user updates their profile
    socket.on('updateMetadata', async (newMetadata) => {
      if (!socket.data.roomId) {
        console.warn("updateMetadata called before joining room, ignoring.");
        return;
      }
      const roomId = socket.data.roomId;

      // Store updated metadata
      peerStore.setUserMetadata(roomId, socket.id, newMetadata);

      // Enforce mute state on producers
      const producers = peerStore.getProducersBySocket(roomId, socket.id);
      // returns array of producers for this socket

      for (const producer of producers) {
        const kind = producer.kind; // 'audio' or 'video'

        if (kind === 'audio') {
          if (newMetadata.isAudioMuted) {
            await producer.pause();
          } else {
            await producer.resume();
          }
        }

        if (kind === 'video') {
          if (newMetadata.isVideoMuted) {
            await producer.pause();
          } else {
            await producer.resume();
          }
        }
      }
      console.log("current emit");
      console.log(newMetadata)
      // Broadcast to others
      console.log(socket.data.roomId);
      socket.to(roomId).emit('peerMetadataUpdated', {
        socketId: socket.id,
        metadata: newMetadata
      });
    });

    socket.on('createSendTransport', async (callback) => {
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
      console.log(callback);
      if (typeof callback === "function") {
        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      }
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
        let metadata = peerStore.getMetadata(socket.data.roomId, socket.id)
        socket.broadcast.emit("newProducer", {
          producerId: producer.id,
          socketId: socket.id,
          metaData: metadata
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
      const roomId = socket.data.roomId;
      const transport = peerStore.getSendTransport(socket.data.roomId, socket.id);
      socket.to(roomId).emit("peerLeft", socket.id);
      if (transport) {
        try {
          transport.close();
        } catch (e) {
          console.warn("Failed to close transport:", e.message);
        }
      }
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
