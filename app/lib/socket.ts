'use client';

import { Socket, io } from 'socket.io-client';

// type ServerToClientEvents = {
//   session: (session: { sessionId: string; userId: string }) => void;
// }

// type SocketAndUserId = Socket & { userId?: string };

const URL = 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
