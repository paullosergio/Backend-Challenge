import express from 'express';
import { ImageController } from '../controllers/imageController';

const router = express.Router();
const imageController = new ImageController();

router.get('/image-temp/:image_uuid', (req, res) => imageController.sendImage(req, res));

export default router;
