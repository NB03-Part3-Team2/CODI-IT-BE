import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import routes from '@routes/index';
import { errorHandler } from '@middlewares/errorHandler';

const app: Express = express();

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

/**
 * 글로벌 에러 핸들러
 */
app.use(errorHandler);

export { app };
