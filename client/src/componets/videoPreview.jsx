import React, { useState } from "react";
import {
  MicrophoneIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/solid";
import Navbar from "./navbar";

const VideoPreview = ({ mediaConstraints, toggleMediaConstraint, videoElementRef, JoinRoom, isRoomExist, isCall, isAuth }) => {
  const [guestName, setGuestName] = useState("");
  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const handleCall = () => {
    if (!isAuth && !guestName.trim()) {
      setNameIsEmpty(true); // 1. Trigger the empty state error
      return; // Stop the function from continuing
    }
    if (isRoomExist) {
      JoinRoom("join", guestName)
    } else {
      JoinRoom("create", guestName);
    }
  }
  return (
    <div className="h-dvh flex flex-col bg-base-200">
      <Navbar />
      <div className="flex-grow flex  items-center justify-center ">
        <div className="w-full max-w-3xl">

          <div className="relative bg-black rounded-xl overflow-hidden aspect-video">

            {(
              <video
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                ref={videoElementRef}
              />
            )}

            {/* OVERLAY CONTROLS */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">

              {/* MIC */}
              <button
                onClick={() => toggleMediaConstraint("audio")}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg
              ${mediaConstraints.audio
                    ? "bg-[#3c4043] text-white"
                    : "bg-[#ea4335] text-white"
                  }`}
              >
                <MicrophoneIcon className="w-6 h-6" />
              </button>

              {/* CAMERA */}
              <button
                onClick={() => toggleMediaConstraint("video")}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-lg
              ${mediaConstraints.video
                    ? "bg-[#3c4043] text-white"
                    : "bg-[#ea4335] text-white"
                  }`}
              >
                {mediaConstraints.video ? (
                  <VideoCameraIcon className="w-6 h-6" />
                ) : (
                  <VideoCameraSlashIcon className="w-6 h-6" />
                )}
              </button>

            </div>
          </div>
          {!isAuth && (
            <div className="flex justify-center mt-4">
              <input
                type="text"
                placeholder={ nameIsEmpty? "⚠ Name is required to join" : "Enter your name to join"}
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (e.target.value.trim()) {
                    setNameIsEmpty(false);
                  }
                }}
                className={`input input-bordered   w-4/5 rounded-lg ${nameIsEmpty ? "input-error placeholder-error" : "input-accent"
                  }`}
              />
            </div>
          )}
          {/* JOIN BUTTON */}
          {(
            <div className="flex justify-center mt-6">
              <button className="px-8 py-3 bg-[#1a73e8] hover:bg-[#1669c1] text-white rounded-full font-semibold shadow-lg" onClick={handleCall} >
                {isRoomExist ? "Join now" : isCall ? "Call " : "Create Room"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;

