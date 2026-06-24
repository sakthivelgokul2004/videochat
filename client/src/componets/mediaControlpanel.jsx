import React, { useState } from 'react';
import {
  MicrophoneIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  PhoneXMarkIcon,
   ShareIcon,
} from "@heroicons/react/24/solid";
import { MicrophoneIcon as MicrophoneOffIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";


const ControlButton = ({ onClick, active, danger, label, children }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center gap-1
      w-16 h-16 md:w-14 md:h-14 rounded-full
      transition-all duration-200 ease-in-out
      active:scale-90 select-none
      border border-white/10 shadow-lg
      ${danger
        ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
        : active
          ? "bg-[#3c4043] hover:bg-[#4c5054]"
          : "bg-red-500/90 hover:bg-red-600"
      }
    `}
  >
    <span className="text-white">{children}</span>
  </button>
);

const MediaControlPanel = ({ mediaConstraints, toggleMediaConstraint, onLeave }) => {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const handleLeave = () => {
    if (showLeaveConfirm) {
      onLeave?.();
    } else {
      setShowLeaveConfirm(true);
      setTimeout(() => setShowLeaveConfirm(false), 3000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Prefer the native share sheet on mobile/supported browsers
    if (navigator.share) {
      try {
        await navigator.share({ title: "VideoChat Link", url });
        return;
      } catch (err) {
        // User cancelled the share sheet — don't fall through to clipboard
        if (err?.name === "AbortError") return;
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Invite link copied");
    } catch (err) {
      toast.error("Couldn't copy link");
      console.error("Failed to copy call link:", err);
    }
  };

  return (

    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient backdrop */}
      <div className="pt-8 pb-6 px-4 pointer-events-auto">

        {/* Leave confirm toast */}
        {showLeaveConfirm && (
          <div className="flex justify-center mb-3 animate-fade-in">
            <div className="bg-red-600/90 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full shadow-lg">
              Tap again to leave the call
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 md:gap-6 ">

          {/* MIC */}
          <ControlButton
            onClick={() => toggleMediaConstraint("audio")}
            active={mediaConstraints.audio}
            label={mediaConstraints.audio ? "Mute" : "Unmute"}
          >
            {mediaConstraints.audio
              ? <MicrophoneIcon className="w-6 h-6" />
              : <MicrophoneOffIcon className="w-6 h-6" />
            }
          </ControlButton>

          {/* CAMERA */}
          <ControlButton
            onClick={() => toggleMediaConstraint("video")}
            active={mediaConstraints.video}
            label={mediaConstraints.video ? "Stop" : "Start"}
          >
            {mediaConstraints.video
              ? <VideoCameraIcon className="w-6 h-6" />
              : <VideoCameraSlashIcon className="w-6 h-6" />
            }
          </ControlButton>
          <ControlButton
            onClick={handleShare}
            active={true}
            label="Share"
          >
            <ShareIcon className="w-6 h-6" />
          </ControlButton>


          {/* END CALL — wider pill shape */}
          <button
            onClick={handleLeave}
            className={`
              flex flex-col items-center justify-center gap-1
              w-20 h-16 md:w-20 md:h-14 rounded-full
              transition-all duration-200 ease-in-out
              active:scale-90 select-none shadow-lg
              border border-white/10
              ${showLeaveConfirm
                ? "bg-red-700 scale-105 ring-2 ring-red-400"
                : "bg-red-500 hover:bg-red-600"
              }
            `}
          >
            <PhoneXMarkIcon className="w-6 h-6 text-white" />
            <span className="text-[10px] text-white/80 font-medium leading-none hidden md:block">
              Leave
            </span>
          </button>

        </div>

      </div>
      <Toaster />
    </div>
  );
};

export default MediaControlPanel;

//<span className="text-[10px] text-white/80 font-medium leading-none hidden md:block">
//  {label}
//</span>
