import express from 'express';
import { appController } from './controller';

export const appRouter = express.Router();

appRouter.get("/list", appController.getList)
appRouter.get("/me", appController.getMe)
