import express from "express";
import { loggerMiddleware } from "./middlewares/logger.middleware.js"
export const app = express();


app.use(loggerMiddleware);
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});