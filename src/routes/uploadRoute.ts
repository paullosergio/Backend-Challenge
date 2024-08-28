import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractValueFromLLM } from '../services/llmService';
import { isBase64, checkDuplicateReading, convertToImage } from '../services/validationService';
import { UploadRequest } from '../types/uploadRequest';
import { getDb } from '../db';
import logger from '../services/logger';

const router = express.Router();

router.post('/upload', async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body as UploadRequest;

    logger.info('Requisição recebida para /upload', {
        image,
        customer_code,
        measure_datetime,
        measure_type
    });

    if (!image || typeof image !== 'string') {
        logger.error('Imagem inválida ou não fornecida');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'A imagem é obrigatória e não foi fornecida ou está em formato inválido.'
        });
    } else if (!isBase64(image)) {
        logger.error('Imagem não está em formato Base64 válido');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'A imagem fornecida não está em formato Base64 válido.'
        });
    } else if (!customer_code || typeof customer_code !== 'string') {
        logger.error('Código do cliente inválido ou não fornecido');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'O código do cliente é obrigatório e não foi fornecido ou está em formato inválido.'
        });
    } else if (!measure_datetime || typeof measure_datetime !== 'string') {
        logger.error('Data e hora da medição inválidas ou não fornecidas');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'A data e hora da medição são obrigatórias e não foram fornecidas ou está em formato inválido.'
        });
    } else if (!['WATER', 'GAS'].includes(measure_type) || typeof measure_type !== 'string') {
        logger.error('Tipo de medição inválido');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: "O tipo de medição deve ser 'WATER' ou 'GAS'."
        });
    }

    try {
        const hasDuplicate = await checkDuplicateReading(measure_type, new Date(measure_datetime));
        if (hasDuplicate) {
            logger.warn('Leitura duplicada detectada', { customer_code, measure_datetime, measure_type });
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada.'
            });
        }

        const measureValue = await extractValueFromLLM(image);

        if (!measureValue) {
            logger.error('Erro ao extrair o valor da medição a partir da imagem');
            return res.status(500).json({
                error_code: 'SERVER_ERROR',
                error_description: 'Ocorreu um erro ao processar a requisição.'
            });
        }

        const measureUUID = uuidv4();
        convertToImage(image, measureUUID);
        const imageUrl = `localhost:3000/image-temp/` + measureUUID;

        const db = getDb();
        const readingsCollection = db.collection('readings');
        await readingsCollection.insertOne({
            customer_code,
            measure_type,
            measure_datetime: new Date(measure_datetime),
            measure_value: measureValue,
            image_url: imageUrl,
            measure_uuid: measureUUID,
            has_confirmed: false
        });

        logger.info('Leitura registrada com sucesso', { customer_code, measureUUID, measureValue });

        return res.status(200).json({
            image_url: imageUrl,
            measure_value: measureValue,
            measure_uuid: measureUUID
        });

    } catch (error) {
        logger.error('Erro ao processar a requisição', { error });
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Ocorreu um erro ao processar a requisição.'
        });
    }
});

export default router;
