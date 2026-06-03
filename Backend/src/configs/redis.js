import { createClient } from 'redis';
import { Env } from './env.js';
import logger from '../utils/logger.js';

let hasLoggedRedisError = false;

export const redisClient = createClient({
  url: Env.REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      // Stop after 10 retries
      if (retries > 10) {
        logger.error('❌ Redis retry limit reached');
        return false;
      }

      // retry every 2 seconds
      return 2000;
    },
  },
});

redisClient.on('error', (err) => {
  // Prevent console spam
  if (!hasLoggedRedisError) {
    logger.error(`Redis Client Error: ${err.message}`);
    hasLoggedRedisError = true;
  }
});

redisClient.on('connect', () => {
  hasLoggedRedisError = false;
  logger.info('✅ Redis connected');
});

export const connectRedis = async () => {
  if (!Env.REDIS_URL) {
    logger.warn(
      '⚠️ REDIS_URL not provided. Redis caching will be skipped.'
    );
    return null;
  }

  try {
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    logger.error('❌ Redis connection failed:', err);
    return null;
  }
};