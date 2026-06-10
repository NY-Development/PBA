import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import routes from "./routes/index.js";

import { 
  loggerMiddleware } from './middlewares/logger.middleware.js';
import { Env } from "./configs/env.js";
import { indexTemplate } from "./templates/index.js";

export const app = express();

const allowedOrigins = [
  Env.CLIENT_ORIGIN,
  Env.SERVER_ORIGIN
];
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});


// Security & Base Middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(loggerMiddleware);

// Rate Limiter
app.use('/api/', limiter);

// API Routes
app.use("/api/v1", routes);

// Health Check
app.use('/', (req, res) => {
  res.send(indexTemplate());
});