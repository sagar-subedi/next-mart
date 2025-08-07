import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import router from './recommendation.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTED_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to recommendation service!' });
});

app.use('/recommendation', router);

app.use(errorMiddleware);

const port = process.env.PORT || 6007;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
