import { createClient } from 'redis';


const nodeEnv = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${nodeEnv}` });


export const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    socket: {
        reconnectStrategy(retries: number) {
            if (retries > 10) {
                return new Error('Retry time exhausted');
            }
            return Math.min(retries * 100, 3000);
        },
    },
});

redisClient.on('error', (err) => {
    console.error('Redis client encountered an error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('reconnecting', () => {
    console.log('Redis client reconnecting...');
});

redisClient.on('ready', () => {
    console.log('Redis client is ready');
});

redisClient.on('end', () => {
    console.log('Redis client disconnected');
});

redisClient.connect().catch(err => console.error('Redis connection error:', err));

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing Redis client');
    await redisClient.quit();
    process.exit(0);
});
