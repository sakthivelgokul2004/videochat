import PeerCard from "./peerCard";
import Carousel from "./carousel";
import useWindowSize from "../hooks/useWindowSize";

const ActiveConnections = ({ peers, localStream, localUserData }) => {
  console.log(peers);
  const remotePeers = Array.from(peers.values());
  console.log("arrayof", remotePeers);
  const width = useWindowSize();
  const getItemsPerSlide = () => {
    if (width < 768) return 3;   // Mobile
    if (width < 1024) return 6;  // Medium/Tablet
    return 9;                    // Desktop
  };
  const allPeers = [
    {
      socketId: "local",
      userData: localUserData,
      stream: localStream,
      isLocal: true,
    },
    ...remotePeers.map((p) => ({ ...p, isLocal: false })),
  ];

  const itemsPerSlide = getItemsPerSlide();

  const getLayout = () => {
    const slides = [];

    for (let i = 0; i < allPeers.length; i += itemsPerSlide) {
      const peersInSlide = allPeers.slice(i, i + itemsPerSlide);
      console.log("siles",slides);
      slides.push(
        <SlideLayout key={`slide-${i}`} peers={peersInSlide} />
      );
    }
    return slides;
  };
  return (
    <>
      {/*<PeerCard userData={localUserData} stream={localStream} isLocal={true} />*/}
      <Carousel slides={getLayout()} />
    </>
  );
};

export default ActiveConnections;
const SlideLayout = ({ peers }) => {
  const count = peers.length;

  const PeerWrapper = ({ peer, className }) => (
    <div className={`transition-all duration-500 ease-in-out ${className}`}>
      <PeerCard userData={peer.userData} stream={peer.stream} isLocal={peer.isLocal} />
    </div>
  );

  return (
    <div className="w-full h-full max-h-screen overflow-hidden p-2">

      {/* 1 peer: portrait on mobile, landscape on desktop */}
      {count === 1 && (
        <div className="flex items-center justify-center w-full h-full animate-fade-in">
          <div className="w-full h-full md:h-auto md:max-w-4xl md:aspect-video transition-all duration-500 ease-in-out">
            <PeerCard {...peers[0]} />
          </div>
        </div>
      )}

      {/* 2 peers: stacked on mobile, side by side on desktop */}
      {count === 2 && (
        <div className="flex flex-col md:flex-row gap-2 w-full h-full">
          {peers.map((peer) => (
            <PeerWrapper
              key={peer.socketId}
              peer={peer}
              className="w-full flex-1 md:h-full"
            />
          ))}
        </div>
      )}

      {/* 3 peers: mobile = stacked column, desktop = 1 top + 2 bottom */}
      {count === 3 && (
        <div className="flex flex-col gap-2 w-full h-full">
          <div className="w-full flex-1 transition-all duration-500 ease-in-out">
            <PeerCard
              userData={peers[0].userData}
              stream={peers[0].stream}
              isLocal={peers[0].isLocal}
            />
          </div>
          <div className="flex flex-row gap-2 w-full flex-1">
            {peers.slice(1).map((peer) => (
              <PeerWrapper
                key={peer.socketId}
                peer={peer}
                className="flex-1 h-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* 4 peers: 2x2 on both mobile and desktop */}
      {count === 4 && (
        <div className="grid grid-cols-2 gap-2 w-full h-full">
          {peers.map((peer) => (
            <PeerWrapper
              key={peer.socketId}
              peer={peer}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* 5-6 peers: 2 cols on mobile, 3 cols on desktop */}
      {count >= 5 && count <= 6 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-full">
          {peers.map((peer) => (
            <PeerWrapper
              key={peer.socketId}
              peer={peer}
              className="aspect-video w-full"
            />
          ))}
        </div>
      )}

      {/* 7-9 peers: 3 cols on both, tighter on mobile */}
      {count >= 7 && (
        <div className="grid grid-cols-3 gap-1 md:gap-2 w-full h-full">
          {peers.map((peer) => (
            <PeerWrapper
              key={peer.socketId}
              peer={peer}
              className="aspect-video w-full"
            />
          ))}
        </div>
      )}

    </div>
  );
};
