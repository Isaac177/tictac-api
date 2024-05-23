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
const client_1 = require("@prisma/client");
const singlePlayer_1 = require("./singlePlayer");
const multiplayer_1 = require("./multiplayer");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const prisma = new client_1.PrismaClient();
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
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('initialize', (data) => {
        const { mode } = data;
        console.log(`Initialize event received: mode = ${mode}`);
        if (mode === 'single') {
            (0, singlePlayer_1.handleSinglePlayerEvents)(io, socket, prisma);
        }
        else if (mode === 'multi') {
            (0, multiplayer_1.handleMultiplayerEvents)(io, socket, prisma);
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
