import { randomBytes } from 'crypto';
const rooms = new Map(); // roomId -> roomData

const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
    },
  },
]
/** @typedef {import("socket.io").Server} SocketIOServer 
 * @typedef {import("mediasoup").types.Worker} Worker
 **/

/**
 * @param {String} roomId
  * @param {Worker} worker
  * @returns {Promise<import("mediasoup").types.Router>}
 */
export async function createRoom(roomId, worker) {
  if (rooms.has(roomId)) return rooms.get(roomId);

  const router = await worker.createRouter({ mediaCodecs });
  rooms.set(roomId, router);
  return router;
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function deleteRoom(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.close();
    rooms.delete(roomId);
  }
}

export function generateSecureId() {
  const bytes = randomBytes(6); // 6 bytes = 48 bits = enough for 9 base36 chars
  const base36 = [...bytes].map(b => b.toString(36).padStart(2, '0')).join('').slice(0, 9);
  return base36.slice(0, 3) + '-' + base36.slice(3, 6) + '-' + base36.slice(6, 9);
}
