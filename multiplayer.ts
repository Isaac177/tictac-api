import { Server, Socket } from 'socket.io';
import { redisClient } from "./redisConfig";

interface PlayerMoveData {
    position: number;
    symbol: string;
    gameId: string;
    userId: string;
}

export const handleMultiplayerEvents = (io: Server, socket: Socket) => {
    async function findOpponent(currentUserId: string) {
        const userKeys = await redisClient.keys('user:*');
        for (const key of userKeys) {
            const user = await redisClient.hGetAll(key);
            if (user.socketId !== currentUserId) {
                return user.socketId;
            }
        }
        return '';
    }

    socket.on('createGame', async (data) => {
        const { mode } = data;
        const userId = socket.id;
        console.log(`createGame event received: ${JSON.stringify(data)}, userId: ${userId}`);

        try {
            const existingGame = await redisClient.hGet(`user:${userId}`, 'gameId');
            if (existingGame) {
                console.log(`Game already exists with id: ${existingGame}`);
                socket.emit('gameCreated', { id: existingGame, opponentId: '' });
                return;
            }

            // Store user in Redis
            await redisClient.hSet(`user:${userId}`, {
                status: 'active',
                socketId: userId,
                name: `Player_${userId}`
            });

            // Create a new game in Redis
            const gameId = `game:${Date.now()}`;
            await redisClient.hSet(gameId, {
                player1Id: userId,
                player2Id: '',
                currentTurn: 'X',
                status: 'ongoing',
                mode: mode,
                name: 'Game'
            });

            await redisClient.hSet(`user:${userId}`, 'gameId', gameId);

            // Find an opponent's socket ID
            const opponentId = await findOpponent(userId);

            socket.join(gameId);
            console.log(`Game created with id: ${gameId}`);

            // Notify the client that the game has been created
            socket.emit('gameCreated', { id: gameId, opponentId });

            // Emit playerAssigned event
            socket.emit('playerAssigned', { symbol: 'X' });

            // Emit gameStart event
            io.to(gameId).emit('gameStart', {
                id: gameId,
                player1Id: userId,
                player2Id: '',
            });

            // Broadcast the game invitation to other users
            socket.broadcast.emit('gameInvitation', { gameId, inviter: userId });

        } catch (error) {
            console.error('Error creating game:', error);
        }
    });

    socket.on('joinGame', async (data) => {
        const { gameId } = data;
        const userId = socket.id;
        console.log(`joinGame event received: ${JSON.stringify(data)}, userId: ${userId}`);

        try {
            const game = await redisClient.hGetAll(gameId);
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

            // Update the game with player2Id
            await redisClient.hSet(gameId, {
                player2Id: userId,
                status: 'active'
            });

            await redisClient.hSet(`user:${userId}`, 'gameId', gameId);

            socket.join(gameId);
            console.log(`User ${userId} joined game with id: ${gameId}`);

            // Emit playerAssigned event
            socket.emit('playerAssigned', { symbol: 'O' });

            // Emit gameStart event
            io.to(gameId).emit('gameStart', {
                id: gameId,
                player1Id: game.player1Id,
                player2Id: userId,
            });
        } catch (error) {
            console.error('Error joining game:', error);
        }
    });

    socket.on('playerMove', async (data: PlayerMoveData) => {
        console.log(`playerMove event received: ${JSON.stringify(data)}`);
        const { position, symbol, gameId, userId } = data;
        console.log(`Position: ${position}, Symbol: ${symbol}, GameId: ${gameId}, UserId: ${userId}`);

        try {
            const game = await redisClient.hGetAll(gameId);
            if (!game) {
                console.error('Game not found');
                socket.emit('error', { message: 'Game not found' });
                return;
            }

            if ((symbol === 'X' && game.currentTurn !== 'X') || (symbol === 'O' && game.currentTurn !== 'O')) {
                console.error('Not the player\'s turn');
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            if ((game.player1Id !== userId && game.player2Id !== userId) ||
                (game.player1Id === userId && symbol !== 'X') ||
                (game.player2Id === userId && symbol !== 'O')) {
                console.error('Invalid player');
                socket.emit('error', { message: 'Invalid player' });
                return;
            }

            // Update the game board and current turn in Redis
            await redisClient.hSet(`${gameId}:board`, position, symbol);
            const nextTurn = symbol === 'X' ? 'O' : 'X';
            await redisClient.hSet(gameId, { currentTurn: nextTurn });

            // Emit the move to other players
            io.to(gameId).emit('gameUpdate', { position, symbol });

            // Notify the next player it's their turn
            io.to(gameId).emit('turnUpdate', { nextTurn });
        } catch (error) {
            console.error('Error handling player move:', error);
            socket.emit('error', { message: 'Error handling player move' });
        }
    });

    socket.on('gameOver', async (data) => {
        const { gameId, winner } = data;
        console.log(`gameOver event received: ${JSON.stringify(data)}`);

        try {
            await redisClient.hSet(gameId, {
                status: 'finished',
                winner: winner
            });
            io.to(gameId).emit('gameOver', { winner });
        } catch (error) {
            console.error('Error handling game over:', error);
        }
    });

    socket.on('getActiveUsers', async () => {
        try {
            const activeUsersKeys = await redisClient.keys('user:*');
            const activeUsers: { socketId: string; name: string; }[] = [];
            for (const key of activeUsersKeys) {
                const user = await redisClient.hGetAll(key);
                if (user.status === 'active' && user.socketId !== socket.id) {
                    activeUsers.push({ socketId: user.socketId, name: user.name });
                }
            }

            socket.emit('activeUsers', { success: true, users: activeUsers });
        } catch (error) {
            console.error('Error retrieving active users:', error);
            socket.emit('activeUsers', { success: false, error: 'Error retrieving active users' });
        }
    });

    socket.on('sendInvitation', (data) => {
        const { gameId, opponentId, senderId } = data;

        console.log(`Sending invitation from ${senderId} to ${opponentId} for gameId: ${gameId}`);

        // Emit the invitationReceived event to the opponent
        socket.to(opponentId).emit('invitationReceived', {
            gameId: gameId,
            senderId: senderId
        });
    });
};
