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

  return (
    <div
      className="grid w-full h-full gap-4 p-4 auto-rows-fr"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
      }}
    >
      {streams.map((_, index) => (
        <video
          key={index}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          autoPlay
          playsInline
          muted={false}
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      ))}
    </div>
  );
};

export default ActiveConnections;
