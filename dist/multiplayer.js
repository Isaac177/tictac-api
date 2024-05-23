"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultiplayerEvents = void 0;
const handleMultiplayerEvents = (io, socket, prisma) => {
    socket.on('createGame', async (data) => {
        const { mode } = data;
        const userId = socket.id;
        console.log(`createGame event received: ${JSON.stringify(data)}, userId: ${userId}`);
        try {
            await prisma.user.upsert({
                where: { socketId: userId },
                update: { status: "active" },
                create: { id: userId, socketId: userId, name: "Player" }
            });
            const newGame = await prisma.game.create({
                data: {
                    player1Id: userId,
                    player2Id: null,
                    currentTurn: 'X',
                    status: 'ongoing',
                    mode: mode,
                    name: "Game"
                }
            });
            const gameId = newGame.id;
            socket.join(gameId.toString());
            console.log(`Game created with id: ${gameId}`);
            socket.emit('gameCreated', { id: gameId });
            socket.emit('playerAssigned', { symbol: 'X' });
            io.to(gameId.toString()).emit('gameStart', {
                id: gameId,
                player1Id: userId,
                player2Id: null,
            });
            socket.broadcast.emit('gameInvitation', { gameId: gameId, inviter: userId });
        }
        catch (error) {
            console.error('Error creating game:', error);
        }
    });
    socket.on('joinGame', async (data) => {
        const { gameId } = data;
        const userId = socket.id;
        console.log(`joinGame event received: ${JSON.stringify(data)}, userId: ${userId}`);
        try {
            const game = await prisma.game.findUnique({
                where: { id: parseInt(gameId, 10) }
            });
            if (!game) {
                console.error('Game not found');
                socket.emit('error', { message: 'Game not found' });
                return;
            }
            if (game.player2Id) {
                console.error('Game is already full');
                socket.emit('error', { message: 'Game is already full' });
                return;
            }
            await prisma.game.update({
                where: { id: parseInt(gameId, 10) },
                data: { player2Id: userId, status: 'active' }
            });
            socket.join(gameId.toString());
            console.log(`User ${userId} joined game with id: ${gameId}`);
            socket.emit('playerAssigned', { symbol: 'O' });
            io.to(gameId.toString()).emit('gameStart', {
                id: gameId,
                player1Id: game.player1Id,
                player2Id: userId,
            });
        }
        catch (error) {
            console.error('Error joining game:', error);
        }
    });
    socket.on('playerMove', async (data) => {
        console.log(`playerMove event received: ${JSON.stringify(data)}`);
        const { position, symbol, gameId, userId } = data;
        console.log(`Position: ${position}, Symbol: ${symbol}, GameId: ${gameId}, UserId: ${userId}`);
        try {
            const game = await prisma.game.findUnique({
                where: { id: parseInt(gameId, 10) },
                include: { player1: true, player2: true }
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
            await prisma.gameMove.create({
                data: {
                    gameId: parseInt(gameId, 10),
                    position,
                    symbol,
                    userId
                },
            });
            const updatedGame = await prisma.game.update({
                where: { id: parseInt(gameId, 10) },
                data: {
                    currentTurn: symbol === 'X' ? 'O' : 'X'
                }
            });
            io.to(gameId.toString()).emit('gameUpdate', { position, symbol });
        }
        catch (error) {
            console.error('Error handling player move:', error);
        }
    });
    socket.on('gameOver', async (data) => {
        const { gameId, winner } = data;
        console.log(`gameOver event received: ${JSON.stringify(data)}`);
        try {
            await prisma.game.update({
                where: { id: parseInt(gameId, 10) },
                data: { status: "finished", winner: winner }
            });
            io.to(gameId.toString()).emit('gameOver', { winner });
        }
        catch (error) {
            console.error('Error handling game over:', error);
        }
    });
};
exports.handleMultiplayerEvents = handleMultiplayerEvents;
