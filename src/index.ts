import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose'

import { dateNow } from './utils';
import router from './router/index';

const app = express();

app.use(cors({
  credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const MONGO_URL = 'mongodbatlasslinktotheclaster'

server.listen(8080, () => {
  console.log(`${dateNow}, Server running on https://localhost:8080/`)
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(`${dateNow}, An error occured: ${error}`));

app.use('/', router());