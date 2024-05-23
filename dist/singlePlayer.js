"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSinglePlayerEvents = void 0;
const handleSinglePlayerEvents = (io, socket, prisma) => {
    socket.on('createSinglePlayerGame', async (data) => {
        const { userId } = data;
        console.log(`createSinglePlayerGame event received: ${JSON.stringify(data)}`);
        try {
            let user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                user = await prisma.user.create({
                    data: { id: userId, socketId: socket.id, name: 'Player' }
                });
            }
            const game = await prisma.game.create({
                data: {
                    player1: { connect: { id: userId } },
                    player2: { connect: { id: userId } },
                    status: 'active',
                    currentTurn: 'X',
                    mode: 'single',
                    name: 'Single Player Game'
                },
                include: { player1: true }
            });
            socket.join(game.id.toString());
            socket.emit('gameCreated', game);
            console.log(`Single player game created with id: ${game.id}`);
        }
        catch (error) {
            console.error('Error creating single player game:', error);
        }
    });
    socket.on('playerMove', async (data) => {
        console.log(`playerMove event received: ${JSON.stringify(data)}`);
        const { position, symbol, gameId, userId } = data;
        try {
            const game = await prisma.game.findUnique({ where: { id: parseInt(gameId, 10) }, include: { player1: true } });
            if (!game) {
                console.error('Game not found');
                return;
            }
            if (game.currentTurn !== symbol) {
                console.error('Not the player\'s turn');
                return;
            }
            if (game.player1Id !== userId || symbol !== 'X') {
                console.error('Invalid player');
                return;
            }
            await prisma.gameMove.create({
                data: { gameId: parseInt(gameId, 10), position, symbol, userId }
            });
            const updatedGame = await prisma.game.update({
                where: { id: parseInt(gameId, 10) },
                data: { currentTurn: 'O' }
            });
            io.to(gameId.toString()).emit('gameUpdate', { position, symbol });
            // Implement AI move logic here for single player mode
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
exports.handleSinglePlayerEvents = handleSinglePlayerEvents;
