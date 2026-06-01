import { app } from "./app.js";
import { testDBConnection } from "./configs/db.js";
import { Env } from "./configs/env.js";
import logger from "./utils/logger.js";
import { connectRedis } from './configs/redis.js';


const startServer = async () => {
  try {
    // 1. Connect to Database (Neon)
    await testDBConnection();

    // 2. Connect to Redis (Caching)
    connectRedis();

    // 3. Start Express Server
    app.listen(Env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${Env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
