
/**
 * @typedef {import("mediasoup").types.Transport} Transport
 * @typedef {import("mediasoup").types.Producer} Producer
 * @typedef {import("mediasoup").types.Consumer} Consumer
 */

/**
 * A class that manages mediasoup transports, producers, and consumers
 * for each socket ID grouped by room.
 */
export class PeerStore {
  constructor() {
    /** @type {Map<string, Map<string, Transport>>} */
    this.sendTransports = new Map();

    /** @type {Map<string, Map<string, Transport>>} */
    this.recvTransports = new Map();

    /** @type {Map<string, Map<string, Map<string, Producer>>>} */
    this.producers = new Map();

    /** @type {Map<string, Map<string, Map<string, Consumer>>>} */
    this.consumers = new Map();
  }

  /**
   * Ensure a nested map exists for the given roomId.
   * @param {Map<string, Map>} map
   * @param {string} roomId
   * @private
   */
  #ensure(map, roomId) {
    if (!map.has(roomId)) {
      map.set(roomId, new Map());
    }
  }

  // ================================
  // SETTERS
  // ================================

  /**
   * Store a send transport for a given room and socket.
   * @param {string} roomId
   * @param {string} socketId
   * @param {Transport} transport
   */
  setSendTransport(roomId, socketId, transport) {
    this.#ensure(this.sendTransports, roomId);
    this.sendTransports.get(roomId).set(socketId, transport);
  }

  /**
   * Store a receive transport for a given room and socket.
   * @param {string} roomId
   * @param {string} socketId
   * @param {Transport} transport
   */
  setRecvTransport(roomId, socketId, transport) {
    this.#ensure(this.recvTransports, roomId);

    const existing = this.recvTransports.get(roomId).get(socketId);
    if (existing) {
      transport.close(); // defensive
      return existing;
    }

    this.recvTransports.get(roomId).set(socketId, transport);
    return transport;
  }

  /**
   * Store a producer (by kind) for a given room and socket.
   * @param {string} roomId
   * @param {string} socketId
   * @param {Producer} producer
   */
  setProducer(roomId, socketId, producer) {
    this.#ensure(this.producers, roomId);
    const socketMap = this.producers.get(roomId);
    if (!socketMap.has(socketId)) socketMap.set(socketId, new Map());
    socketMap.get(socketId).set(producer.id, producer);
  }

  /**
   * Store a consumer for a given room, socket, and consumerId.
   * @param {string} roomId
   * @param {string} socketId
   * @param {string} consumerId
   * @param {Consumer} consumer
   */
  setConsumer(roomId, socketId, consumerId, consumer) {
    this.#ensure(this.consumers, roomId);
    const socketMap = this.consumers.get(roomId);
    if (!socketMap.has(socketId)) socketMap.set(socketId, new Map());
    socketMap.get(socketId).set(consumerId, consumer);
  }

  // ================================
  // GETTERS
  // ================================

  /**
   * Get a send transport for a given room and socket.
   * @param {string} roomId
   * @param {string} socketId
   * @returns {Transport | undefined}
   */
  getSendTransport(roomId, socketId) {
    return this.sendTransports.get(roomId)?.get(socketId);
  }

  /**
   * Get a receive transport for a given room and socket.
   * @param {string} roomId
   * @param {string} socketId
   * @returns {Transport | undefined}
   */
  getRecvTransport(roomId, socketId) {
    return this.recvTransports.get(roomId)?.get(socketId);
  }

  /**
   * Get a specific producer by kind for a socket in a room.
   * @param {string} roomId
   * @param {string} socketId
   * @returns {Producer | undefined}
   */
  getProducer(roomId, socketId, producerId) {
    return this.producers.get(roomId)?.get(socketId)?.get(producerId);
  }

  /**
   * Get a specific consumer by ID for a socket in a room.
   * @param {string} roomId
   * @param {string} socketId
   * @param {string} consumerId
   * @returns {Consumer | undefined}
   */
  getConsumer(roomId, socketId, consumerId) {
    return this.consumers.get(roomId)?.get(socketId)?.get(consumerId);
  }

  /**
   * Get all producers across all sockets in a room.
   * @param {string} roomId
   * @returns {{ producer: Producer, socketId: string }[]}
   */
  getAllProducers(roomId) {
    const roomMap = this.producers.get(roomId);
    if (!roomMap) return [];

    const result = [];
    for (const [socketId, kindMap] of roomMap.entries()) {
      for (const producer of kindMap.values()) {
        result.push({ producer, socketId });
      }
    }
    return result;
  }
  /**
   * Get all consumers across all sockets in a room.
   * @param {string} roomId
   * @returns {Consumer[]}
   */
  getAllConsumers(roomId) {
    const roomMap = this.consumers.get(roomId);
    if (!roomMap) return [];
    const result = [];
    for (const consumerMap of roomMap.values()) {
      for (const consumer of consumerMap.values()) {
        result.push(consumer);
      }
    }
    return result;
  }

  // ================================
  // DELETERS
  // ================================

  /**
   * Remove all data associated with a socket from a given room.
   * @param {string} roomId
   * @param {string} socketId
   */
  deleteSocket(roomId, socketId) {
    this.sendTransports.get(roomId)?.delete(socketId);
    this.recvTransports.get(roomId)?.delete(socketId);
    this.producers.get(roomId)?.delete(socketId);
    this.consumers.get(roomId)?.delete(socketId);
  }

  /**
   * Remove all data associated with a room.
   * @param {string} roomId
   */
  deleteRoom(roomId) {
    this.sendTransports.delete(roomId);
    this.recvTransports.delete(roomId);
    this.producers.delete(roomId);
    this.consumers.delete(roomId);
  }
}
