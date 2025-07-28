import React, { useEffect, useRef, useState } from 'react'
import useDevice from '../hooks/device'
import socket from "../utils/socket"
import ActiveConnections from './layout'
import {
  MicrophoneIcon,


  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/solid";
/** @typedef {import('mediasoup-client').Transport} Transport */

const Silder = (props) => {
  let [device, loading, error] = useDevice()
  const [routerRtpCapabilities, setRouterRtpCapabilities] = useState(null)
  const [clientRtpCapabilites, setclientRtpCapabilites] = useState();
  /** @type {[Transport|undefined, Function]} */
  const [sendTransport, setSendTrasport] = useState();
  const [socketLoading, setSocketLoading] = useState(true);
  const [recvTransports, setRecvTrasports] = useState([]);
  const [transportState, setTransportState] = useState(false);
  const [camState, setCamState] = useState(false);
  const ref = useRef();
  const Remoteref = useRef();
  const [streams, setStreams] = useState([]);
  const { isConsumer } = props;
  const [callState, setCallState] = useState(true);
  const [mediaPopupVisible, setMediaPopupVisible] = useState(true);
  const [localStream, setLocalStream] = useState(null);
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
  useEffect(() => {
    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log("eroor", err);
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });
    console.log("socketloading ", socketLoading);
    if (!routerRtpCapabilities) {
      console.log("socket", socket);

      socket.emit("getRtpCapabilities", async (cap) => {
        if (!loading && device) {
          console.log("got rtp capabilities", cap);
          setRouterRtpCapabilities(cap)
          device.load({ routerRtpCapabilities: cap }).then(() => {
            if (device.canProduce("video")) {
              console.log("can produce video")
              setclientRtpCapabilites(device.rtpCapabilities);
              socket.emit("createSendTransport", device.sctpCapabilities);
            }
          }).catch((err) => {
            console.log("error", err)
          })
        }
      })
    }
    return () => {
      socket.off("rtpCapabilities");
    }
  }, [loading, routerRtpCapabilities, socketLoading])

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
          setTransportState(true);
          setSendTrasport(transport);
        }

      } catch (error) {
        console.log('error', error)

      }
    })
    socket.on("newProducer", async ({ producerId, socketId }) => {
      socket.emit("createReciveTransport", (transportparms) => {
        console.log("new trrpoart, ", transportparms);
        const newRecvTransport = device.createRecvTransport(transportparms);
        newRecvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          socket.emit("recvTransportConnect", dtlsParameters);
          callback();
        });
        console.log("newRecvTransport", newRecvTransport);
        socket.emit("consume", { producerId, clientRtpCapabilites, socketId }, async ({ id, kind, rtpParameters }) => {
          const consumer = await newRecvTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters
          });
          console.log("consumer", consumer);
          const stream = new MediaStream();
          const { track } = consumer
          stream.addTrack(track);
          console.log("stream", stream);
         // Remoteref.current.onloadedmetadata = () => {
         //   console.log("✅ video loaded");
         //   Remoteref.current.play();
         // };
          setStreams((prev) => [...prev, stream]);
          console.log("strems",streams);
          setRecvTrasports((prev) => [...prev, newRecvTransport]);
          socket.emit("consumerResume", { consumerId: id, });
          console.log("consumed strem", stream);
          console.log({
            readyState: consumer.track.readyState,
            muted: consumer.track.muted,
            paused: consumer.paused,
            closed: consumer.closed
          });

        });
      });
    });

    return () => {
      socket.off("newProducer");
      socket.off("rtpCapabilities");

    }
  }, [loading, device, clientRtpCapabilites, recvTransports, sendTransport, socketLoading])

  useEffect(() => {
    if (sendTransport != null) {
      sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
        socket.emit("sendTransportConnect", dtlsParameters);
        callback();
      });
      sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
        console.log("produce", kind, rtpParameters, appData);
        socket.emit("produce", {
          transportId: sendTransport.id,
          kind,
          rtpParameters,
          appData
        }, (response) => { callback({ id: response.id }) });
        ;
      });
    }

  }, [camState, transportState, sendTransport])
  async function inial() {
    let localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          min: 640,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        }
      }
    },
    );
    const videoTrack = localStream.getVideoTracks()[0];

    console.log("trsanpot is ", sendTransport);
    if (sendTransport && videoTrack) {

      try {
        await sendTransport.produce({
          track: videoTrack,
          appData: { mediaTag: 'camera' }
        });
      } catch (err) {
        console.error("produce error", err);
      }
    }
    setStreams((prev) => [...prev, localStream]);

    console.log("localstream", localStream);
  }

  const handleGetMedia = async (state) => {
    toggleMediaConstraint(state);
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
    if (!mediaPopupVisible && localStream && sendTransport) {
      const videoTrack = localStream.getVideoTracks()[0];
      sendTransport
        .produce({
          track: videoTrack,
          appData: { mediaTag: 'camera' }
        })
        .catch(console.error);

      setStreams(prev => [localStream, ...prev]);
    }
  }, [mediaPopupVisible, localStream, sendTransport]);

  const toggleMediaConstraint = (type) => {
    setMediaConstraints((prev) => ({
      ...prev,
      [type]: !prev[type], // Toggle individual flag
    }));
  };
  return (
    <div
      className="relative h-full w-full flex flex-col p-4 gap-4 bg-waikawa-gray-950"
      style={{ width: props.width }}
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

