import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin);
    socket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
};
