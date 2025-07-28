import { useState } from "react";

export default function Loading(props) {
 return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="flex items-center gap-3 mb-6">
        {/* Animated Camera Icon */}
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-3xl font-bold tracking-wide animate-pulse">
          VideoChat
        </h1>
      </div>
      <p className="text-lg opacity-80">Setting up your video room...</p>
    </div>
  );
}
