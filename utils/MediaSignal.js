
function SendTransportSignal() {
  const transports= new Map();

  const setSendTransport= (socketid, transport) => {
    transports.set(socketid, transport);
  };


  const getSendTransportById=(socketid)=>{
    return transports.get(socketid);
  }
  const deleteSendTransport= (socketid) => {
    transports.delete(socketid);
  };
  const getAllSendTransports = () => {
    return Array.from(transports.values());
  }

  return{
    setSendTransport,
    getSendTransportById,
    deleteSendTransport,
    getAllSendTransports
  }
}
function RecvTransportSignal() {
  const transports= new Map();

  const setRecvTransport= (socketid, transport) => {
    transports.set(socketid, transport);
  };


  const getRecvTransportById=(socketid)=>{
    return transports.get(socketid);
  }
  const deleteRecvTransport= (socketid) => {
    transports.delete(socketid);
  };
  const getAllRecvTransports = () => {
    return Array.from(transports.values());
  }

  return{
    setRecvTransport,
    getRecvTransportById,
    deleteRecvTransport,
    getAllRecvTransports
  }
}
function ProducerSingal() {
  const producers= new Map();

  const setProducers= (socketid, producer) => {
    producers.set(socketid, producer);
  };


  const getProducersById=(socketid)=>{
    return producers.get(socketid);
  }
  const deleteProducers= (socketid) => {
    producers.delete(socketid);
  };

  return{
    setProducers,
    getProducersById,
    deleteProducers,
  }
}
export default {SendTransportSignal,RecvTransportSignal,ProducerSingal};
