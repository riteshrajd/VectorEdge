import type { CombinedData } from '@/types/types';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';

export const useSocket = (ticker: string | null) => {
  const [data, setData] = useState<CombinedData | null> (null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 🔴 FIX: Always clear old data when ticker changes!
    setData(null);

    // If no ticker is provided, stop here.
    if (!ticker) return;

    console.log(`🔌 Hook: Connecting socket for ${ticker}...`);

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Hook: Socket connected, subscribing...');
      socket.emit('subscribe', ticker);
    });

    socket.on('job-completed', (incomingData) => {
      console.log('📩 Hook: Received data via socket:', incomingData);
      setData(incomingData);
    });

    return () => {
      console.log('🔌 Hook: Disconnecting socket...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticker]); // <--- Re-runs whenever ticker changes

  return data;
};