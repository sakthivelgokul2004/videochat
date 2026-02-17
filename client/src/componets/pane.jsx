
import React, { useEffect, useRef, useState } from 'react'
import Message from "./messageDisplay";
import Silder from './silder';

const Pane = ({
  isOpen = false,
  minWidth = 250,
  maxWidth = 700,
  room,
  setRoom,
  socket,
  setOpen,
  isConsumer,
  routerId,
  setRouterId,
  isNavbarOpen,
  setIsNavbarOpen
}) => {
  const [width, setWidth] = useState(window.innerWidth - window.innerWidth / 4);
  const [silderWidth, setSilderWidth] = useState((window.innerWidth - window.innerWidth / 4) / 2);
  console.log(window.innerWidth - window.innerWidth / 4);
  const currWindowWidth = window.innerWidth - window.innerWidth / 4;
  const isResizing = useRef(false);
  console.log(room);
  useEffect(() => {
    if (isOpen) {
      setSilderWidth(currWindowWidth / 2);
      setWidth(currWindowWidth / 2);
    }
    else {
      setSilderWidth(0);
      setWidth(currWindowWidth);
    }

  }, [isOpen])
  useEffect(() => {
    if (window.innerWidth < 640) return;
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      let newSilderWidth = e.clientX;
      let newWidth = currWindowWidth - e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSilderWidth(newWidth);
        setWidth(newSilderWidth);
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
    <div className="flex flex-row h-full w-full overflow-hidden">

      {/* MESSAGE SECTION */}
      <div
        style={{ width: window.innerWidth < 640 ? '100%' : `${width}px` }}
        className={`${isOpen && 'hidden sm:block'} h-full transition-all`}
      >
        <Message
          room={room}
          socket={socket}
          setRoom={setRoom}
          setOpen={setOpen}
          setIsNavbarOpen={setIsNavbarOpen}
          isConsumer={isConsumer}
          width="100%"
        />
      </div>

      {/* RESIZER BAR: Desktop Only */}
      {isOpen && (
        <div
          className="hidden sm:block w-1 bg-border cursor-ew-resize hover:bg-primary transition-colors"
          onMouseDown={() => { isResizing.current = true; }}
        />
      )}

      {/* SLIDER SECTION (Video/Info) */}
      {isOpen && (
        <div
          style={{ width: window.innerWidth < 640 ? '100%' : `${silderWidth}px` }}
          className="h-full bg-base-200"
        >
          <Silder
            isConsumer={isConsumer}
            width="100%"
            MessageSocket={socket}
            room={room}
            routerId={routerId}
            setRouterId={setRouterId}
          />
        </div>
      )}
    </div>
  )
}

export default Pane
//<div className='flex flex-row'>
//  <Message room={room} socket={socket} setRoom={setRoom} setOpen={setOpen} isConsumer={isConsumer} width={width} />
//  {isOpen &&
//    <>
//      <div
//        className='w-4 border-border cursor-ew-resize '
//        onMouseDown={() => {
//          isResizing.current = true;
//        }}
//      >
//      </div>
//      <Silder isConsumer={isConsumer} width={silderWidth} MessageSocket={socket} room={room} routerId={routerId} setRouterId={setRouterId} /></>
//  }
//</div>
