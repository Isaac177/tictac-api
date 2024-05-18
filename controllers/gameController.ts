import { Request, Response } from 'express';
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
export const createGame = async (req: Request, res: Response) => {
    const { player1Id, player2Id, status } = req.body;

    try {
        const game = await prisma.game.create({
            data: {
                player1Id,
                player2Id,
                status,
            },
        });
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create game' });
    }
};

export const getGameById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const game = await prisma.game.findUnique({
            where: { id: parseInt(id) },
        });
        if (game) {
            res.status(200).json(game);
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get game' });
    }
};
