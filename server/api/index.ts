import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import * as express from 'express';

const app = express();
let serverReady = false;

export default async function handler(req: any, res: any) {
  if (!serverReady) {
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));
    nestApp.enableCors({
      origin: true,
      credentials: true,
    });
    nestApp.setGlobalPrefix('api');
    await nestApp.init();
    serverReady = true;
  }
  app(req, res);
} 