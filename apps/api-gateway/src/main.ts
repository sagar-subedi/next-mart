import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import initializeSiteConfig from './libs/initializeSiteConfig';

config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTED_URL || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(morgan('dev'));
app.use(cookieParser());  
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.set('trust proxy', 1); // trust first proxy

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 100000 : 10000), // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => req.ip,
});
app.use(limiter);

const serviceHosts = {
  auth: process.env.NODE_ENV=='local'? 'localhost': 'auth-service',
  product: process.env.NODE_ENV=='local'? 'localhost': 'product-service',
  order: process.env.NODE_ENV=='local'? 'localhost': 'order-service',
  admin: process.env.NODE_ENV=='local'? 'localhost': 'admin-service',
  chat: process.env.NODE_ENV=='local'? 'localhost': 'chat-service',
  logger: process.env.NODE_ENV=='local'? 'localhost': 'logger',
  recommendation: process.env.NODE_ENV=='local'? 'localhost': 'recommendation',
  seller: process.env.NODE_ENV=='local'? 'localhost': 'seller-service',
  kafka: process.env.NODE_ENV=='local'? 'localhost': 'kafka-service',
  apigateway: process.env.NODE_ENV=='local'? 'localhost': 'api-gateway'
}

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/products', proxy(`http://${serviceHosts.product}:6002`));
app.use('/orders', proxy(`http://${serviceHosts.order}:6003`));
app.use('/admin', proxy(`http://${serviceHosts.admin}:6004`));
app.use("/chats",proxy(`http://${serviceHosts.chat}:6005`))
app.use("/logs",proxy(`http://${serviceHosts.logger}:6006`))
app.use("/recommendation",proxy(`http://${serviceHosts.recommendation}:6007`)) 
app.use("/seller",proxy(`http://${serviceHosts.seller}:6008`))
app.use('/', proxy(`http://${serviceHosts.auth}:6001`));



const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  try {
    initializeSiteConfig();
    console.log('Site config initialized');
  } catch (error) {
    console.error('Error initializing site config:', error);
  }
});
server.on('error', console.error);
