'use client';

import { io } from 'socket.io-client';
import { BACKEND_URL } from './config';

const socket = io(BACKEND_URL as string, { autoConnect: false });

export default socket;
