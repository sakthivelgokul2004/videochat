import { useState, useEffect, useCallback, useRef } from 'react';

import socket from "../utils/socket";
import {
  Device,
} from "mediasoup-client";
/** @typedef {import('mediasoup-client/lib/types').Transport} Transport */
/** @typedef {import('mediasoup-client/lib/types').Device} DeviceType */
/** @typedef {import('mediasoup-client/lib/types').RtpCapabilities} RtpCapabilities */
/** @template T @typedef {React.RefObject<T>} Ref<T> */
export const useMediaSoup = () => {
  /** @type {Ref<DeviceType | null>} */
  const deviceRef = useRef(null);
  /** @type {Ref<Transport| null>} */
  const sendTransport = useRef();
  /** @type {Ref<Transport| null>} */
  const recvTransports = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [localStream, setLocalStream] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [sendTransportState, setSendTransportState] = useState(false);
  const [CallStarted, setCallStarted] = useState(false);
  const pendingProducersRef = useRef([]);
  const [mediaConstraints, setMediaConstraints] = useState({
    audio: false,
    video: false,
  });
  const videoProducerRef = useRef(null);
  const audioProducerRef = useRef(null);
  const [peers, setPeers] = useState(new Map());
  const videoref = useRef(null);
  const videoElementRef = useRef(null);
  const [userState, setUserState] = useState({
    userName: "",
    photoURL: "",
    isAudioMuted: true,
    isVideoMuted: true,
  });

  const setUserName = (name, photoUrl) => {
    setUserState((preves) => {
      return {
        ...preves,
        userName: name,
        photoURL: photoUrl

      }
    })
  };

  const toggleMediaConstraint = (type) => {
   setUserState((prevs) => {
     let current={...prevs};
     if (mediaConstraints[type] == true && type == "audio") {
       current = { ...prevs, isAudioMuted: true }
     }
     if (mediaConstraints[type] == true && type == "video") {
       current = { ...prevs, isVideoMuted: true }
     }
     return current
   });
    setMediaConstraints((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  useEffect(() => {
    const handleGetMedia = async () => {
      if (!mediaConstraints.audio && !mediaConstraints.video) {
        if (videoref.current) {
          videoref.current.getTracks().forEach(track => track.stop());
          videoref.current = null;
        }
        setLocalStream(null);
        setUserState(prev => ({ ...prev, isAudioMuted: true, isVideoMuted: true }));
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: mediaConstraints.audio,
          video: mediaConstraints.video ? { width: 1280, height: 720 } : false,
        });
        if (videoref.current) {
          videoref.current.getTracks().forEach(track => {
            // If track type is now false in constraints, stop the old hardware track
            if (!mediaConstraints[track.kind]) track.stop();
          });
        }
        videoref.current = stream;
        setLocalStream(stream);
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
        }
        setUserState((prev) => ({
          ...prev,
          isAudioMuted: !mediaConstraints.audio,
          isVideoMuted: !mediaConstraints.video,
        }));


      } catch (err) {
        console.error("Media Error:", err);
        // Fallback: If hardware fails, ensure UI shows muted
        setMediaConstraints({ audio: false, video: false });
      }

    };
    handleGetMedia();
  }, [mediaConstraints.audio, mediaConstraints.video])
  useEffect(() => {
    if (!CallStarted) return;
    console.log("emitupdae",userState);
    socket.emit('updateMetadata', userState);
  }, [userState])
  useEffect(() => {
    socket.on("newProducer", async ({ producerId, socketId, metaData }) => {
      console.log("new Proceduer", producerId, socketId)
      consumeProducer(producerId, socketId, metaData)
    })
    socket.on('peerMetadataUpdated', ({ socketId, metadata }) => {
      console.log(" peerMetadataUpdated");
      setPeers((prevMap) => {
        if (!prevMap.has(socketId)) return prevMap;

        const newMap = new Map(prevMap);
        const existingPeer = newMap.get(socketId);
        newMap.set(socketId, {
          ...existingPeer,
          userData: metadata
        });

        return newMap;
      });
    });
    socket.on('peerLeft', (socketId) => {
      setPeers((prevMap) => {
        if (!prevMap.has(socketId)) return prevMap;
        const newMap = new Map(prevMap);
        newMap.delete(socketId); // Remove the user from the grid
        return newMap;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    const syncProducers = async () => {
      // Guard: We need a transport to send anything
      if (!sendTransport.current || !sendTransportState) return;

      // Helper to handle both Audio and Video with the same logic
      const handleTrack = async (kind, track, producerRef) => {
        const isEnabled = mediaConstraints[kind];

        if (isEnabled && track) {
          if (!producerRef.current) {
            // 1. Create Producer if it doesn't exist
            producerRef.current = await sendTransport.current.produce({
              track,
              appData: { type: kind }
            });
            console.log(`${kind} producer created`);
          } else {
            // 2. Replace Track if producer exists (prevents re-consuming)
            await producerRef.current.replaceTrack({ track });
            console.log(`${kind} track replaced`);
          }
        } else if (producerRef.current) {
          // 3. Cleanup: If toggled OFF, close the producer or stop the track
          // In Mediasoup, it's often safer to close and nullify to signal others
          //producerRef.current.close();
          //producerRef.current = null;
          console.log(`${kind} producer closed`);
        }
      };

      // Get current tracks from the local stream
      const videoTrack = videoref.current?.getVideoTracks()[0];
      const audioTrack = videoref.current?.getAudioTracks()[0];

      // Run both independently
      await handleTrack('video', videoTrack, videoProducerRef);
      await handleTrack('audio', audioTrack, audioProducerRef);
    };

    syncProducers();
  }, [mediaConstraints, localStream, sendTransportState]);
  useEffect(() => {
    if (CallStarted && isLoaded) {
      console.log("one run time");
      socket.emit("createSendTransport", (transportparms) => {
        console.log(transportparms);
        createSendTransport(transportparms)
      })
      socket.emit("createReciveTransport", (transportparms) => {
        createReciveTransport(transportparms)
      })
    }
  }, [isLoaded, CallStarted])
  const roomIsAlive = (roomId) => {
    return new Promise((resolve) => {

      socket.emit("room", roomId, (isExist) => {
        if (isExist) {
          resolve(roomId);
        } else {
          console.log("Room does not exist:", roomId);
          resolve(null);
        }
      });
    })
  }
  const initDevice = useCallback(async (routerRtpCapabilities) => {
    try {
      console.log(routerRtpCapabilities);
      const device = new Device();
      await device.load({ routerRtpCapabilities });
      console.log(device.loaded);
      deviceRef.current = device;
      setIsLoaded(true);
      return device;
    } catch (error) {
      console.error("Failed to load device:", error);
    }
  }, []);
  const createSendTransport = useCallback(async (params) => {
    const device = deviceRef.current;
    if (!device) return;
    let transport = device.createSendTransport({
      id: params.id,
      iceParameters: params.iceParameters,
      iceCandidates: params.iceCandidates,
      dtlsParameters: params.dtlsParameters,
      sctpParameters: params.sctpParameters,
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        },]
    })
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
    transport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
      console.log("produce", kind, rtpParameters, appData, transport.id);
      socket.emit("produce", {
        transportId: transport.id,
        kind,
        rtpParameters,
        appData
      }, (response) => { callback({ id: response.id }) });

    });
    console.log("create ed send");
    sendTransport.current = transport
    setSendTransportState(true);
  }, [])

  const createReciveTransport = useCallback(async (params) => {
    const device = deviceRef.current;
    if (!device) return;
    try {
      const newRecvTransport = device.createRecvTransport(params);
      newRecvTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
        socket.emit("recvTransportConnect", dtlsParameters);
        callback();
      });
      recvTransports.current = newRecvTransport;
      console.log("create ed rcv");
      console.log(pendingProducersRef);
      if (pendingProducersRef.current.length > 0) {
        consumeAllPending();
        console.log("called consumeAllPending");
      }
    } catch (error) {
      console.log('Error creating receive transport:', error);
    }
  }, [])
  const produce = useCallback(async (track, appData = {}) => {
    if (!sendTransport.current) throw new Error("Send transport not ready");
    return await sendTransport.current.produce({ track, appData });
  }, []);

  const consumeProducer = async (producerId, socketId, metadata) => {
    if (socketId === socket.id) return;
    const device = deviceRef.current;
    if (!device) return;

    console.log("consuimg", producerId, socketId);
    const transport = recvTransports.current;

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

    }, async ({ id, kind, rtpParameters, error }) => {
      try {
        if (error != undefined) {
          console.log("error", error);
          return;
        }
        console.log("cosume", id, kind, rtpParameters)
        const consumer = await transport.consume({
          id,
          producerId,
          kind,
          rtpParameters
        });

        const stream = new MediaStream([consumer.track]);
        setPeers((prevMap) => {
          const newMap = new Map(prevMap);
          const existingPeer = newMap.get(socketId) || { producers: [], streams: [] };

          // Create a new entry or update the existing one
          newMap.set(socketId, {
            ...existingPeer, // Keep existing metadata
            socketId,
            userData: metadata,
            // Add the new stream to the list instead of overwriting
            producers: [...existingPeer.producers, stream],
            // Usually, you want one MediaStream containing all tracks for that user
            stream: existingPeer.stream
              ? (existingPeer.stream.addTrack(consumer.track), existingPeer.stream)
              : new MediaStream([consumer.track])
          });

          return newMap;
        });
        socket.emit("consumerResume", { consumerId: id });
      } catch (err) {
        console.error("Chrome SDP Error:", err.message);
      }
    });
  };

  const consumeAllPending = useCallback(async (existingProducers) => {
    if (existingProducers) {
      console.log("call pendinf exist");
      pendingProducersRef.current = existingProducers;
    }
    const device = deviceRef.current;
    const transport = recvTransports.current;

    if (device && transport) {
      console.log("Draining pending producers:", pendingProducersRef.current.length);
      const producersToConsume = [...pendingProducersRef.current];
      pendingProducersRef.current = [];
      for (const p of producersToConsume) {
        await consumeProducer(p.id, p.socketId, p.metadata);
      }

    }
  }, []);

  const EnterRoom = async (type, roomId) => {
    return new Promise((resolve) => {
      socket.emit(
        "joinRoom",
        type,
        roomId,
        userState,
        async ({ roomId, routerRtpCapabilities, existingProducers }) => {
          initDevice(routerRtpCapabilities);
          setCallStarted(true);
          if (type == "join") {
            console.log("existing ", existingProducers);
            consumeAllPending(existingProducers);
            resolve(null)
          } else {
            resolve(roomId);
          }
        }
      );
    });
  }
  const leaveRoom = useCallback(() => {
    // Close producers
    if (videoProducerRef.current) {
      videoProducerRef.current.close();
      videoProducerRef.current = null;
    }
    if (audioProducerRef.current) {
      audioProducerRef.current.close();
      audioProducerRef.current = null;
    }
    // Close transports
    if (sendTransport.current) {
      sendTransport.current.close();
      sendTransport.current = null;
    }
    if (recvTransports.current) {
      recvTransports.current.close();
      recvTransports.current = null;
    }
    // Stop local media tracks
    if (videoref.current) {
      videoref.current.getTracks().forEach((track) => track.stop());
      videoref.current = null;
    }
    setLocalStream(null);
    setCallStarted(false);
    setPeers(new Map());
    socket.disconnect();
  }, []);
  return { CallStarted, localStream, peers, userState, videoElementRef, mediaConstraints, toggleMediaConstraint, EnterRoom, roomIsAlive, setUserName ,leaveRoom};
};
