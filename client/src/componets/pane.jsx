
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
  setRouterId
}) => {
  const [width, setWidth] = useState(window.innerWidth - window.innerWidth / 4);
  const [silderWidth, setSilderWidth] = useState((window.innerWidth - window.innerWidth / 4) / 2);
  console.log(window.innerWidth - window.innerWidth / 4);
  const currWindowWidth = window.innerWidth - window.innerWidth / 4;
  const isResizing = useRef(false);
  console.log(room);
  useEffect(()=>{
    if (isOpen) {
      setSilderWidth(currWindowWidth / 2);
      setWidth(currWindowWidth / 2);
    }
    else{
      setSilderWidth(0);
      setWidth(currWindowWidth);
    }

  },[isOpen])
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
//      console.log("width", width);
//      console.log("silderwidth", silderWidth);
//
//      console.log("client", e.clientX);
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
    <div className='flex flex-row'>
      <Message room={room} socket={socket} setRoom={setRoom} setOpen={setOpen} isConsumer={isConsumer} width={width} />
      {isOpen &&
        <>
          <div
            className='w-4 border-border cursor-ew-resize '
            onMouseDown={() => {
              isResizing.current = true;
            }}
          >
          </div>
          <Silder isConsumer={isConsumer} width={silderWidth} MessageSocket={socket} room={room} routerId={routerId} setRouterId={setRouterId} /></>
      }
    </div>
  )
}

export default Pane
