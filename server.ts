import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import dotenv from 'dotenv';
import gameRoutes from "./routes/gameRoutes";
import userRoutes from "./routes/userRoutes";
import {PrismaClient} from "@prisma/client";

dotenv.config();
const app = express();
const httpServer = createServer(app);

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3000;

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

    socket.on('createGame', async (data) => {
        const { player1Id, player2Id } = data;
        const game = await prisma.game.create({
            data: {
                player1Id,
                player2Id,
                status: 'waiting',
            },
        });
        socket.emit('gameCreated', game);
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
