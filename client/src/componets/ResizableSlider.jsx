// components/ResizableSlider.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ResizableSlider({
  isOpen = false,
  initialWidth = 600,
  minWidth = 250,
  maxWidth = 700,
  onClose,
  children,
}) {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const stopResize = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [minWidth, maxWidth]);

  return (
    <div
      className="absolute top-0 right-0 h-full z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out"
      style={{
        width: width,
        transform: isOpen ? "translateX(0)" : `translateX(${width}px)`,
      }}
    >
      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 h-full w-8 cursor-ew-resize bg-border hover:bg-gray-400"
        onMouseDown={() => {
          isResizing.current = true;
        }}
      />

      {/* Optional close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 border rounded"
        >
          Close
        </button>
      )}

      {/* Panel content */}
      <div className="w-full h-full overflow-auto">{children}</div>
    </div>
  );
}

