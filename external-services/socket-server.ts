// external-services/socket-server.ts

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import IORedis from "ioredis";

// --- 1. Fix for __dirname in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 2. Load Environment Variables from Root ---
// We look up one level ('..') to find .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// --- 3. Configuration ---
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const SOCKET_IO_PORT = Number(process.env.SOCKET_IO_PORT) || 3001;
// Default to localhost:3000 if not set, to prevent crashes
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

console.log("------------------------------------------");
console.log("🔧 CONFIGURATION LOADED:");
console.log("   Redis URL:", REDIS_URL);
console.log("   Client URL:", CLIENT_URL);
console.log("   Socket Port:", SOCKET_IO_PORT);
console.log("------------------------------------------");

// --- 4. Setup Socket Server ---
const io = new Server(SOCKET_IO_PORT, {
    cors: {
        origin: [CLIENT_URL, "http://127.0.0.1:3000", "http://localhost:3000"], // Allow all common localhost variations
        methods: ["GET", "POST"],
        credentials: true
    }
});

// --- 5. Setup Redis Adapter ---
const pubClient = new IORedis(REDIS_URL);
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// --- 6. Event Listeners ---
io.on("connection", (socket) => {
    console.log(`⚡: User connected [ID: ${socket.id}]`);
    
    socket.on("subscribe", (ticker) => {
        console.log(`👂 User ${socket.id} joined room: ${ticker}`);
        socket.join(ticker);
    });

    socket.on("disconnect", () => {
        console.log(`✋: User disconnected [ID: ${socket.id}]`);
    });
});

console.log(`🚀 Socket.IO server running on port ${SOCKET_IO_PORT}`);