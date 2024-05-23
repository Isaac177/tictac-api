"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameById = exports.createGame = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGame = async (req, res) => {
    const { player1Id, player2Id, mode } = req.body;
    try {
        const game = await prisma.game.create({
            data: {
                player1: { connect: { id: player1Id } },
                player2: { connect: { id: player2Id } },
                player1Id,
                player2Id,
                status: 'waiting',
                currentTurn: 'X', // Player X starts
                mode, // Mode can be 'single' or 'multi'
            },
        });
        res.status(201).json(game);
    }
    catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
};
exports.createGame = createGame;
const getGameById = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await prisma.game.findUnique({
            where: { id: parseInt(id) },
        });
        if (game) {
            res.status(200).json(game);
        }
        else {
            res.status(404).json({ error: 'Game not found' });
        }
    }
    catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
};
exports.getGameById = getGameById;
