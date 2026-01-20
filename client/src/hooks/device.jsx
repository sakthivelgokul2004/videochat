
import { useEffect, useState } from 'react'
import {
  Device,
} from "mediasoup-client";
/** @typedef {import('mediasoup-client').types.Device} */

/**
* @returns {[Device | undefined, boolean, Error | undefined]}
*/
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
        /** @type {Device} */
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
