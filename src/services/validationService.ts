import fs from 'fs';
import { getDb } from '../db';
import { converBase64ToImage } from 'convert-base64-to-image';
import logger from '../services/logger'; 

export function isBase64(base64Image: string): boolean {
    logger.info('Iniciando validação de base64', { base64ImageLength: base64Image.length });

    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

    const isValid = base64Regex.test(base64Image);
    logger.info('Validação de base64 concluída', { isValid });
    return isValid;
}

export function convertToImage(base64Image: string, measure_uuid: string): void {
    const base64 = 'data:image/jpeg;base64,' + base64Image;
    const pathToSaveImage = './public/' + `${measure_uuid}.png`;

    try {
        logger.info('Convertendo imagem base64 para arquivo', { pathToSaveImage });
        converBase64ToImage(base64, pathToSaveImage);

        setTimeout(() => {
            try {
                if (fs.existsSync(pathToSaveImage)) {
                    fs.rmSync(pathToSaveImage, { force: true });
                    logger.info('Imagem excluída com sucesso', { pathToSaveImage });
                }
            } catch (error) {
                logger.error('Erro ao excluir pasta', { error });
            }
        }, 300000);

    } catch (error) {
        logger.error('Erro ao converter imagem base64 para arquivo', { error });
    }
}
export async function checkDuplicateReading(measureType: string, measureDatetime: Date): Promise<boolean> {
    logger.info('Verificando leitura duplicada', { measureType, measureDatetime });

    const db = getDb();
    const readingsCollection = db.collection('readings');

    const year = measureDatetime.getUTCFullYear();
    const month = measureDatetime.getUTCMonth() + 1;

    try {
        const existingReading = await readingsCollection.findOne({
            measure_type: measureType,
            measure_datetime: {
                $gte: new Date(Date.UTC(year, month - 1, 1)),
                $lt: new Date(Date.UTC(year, month, 1))
            }
        });

        const isDuplicate = !!existingReading;
        logger.info('Verificação de leitura duplicada concluída', { isDuplicate });
        return isDuplicate;
    } catch (error) {
        logger.error('Erro ao verificar leitura duplicada', { error });
        throw error;
    }
}
