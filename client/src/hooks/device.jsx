
import { useEffect, useState } from 'react'
import {
  types,
  version,
  Device,
  detectDeviceAsync,
  parseScalabilityMode,
  debug
} from "mediasoup-client";

export const useDevice = () => {
   /** @type {[boolean, Function]} */
  const [loading, setloading] = useState(true)
 /** @type {[Device|undefined, Function]} */ 
  const [device, setDevice] = useState()
  /** @type {[Error|undefined, Function]} */
  const [error, setError] = useState()
  useEffect(() => {
    async function init() {
      try {
        setloading(true)
        const device = await Device.factory();
        setDevice(device);
        
        setloading(false);
      } catch (e) {
        setError(e)
      }
    }
    init();

  }, [])
  return [
    device,
    loading,
    error

  ]
}

export default useDevice;
