import fs from 'fs';
import path from "path";
import { converBase64ToImage } from 'convert-base64-to-image';
import logger from './logger';
import { IImageService } from './IImageService';


export class ImageService implements IImageService {
    public getImagePath(imageUuid: string): string {
        logger.info('Obtendo caminho do arquivo de imagem', { imageUuid });
        return path.join(__dirname, '..', '..', 'public', `${imageUuid}.png`);
    }
    public saveImage(base64Image: string, measure_uuid: string): string {
        const base64 = 'data:image/jpeg;base64,' + base64Image;
        const pathToSaveImage = `./public/${measure_uuid}.png`;

        try {
            logger.info('Convertendo imagem base64 para arquivo', { pathToSaveImage });
            converBase64ToImage(base64, pathToSaveImage);

            this.scheduleImageDeletion(pathToSaveImage);
            return `localhost:3000/image-temp/` + measure_uuid;
        } catch (error) {
            logger.error('Erro ao converter imagem base64 para arquivo', { error });
            throw new Error('Erro ao converter imagem base64 para arquivo');
        }
    }

    public scheduleImageDeletion(pathToSaveImage: string): void {
        setTimeout(() => {
            try {
                if (fs.existsSync(pathToSaveImage)) {
                    fs.rmSync(pathToSaveImage, { force: true });
                    logger.info('Imagem excluída com sucesso', { pathToSaveImage });
                }
            } catch (error) {
                logger.error('Erro ao excluir imagem', { error });
            }
        }, 300000);
    }
}