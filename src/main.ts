// 프로덕션 환경에서만 module-alias 사용
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
import * as dotenv from 'dotenv';
import http from 'http';
import { app } from './app';

dotenv.config();

// Server Create
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => console.log('Server Starting...'));
