"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const nodeEnv = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${nodeEnv}` });
exports.redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    socket: {
        reconnectStrategy(retries) {
            if (retries > 10) {
                return new Error('Retry time exhausted');
            }
            return Math.min(retries * 100, 3000);
        },
    },
});
exports.redisClient.on('error', (err) => {
    console.error('Redis client encountered an error:', err);
});
exports.redisClient.on('connect', () => {
    console.log('Redis client connected');
});
exports.redisClient.on('reconnecting', () => {
    console.log('Redis client reconnecting...');
});
exports.redisClient.on('ready', () => {
    console.log('Redis client is ready');
});
exports.redisClient.on('end', () => {
    console.log('Redis client disconnected');
});
exports.redisClient.connect().catch(err => console.error('Redis connection error:', err));
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing Redis client');
    await exports.redisClient.quit();
    process.exit(0);
});
