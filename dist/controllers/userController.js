"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBySocketId = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    const { name, socketId } = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                name,
                socketId,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
const getUserBySocketId = async (req, res) => {
    const { socketId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { socketId },
        });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};
exports.getUserBySocketId = getUserBySocketId;
