import { Request, Response } from 'express';
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
export const createUser = async (req: Request, res: Response) => {
    const { name, socketId } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                name,
                socketId,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getUserBySocketId = async (req: Request, res: Response) => {
    const { socketId } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { socketId },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};
