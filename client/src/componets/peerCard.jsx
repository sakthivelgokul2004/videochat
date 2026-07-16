const PeerCard = ({ userData, stream, isLocal = false }) => {
  const userName = userData?.userName ?? "Guest";
  const photoURL = userData?.photoURL ?? null;
  const isAudioMuted = userData?.isAudioMuted ?? true;
  const isVideoMuted = userData?.isVideoMuted ?? true;

  return (
    /* We remove 'aspect-video' so the parent grid can control the ratio */
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-meet-dark shadow-lg animate-fade-in">

      {/* 1. Video Layer */}
      {stream && (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={(video) => {
            if (video && video.srcObject !== stream) video.srcObject = stream;
          }}
          className={`absolute inset-0 h-full w-full object-cover   
            ${/'isLocal ? "scale-x-[-1]" : ""'/}
        ${isVideoMuted ? "hidden" : "block"}`}
        />
      )}

      {/* 2. Muted/Avatar Layer */}
      {isVideoMuted && (
        <div className="flex h-full w-full items-center justify-center bg-meet-dark">
          {photoURL ? (
            <img
              src={photoURL}
              alt={userName}
              className="h-24 w-24 rounded-full object-cover border-2 border-meet-grey"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-meet-grey text-3xl text-white">
              {userName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* 3. Overlay UI */}
      <div className="absolute bottom-0  w-full flex items-center justify-between text-white bg-meet-dark p-2 border-t-2  border-t-border  rounded-t-sm">
        <span className="text-sm font-semibold truncate px-1">{userName}</span>
        {isAudioMuted && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/80 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
export default PeerCard;
