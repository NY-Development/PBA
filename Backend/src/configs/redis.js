import { createClient } from 'redis';
import { Env } from './env';
import logger from '../utils/logger.js';

export const redisClient = createClient({
  url: Env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('✅ Redis connected'));

export const connectRedis = async () => {
  if (!REDIS_URL) {
    logger.warn('⚠️ REDIS_URL not provided. Redis caching will be skipped.');
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