import express, { Request, Response } from 'express';
import path from "path"
import logger from '../services/logger';

const router = express.Router();

router.get('/image-temp/:image_uuid', (req: Request, res: Response) => {
    try {
        logger.info('Requisição recebida para /image-temp/:image_uuid');
        const { image_uuid } = req.params;
        const filePath = path.join(__dirname, '..', '..', 'public', `${image_uuid}.png`);
        
        res.sendFile(filePath);
    } catch (error) {
        logger.error('Erro ao enviar imagem:', error);
        res.status(500).send('Erro ao enviar imagem');
    }
});

export default router;