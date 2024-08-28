import express, { Request, Response } from 'express';
import { getDb } from '../db';
import logger from '../services/logger';
interface ConfirmRequest {
    measure_uuid: string;
    confirmed_value: number;
}

const router = express.Router();

router.patch('/confirm', async (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body as ConfirmRequest;

    logger.info('Recebida requisição para confirmar leitura', {
        measure_uuid,
        confirmed_value
    });

    if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
        logger.warn('Dados inválidos fornecidos para confirmação', {
            measure_uuid,
            confirmed_value
        });
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os dados fornecidos são inválidos. Verifique o tipo de dados e tente novamente.'
        });
    }

    const db = getDb();
    const readingsCollection = db.collection('readings');

    try {

        logger.info('Consultando leitura no banco de dados', { measure_uuid });
        const reading = await readingsCollection.findOne({ measure_uuid });

        if (!reading) {
            logger.info('Leitura não encontrada', { measure_uuid });
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada.'
            });
        }

        if (reading.confirmed_value !== undefined) {
            logger.warn('Tentativa de confirmação duplicada', { measure_uuid });
            return res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura do mês já confirmada.'
            });
        }

        logger.info('Atualizando valor confirmado no banco de dados', {
            measure_uuid,
            confirmed_value
        });
        await readingsCollection.updateOne(
            { measure_uuid },
            {
                $set: {
                    measure_value: confirmed_value,
                    has_confirmed: true
                }
            }
        );


        logger.info('Confirmação de leitura concluída com sucesso', { measure_uuid });
        return res.status(200).json({
            success: true
        });

    } catch (error) {

        logger.error('Erro ao processar a confirmação de leitura', { error });
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Ocorreu um erro ao processar a requisição.'
        });
    }
});

export default router;
