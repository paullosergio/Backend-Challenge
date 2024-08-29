// src/routes/listRoute.ts
import express from 'express';
import { ListController } from '../controllers/listController';

const router = express.Router();
const listController = new ListController();

router.get('/:customer_code/list', (req, res) => listController.listReadings(req, res));

export default router;
