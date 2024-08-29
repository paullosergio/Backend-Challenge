import { Router } from 'express';
import { ConfirmController } from '../controllers/confirmController';

const router = Router();
const confirmController = new ConfirmController();

router.patch('/confirm', (req, res) => confirmController.confirmReading(req, res));

export default router;
