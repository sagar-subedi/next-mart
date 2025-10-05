import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import router from './order.route';
import { createOrder } from './order.controller';
import bodyParser from 'body-parser';

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.FRONTEND_SELLER_URL || 'http://localhost:3001',
      process.env.FRONTEND_ADMIN_URL || 'http://localhost:3002'
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post(
  '/api/create-order',
  bodyParser.raw({ type: 'application/json' }),
  (req, res, next) => {
    (req as any).rawBody = req.body;
    next();
  },
  createOrder
);

app.get('/api/create-order', (req, res) => {
  res.send({ message: 'Welcome to order service!' });
});

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to order service!' });
});

app.use('/api', router);

app.use(errorMiddleware);

const port = process.env.PORT || 6003;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
