import express from 'express';
import { UploadController } from '../controllers/uploadController';

const router = express.Router();
const uploadController = new UploadController();

router.post('/upload', (req, res) => uploadController.handleUpload(req, res));

export default router;
