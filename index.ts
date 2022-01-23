import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { routes } from './src/routes/routes';
import { createConnection } from 'typeorm';
import { Register } from './src/controller/auth.controller';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { getAll } from './src/service/user.service';
import { User } from './src/entity/user.entity';
require('dotenv').config();

createConnection().then((connection) => {
  const app = express();
  app.use(morgan('dev')); // for checking coming requests
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser()); // for cookie
  app.use(
    cors({
      credentials: true, //For exchange cookies, if we do not add this property then we can not reach cookies from front-end
      // origin: ['http://localhost:3000'], // With cors middleware, we allow our front-end end to reach back-end
    })
  );

  routes(app);
  app.listen(8080, async () => {
    console.log('Server is running');
  });
});

//"start": "ts-node-dev --respawn --transpile-only index.ts",
//"start": "nodemon ts-node index.ts",
