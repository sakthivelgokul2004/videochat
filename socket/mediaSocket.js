import signal from "../utils/MediaSignal.js";
/** @typedef {import("socket.io").Server} SocketIOServer */

/**
 * @param {SocketIOServer} io
 */
export default function MediaSocket(io, router) {
  const mediaSocker = io.of('/media');

  const { setSendTransport, deleteSendTransport, getAllSendTransports, getSendTransportById } = signal.SendTransportSignal();
  const { setRecvTransport, deleteRecvTransport, getAllRecvTransports, getRecvTransportById } = signal.RecvTransportSignal();
  const { setProducers, getProducersById, deleteProducers } = signal.ProducerSingal();
  const consumers = new Map();
  mediaSocker.on('connection', (socket) => {
    console.log('Media Client connected:', socket.id);
    socket.conn.on("upgrade", () => {
      const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
    });

    socket.on('getRtpCapabilities', (callback) => {
      console.log("getRtpCapabilities called", callback);
      if (!router) {
        console.error('Router not initialized');
        return;
      }
      mediaSocker.to(socket.id).emit('rtpCapabilities', router.rtpCapabilities);
      callback(router.rtpCapabilities);
    });
    socket.on('createSendTransport', async () => {
      const transport = await router.createWebRtcTransport(
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
        })
      mediaSocker.to(socket.id).emit('sendTransport', {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters
      });
      console.log("createTransport", transport.id);
      setSendTransport(socket.id, transport);
    })

    socket.on('createReciveTransport', async (callback) => {
      console.log("createReciveTransport called", socket.id);
      try {
        const transport = await router.createWebRtcTransport(
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
          })
        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
        setRecvTransport(socket.id, transport);
      } catch (error) {
        callback({ error: "transport creation failed" });
      }
    })
    socket.on('sendTransportConnect', async (dtlsParameters) => {
      console.log("called transportConnect")

      const webRtcTransport = getSendTransportById(socket.id);
      if (dtlsParameters) {
        await webRtcTransport.connect({ dtlsParameters });
      }

    })
    socket.on('recvTransportConnect', async (dtlsParameters) => {
      console.log("called transportConnect")

      const webRtcTransport = getRecvTransportById(socket.id);
      if (dtlsParameters) {
        await webRtcTransport.connect({ dtlsParameters });
      }

    })
    socket.on('produce', async ({ transportId, kind, rtpParameters, appData }, callback) => {
      const transport = getSendTransportById(socket.id);
      console.log("Produce called", transportId, kind, appData);
      try {
        const producer = await transport.produce({
          kind,
          rtpParameters,
          appData,
        });
        console.log("new producer", producer.id, "kind:", producer.kind);
        socket.broadcast.emit("newProducer", {
          producerId: producer.id,
          socketId: socket.id
        });
        setProducers(producer.id, producer);
        callback({ id: producer.id });

      } catch (err) {
        console.error("Produce error:", err);
      }
    });
    socket.on("consume", async ({ producerId, clientRtpCapabilites, socketId }, callback) => {
      console.log("Consume called", producerId, socketId);
      if (!router.canConsume({ producerId, rtpCapabilities: clientRtpCapabilites })) {
        console.error("Client cannot consume this producer");
        return callback({ error: "Cannot consume" });
      }
      try {
        const consumer = await getRecvTransportById(socket.id).consume({
          producerId,
          rtpCapabilities: clientRtpCapabilites,
          paused: true
        });

        consumers.set(consumer.id, consumer);

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
      console.log("Consumer Resume called", consumerId);
      const consumer = consumers.get(consumerId);
      if (consumer) {
        await consumer.resume();
        console.log("Consumer resumed:", consumerId);
      } else {
        console.error("Consumer not found:", consumerId);
      }
    })

    socket.on("disconnect", () => {
      console.log("Media Client disconnected:", socket.id);

      // Cleanup associated transports, producers, consumers, etc.
      const transport = getSendTransportById(socket.id);
      if (transport) {
        try {
          transport.close(); // Gracefully close mediasoup transport
        } catch (e) {
          console.warn("Failed to close transport:", e.message);
        }
      }
      deleteSendTransport(socket.id);
    });
  });

  mediaSocker.on('getRtpCapabilities', (_, callback) => {
    console.log("getRtpCapabilities called");
    if (!router) {
      console.error('Router not initialized');
      return;
    }
    callback(router.rtpCapabilities);
  });
  mediaSocker.on("hello", () => {
    console.log("hello from media socket")
  })
  io.engine.on("connection_error", (err) => {
    console.log(err.code);     // 3
    console.log(err.message);  // "Bad request"
    console.log(err.context);  // { name: 'TRANSPORT_MISMATCH', transport: 'websocket', previousTransport: 'polling' }
  });
}
