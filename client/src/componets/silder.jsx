import React, { useEffect, useRef, useState } from 'react'
import useDevice from '../hooks/device'
import socket from "../utils/socket"
import ActiveConnections from './layout'
import {
  MicrophoneIcon,


  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/solid";
/** @typedef {import('mediasoup-client').types.Transport} Transport */
/** @typedef {import('mediasoup-client').types.Device} Device*/

const Silder = ({
  isConsumer,
  width,
  MessageSocket,
  room,
  routerId,
  setRouterId,
}) => {
  let [device, loading, error] = useDevice()
  const [routerRtpCapabilities, setRouterRtpCapabilities] = useState(null)

  /** @type {[import('mediasoup-client').types.RtpCapabilities|undefined, Function]} */
  /** @type {[Transport|undefined, Function]} */
  const [sendTransport, setSendTrasport] = useState();
  const [socketLoading, setSocketLoading] = useState(true);
  /** @type {[Transport|undefined, Function]} */
  const [recvTransports, setRecvTrasports] = useState();
  const [transportState, setTransportState] = useState(false);
  const [camState, setCamState] = useState(false);
  const [streams, setStreams] = useState([]);
  const [deviceStarted, setDeviceStarted] = useState(false);
  const [callState, setCallState] = useState(true);
  const [mediaPopupVisible, setMediaPopupVisible] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [pendingProducers, setPendingProducers] = useState([]);
  const [mediaConstraints, setMediaConstraints] = useState({
    audio: false,
    video: false,
  });
  useEffect(() => {
    setSocketLoading(true);
    socket.on("connect", () => {
      console.log("connected to media socket", socket.id);
      setSocketLoading(false);
    })
    console.log("socket state", socket.active)
    socket.io.engine.on("upgrade", () => {
      const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
      console.log("socket state ", upgradedTransport);
    });
    return () => {
    }
  }, [])

  const consumeProducer = async (producerId, socketId, currentRecvTransport) => {
    if (socketId === socket.id) return;

    // Use the transport passed in or the state transport
    const transport = currentRecvTransport;

    if (!transport || !device.loaded) {
      console.warn("Chrome Warning: Transport not ready yet.", transport);
      return;
    }
    const rtpCapabilities = device.rtpCapabilities;
    console.log("rtp", rtpCapabilities);
    socket.emit("consume", {
      producerId,
      rtpCapabilities,
      socketId

    }, async ({ id, kind, rtpParameters }) => {
      try {
        const consumer = await transport.consume({
          id,
          producerId,
          kind,
          rtpParameters
        });

        const stream = new MediaStream([consumer.track]);
        setStreams((prev) => [...prev, stream]);
        socket.emit("consumerResume", { consumerId: id });
      } catch (err) {
        console.error("Chrome SDP Error:", err.message);
      }
    });
  };
  useEffect(() => {
    socket.on("sendTransport", (transportparms) => {
      try {
        if (device && device.loaded && sendTransport == null) {
          let transport = device.createSendTransport({
            id: transportparms.id,
            iceParameters: transportparms.iceParameters,
            iceCandidates: transportparms.iceCandidates,
            dtlsParameters: transportparms.dtlsParameters,
            sctpParameters: transportparms.sctpParameters
          })
          console.log("create send transport");
          transport.on("connect", ({ dtlsParameters }, callback, errback) => {
            socket.emit(
              "sendTransportConnect",
              dtlsParameters,
              () => {
                console.log("Server transport connected, now client can proceed");
                callback();
              }
            );
          });
          console.log("transport id", transport.id);
          transport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
            console.log("produce", kind, rtpParameters, appData, transport.id);
            socket.emit("produce", {
              transportId: transport.id,
              kind,
              rtpParameters,
              appData
            }, (response) => { callback({ id: response.id }) });

          });
          setTransportState(true);
          if (sendTransport == null) {
            setSendTrasport(transport);
            console.log("transport create ");
          }
        }

      } catch (error) {
        console.log('error', error)

      }
    })
    socket.on("newProducer", async ({ producerId, socketId }) => {
      console.log("new Proceduer");
      if (socketId === socket.id) return;
      await consumeProducer(producerId, socketId, recvTransports);
    });
    console.log("create rec ", device, sendTransport, recvTransports);
    if (device && device.loaded && recvTransports == undefined) {
      console.log("create rec transport");
      socket.emit("createReciveTransport", (transportparms) => {
        try {
          const newRecvTransport = device.createRecvTransport(transportparms);
          newRecvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
            socket.emit("recvTransportConnect", dtlsParameters);
            callback();
          });
          setRecvTrasports(newRecvTransport);
        } catch (error) {
          console.log('Error creating receive transport:', error);
        }
      });
    }

    return () => {
      socket.off("newProducer");
      socket.off("rtpCapabilities");

    }
  }, [loading, device, recvTransports, sendTransport, socketLoading])

  useEffect(() => {

  }, [camState, transportState, sendTransport])


  const handleGetMedia = async (state) => {
    try {
      const constraints = {
        audio: mediaConstraints.audio,
        video: mediaConstraints.video
          ? {
            width: { min: 640 },
            height: { min: 360 },
          }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
    } catch (err) {
      console.error("Media access denied", err);
    }
  };
  const handleStartCall = () => {
    setMediaPopupVisible(false);
  };

  useEffect(() => {
    if (!mediaPopupVisible) {
      let roomState = routerId === "" ? "create" : "join";

      socket.emit(
        "joinRoom",
        roomState,
        routerId,
        async ({ roomId, routerRtpCapabilities, existingProducers }) => {
          setRouterId(roomId);
          if (roomState === "create") {
            MessageSocket.emit("sendInvite", { to: room.socketId, routerId: roomId });
          }

          try {
            if (!loading && !device.loaded && !deviceStarted) {
              setRouterRtpCapabilities(routerRtpCapabilities);
              setDeviceStarted(true);
              try {
                await device.load({ routerRtpCapabilities });
                if (device.canProduce("video")) {
                  console.log("can produce video");
                  socket.emit("createSendTransport", device.sctpCapabilities);
                }
                if (existingProducers && existingProducers.length > 0) {
                  setPendingProducers(existingProducers);
                }
              } catch (err) {
                console.error("error", err);
                setDeviceStarted(false);
              }
            }

          } catch (error) {

            console.log(error);
          }

        }
      );
    }

  }, [mediaPopupVisible, sendTransport, device, loading]);
  useEffect(() => {
    if (!localStream || !sendTransport) return;

    const track = localStream.getVideoTracks()[0];
    if (!track) return;
    console.log("working");
    console.log("transport id", sendTransport.id);
    sendTransport.produce({
      track,
      appData: { mediaTag: "camera" }
    }).catch(console.error);
    setStreams((prev) => [localStream, ...prev]);

  }, [localStream, sendTransport,]);

  useEffect(() => {
    if (recvTransports && device.loaded && pendingProducers.length > 0) {
      const consumeAllPending = async () => {
        console.log("Draining pending producers:", pendingProducers.length);

        for (const p of pendingProducers) {
          await consumeProducer(p.id, p.socketId, recvTransports);
        }
        setPendingProducers([]);
      };

      consumeAllPending();
    }
  }, [recvTransports, device, pendingProducers]);

  const toggleMediaConstraint = (type) => {
    setMediaConstraints((prev) => ({
      ...prev,
      [type]: !prev[type], // Toggle individual flag
    }));
  };
  return (
    <div
      className="relative h-full w-full flex flex-col p-4 gap-4 bg-waikawa-gray-950"
      style={{ width: width }}
    >
      {/* 🎥 Media Access Card */}
      {mediaPopupVisible && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-waikawa-gray-100 border border-[#cbd5e11a] rounded-xl shadow-md p-6 flex flex-col items-center gap-4 w-full max-w-md">
            <h2 className="text-lg font-semibold text-mine-shaft-800">
              Grant Camera Access
            </h2>

            {/* Video preview or placeholder */}
            <div className="h-48 aspect-video rounded-md shadow-md border border-mine-shaft-200 flex items-center justify-center bg-mine-shaft-50 overflow-hidden">
              {localStream ? (
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  ref={(el) => el && (el.srcObject = localStream)}
                />
              ) : (
                <span className="text-mine-shaft-400">Camera preview will appear here</span>
              )}
            </div>

            <div className="flex gap-4 items-center justify-center">
              {/* 🎙️ Audio Toggle */}
              <button
                onClick={() => toggleMediaConstraint("audio")}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition
      ${mediaConstraints.audio
                    ? "bg-waikawa-gray-700 border-waikawa-gray-800 text-white"
                    : "bg-mine-shaft-50 border-mine-shaft-200 text-mine-shaft-400"
                  }
    `}
                title="Toggle Microphone"
              >
                {mediaConstraints.audio ? (
                  <MicrophoneIcon className="w-6 h-6" />
                ) : (
                  <MicrophoneIcon className="w-6 h-6" />
                )}
              </button>

              {/* 🎥 Video Toggle */}
              <button
                onClick={() => toggleMediaConstraint("video")}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition
      ${mediaConstraints.video
                    ? "bg-waikawa-gray-600 border-waikawa-gray-800 text-white"
                    : "bg-mine-shaft-50 border-mine-shaft-200 text-mine-shaft-400"
                  }
    `}
                title="Toggle Camera"
              >
                {mediaConstraints.video ? (
                  <VideoCameraIcon className="w-6 h-6" />
                ) : (
                  <VideoCameraSlashIcon className="w-6 h-6" />
                )}
              </button>


              {/* ▶️ Get Media Button */}
              <button
                onClick={handleGetMedia}
                disabled={!mediaConstraints.audio && !mediaConstraints.video}
                className={`px-4 py-2 rounded-md font-medium transition
      ${!mediaConstraints.audio && !mediaConstraints.video
                    ? "bg-mine-shaft-300 text-white cursor-not-allowed"
                    : "bg-waikawa-gray-500 hover:bg-waikawa-gray-600 text-white"
                  }
    `}
              >
                Get Media
              </button>
            </div>

            {/* Start Call */}
            {localStream && (
              <button
                onClick={handleStartCall}
                disabled={loading || !device}
                className={`w-full px-4 py-2 rounded text-white font-medium transition ${loading || !device
                  ? "bg-mine-shaft-300 cursor-not-allowed"
                  : "bg-waikawa-gray-600 hover:bg-waikawa-gray-800"
                  }`}
              >
                {loading ? "Loading..." : "Start Call"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🔽 Normal content after media access */}
      {callState && !mediaPopupVisible && (
        <>
          <ActiveConnections streams={streams} />
        </>
      )}

    </div>
  );
}

export default Silder

