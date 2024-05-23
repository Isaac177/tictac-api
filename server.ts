import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import gameRoutes from "./routes/gameRoutes";
import userRoutes from "./routes/userRoutes";
import { PrismaClient } from '@prisma/client';
import { handleSinglePlayerEvents } from "./singlePlayer";
import { handleMultiplayerEvents } from "./multiplayer";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 8000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use('/api', userRoutes);
app.use('/api', gameRoutes);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('initialize', (data) => {
        const { mode } = data;
        console.log(`Initialize event received: mode = ${mode}`);

        if (mode === 'single') {
            handleSinglePlayerEvents(io, socket, prisma);
        } else if (mode === 'multi') {
            handleMultiplayerEvents(io, socket, prisma);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

io.on('connection_error', (error) => {
    console.log('Connection error:', error);
});

app.get('/test', (req, res) => {
    res.send('Server is working!');
});

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
