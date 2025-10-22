import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import routes from './routes/index'
dotenv.config();

const app: Express = express()

/**
 * CORS
 */
app.use(cors());

/**
 * Body & Cookie 파서
 */
app.use(express.json());
app.use(cookieParser());

/**
 * Routes (API)
 */
app.use('/api', routes);

export { app }