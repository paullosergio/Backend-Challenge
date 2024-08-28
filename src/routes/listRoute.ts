import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import logger from '../services/logger';

const listRoute = Router();

listRoute.get('/:customer_code/list', async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;
    const validTypes = ['WATER', 'GAS'];

    logger.info('Requisição recebida para /:customer_code/list', {
        customer_code,
        measure_type
    });

    if (measure_type && !validTypes.includes((measure_type as string).toUpperCase())) {
        logger.warn('Tipo de medição inválido fornecido', { measure_type });
        return res.status(400).json({
            error_code: 'INVALID_TYPE',
            error_description: 'Tipo de medição não permitida'
        });
    }

    try {
        const db = getDb();
        const readingsCollection = db.collection('readings');

        const query: any = { customer_code };
        if (measure_type) {
            query.measure_type = (measure_type as string).toUpperCase();
        }

        logger.info('Consultando o banco de dados com os critérios', { query });
        const readings = await readingsCollection.find(query).toArray();

        if (readings.length === 0) {
            logger.info('Nenhuma leitura encontrada para os critérios fornecidos', { customer_code, measure_type });
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada'
            });
        }

        const response = {
            customer_code,
            measures: readings.map(reading => ({
                measure_uuid: reading.measure_uuid,
                measure_datetime: reading.measure_datetime,
                measure_type: reading.measure_type,
                has_confirmed: reading.has_confirmed,
                image_url: reading.image_url
            }))
        };

        logger.info('Retornando leituras encontradas', { customer_code, measures_count: readings.length });

        return res.status(200).json(response);
    } catch (error) {
        logger.error('Erro ao processar a requisição', { error });
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Ocorreu um erro ao processar a requisição.'
        });
    }
});

export default listRoute;
