import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import gameRoutes from "./routes/gameRoutes";
import userRoutes from "./routes/userRoutes";
import { handleMultiplayerEvents } from "./multiplayer";
import {redisClient} from "./redisConfig";

dotenv.config();

const app = express();
const httpServer = createServer(app);

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

io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Store user in Redis
    try {
        await redisClient.hSet(`user:${socket.id}`, {
            status: 'active',
            socketId: socket.id,
            name: `Player_${socket.id}`
        });
    } catch (error) {
        console.error('Error storing user socket ID:', error);
    }

    handleMultiplayerEvents(io, socket);

    socket.on('disconnect', async () => {
        console.log('User disconnected');

        // Remove the user record from Redis
        try {
            await redisClient.del(`user:${socket.id}`);
            console.log(`User with socket ID ${socket.id} removed from Redis`);
        } catch (error) {
            console.error('Error removing user from Redis:', error);
        }
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
