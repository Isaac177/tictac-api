"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const multiplayer_1 = require("./multiplayer");
const redisConfig_1 = require("./redisConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = Number(process.env.PORT) || 8000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
app.use('/api', userRoutes_1.default);
app.use('/api', gameRoutes_1.default);
io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Store user in Redis
    try {
        await redisConfig_1.redisClient.hSet(`user:${socket.id}`, {
            status: 'active',
            socketId: socket.id,
            name: `Player_${socket.id}`
        });
    }
    catch (error) {
        console.error('Error storing user socket ID:', error);
    }
    (0, multiplayer_1.handleMultiplayerEvents)(io, socket);
    socket.on('disconnect', async () => {
        console.log('User disconnected');
        // Remove the user record from Redis
        try {
            await redisConfig_1.redisClient.del(`user:${socket.id}`);
            console.log(`User with socket ID ${socket.id} removed from Redis`);
        }
        catch (error) {
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
