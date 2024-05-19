import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

interface CreateGameData {
    mode: string;
    userId: string;
}

interface PlayerMoveData {
    position: number;
    symbol: string;
    gameId: string;
    userId: string;
}

interface GameOverData {
    gameId: string;
    winner: string;
}

export const handleMultiplayerEvents = (io: Server, socket: Socket, prisma: PrismaClient) => {
    socket.on('createGame', async (data: CreateGameData) => {
        const { mode, userId } = data;
        console.log(`createGame event received: ${JSON.stringify(data)}`);
        try {
            // Check if the user exists
            let user = await prisma.user.findUnique({
                where: { id: userId }
            });

            // If user doesn't exist, create it
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id: userId,
                        socketId: socket.id,
                        name: 'Player' // Default name
                    }
                });
            }

            // Find a game waiting for a second player
            let game = await prisma.game.findFirst({
                where: {
                    status: 'waiting'
                },
                include: {
                    player1: true,
                    player2: true
                }
            });

            if (game) {
                // Join the existing game as player2
                game = await prisma.game.update({
                    where: { id: game.id },
                    data: {
                        player2: {
                            connect: {
                                id: userId
                            }
                        },
                        status: 'active'
                    },
                    include: {
                        player1: true,
                        player2: true
                    }
                });

                // Notify both players that the game is starting
                io.to(game.player1.socketId).emit('gameStart', game);
                io.to(socket.id).emit('gameStart', game);

                console.log(`Game started with id: ${game.id}`);
            } else {
                // Create a new game and join as player1
                game = await prisma.game.create({
                    data: {
                        player1: {
                            connect: {
                                id: userId
                            }
                        },
                        player2: {
                            connect: {
                                id: userId // Set player2 to the same userId temporarily, this should be updated when the second player joins
                            }
                        },
                        status: 'waiting',
                        currentTurn: 'X', // Player X starts
                        mode,
                        name: 'Multiplayer Game'
                    },
                    include: {
                        player1: true,
                        player2: true
                    }
                });

                // Join the socket room
                socket.join(game.id.toString());

                // Notify the user that the game has been created
                socket.emit('gameCreated', game);

                console.log(`Game created with id: ${game.id}`);
            }
        } catch (error) {
            console.error('Error creating game:', error);
        }
    });

    socket.on('playerMove', async (data: PlayerMoveData) => {
        console.log(`playerMove event received: ${JSON.stringify(data)}`);
        const { position, symbol, gameId, userId } = data;
        console.log(`Position: ${position}, Symbol: ${symbol}, GameId: ${gameId}, UserId: ${userId}`);
        try {
            // Validate move
            const game = await prisma.game.findUnique({
                where: { id: parseInt(gameId, 10) },
                include: {
                    player1: true,
                    player2: true
                }
            });

            if (!game) {
                console.error('Game not found');
                return;
            }

            if (game.currentTurn !== symbol) {
                console.error('Not the player\'s turn');
                return;
            }

            if ((game.player1Id !== userId && game.player2Id !== userId) ||
                (game.player1Id === userId && symbol !== 'X') ||
                (game.player2Id === userId && symbol !== 'O')) {
                console.error('Invalid player');
                return;
            }

            // Assuming you have a GameMove model to track moves
            await prisma.gameMove.create({
                data: {
                    gameId: parseInt(gameId, 10), // Parse gameId to integer
                    position,
                    symbol,
                    userId
                },
            });

            // Update game current turn
            const updatedGame = await prisma.game.update({
                where: { id: parseInt(gameId, 10) }, // Parse gameId to integer
                data: {
                    currentTurn: symbol === 'X' ? 'O' : 'X'
                }
            });

            // Emit the move to other players
            io.to(gameId.toString()).emit('gameUpdate', { position, symbol });
        } catch (error) {
            console.error('Error handling player move:', error);
        }
    });

    socket.on('gameOver', async (data: GameOverData) => {
        const { gameId, winner } = data;
        console.log(`gameOver event received: ${JSON.stringify(data)}`);
        try {
            await prisma.game.update({
                where: { id: parseInt(gameId, 10) }, // Parse gameId to integer
                data: {
                    status: "finished",
                    winner: winner
                }
            });

            io.to(gameId.toString()).emit('gameOver', { winner });
        } catch (error) {
            console.error('Error handling game over:', error);
        }
    });
};
