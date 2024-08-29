import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';
import logger from '../services/logger';

export class ImageController {
    private imageService: ImageService;

    constructor() {
        this.imageService = new ImageService();
    }

    public async sendImage(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Requisição recebida para /image-temp/:image_uuid');
            const { image_uuid } = req.params;
            const filePath = this.imageService.getImagePath(image_uuid);

            res.sendFile(filePath);
        } catch (error) {
            logger.error('Erro ao enviar imagem:', error);
            res.status(500).send('Erro ao enviar imagem');
        }
    }
}
