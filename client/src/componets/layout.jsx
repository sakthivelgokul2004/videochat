import { useEffect, useRef } from "react";

const ActiveConnections = ({ streams }) => {
  const videoRefs = useRef([]);

  //console.log("ActiveConnections streams", streams);
  useEffect(() => {
    // Trim or expand videoRefs to match streams
    videoRefs.current = videoRefs.current.slice(0, streams.length);

    streams.forEach((stream, index) => {
      const videoEl = videoRefs.current[index];
      if (videoEl && stream) {
        try {
          videoEl.srcObject = stream;
        } catch (err) {
          console.error("Failed to attach stream", err);
        }
      }
    });
  }, [streams]);

  const getGridLayout = (count) => {
    if (count === 1) return "grid-cols-1 max-w-4xl";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-6xl";
    if (count <= 4) return "grid-cols-2 max-w-6xl";
    return "grid-cols-2 lg:grid-cols-3 max-w-7xl";
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-base-300 p-4 overflow-hidden">
      <div
        className={`grid gap-4 w-full h-fit mx-auto ${getGridLayout(streams.length)}`}
      >
        {streams.map((_, index) => (
          <div
            key={index}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              autoPlay
              playsInline
              className="w-full h-full object-cover" // Ensures the video fills the 16:9 box
            />
            {/* Optional Overlay for name/status */}
            <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-1 rounded-md text-white text-xs">
              Participant {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveConnections;
