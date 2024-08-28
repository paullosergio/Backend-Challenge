import express, { Request, Response } from 'express';
import path from "path"

const router = express.Router();

router.get('/image-temp', (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'public', 'image.png');
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send('Erro ao enviar imagem');
    }
});

export default router;