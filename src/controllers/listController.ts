import { Request, Response } from 'express';
import { ReadingService } from '../services/readingService';
import logger from '../services/logger';

export class ListController {
    private readingService: ReadingService;

    constructor() {
        this.readingService = new ReadingService();
    }

    public async listReadings(req: Request, res: Response): Promise<Response> {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        try {
            const readings = await this.readingService.getReadings(customer_code, measure_type as string);
            if (readings.length === 0) {
                return res.status(404).json({
                    error_code: 'MEASURES_NOT_FOUND',
                    error_description: 'Nenhuma leitura encontrada'
                });
            }

            return res.status(200).json({ customer_code, measures: readings });

        } catch (error) {
            logger.error('Erro ao processar a requisição', { error });
            return res.status(500).json({
                error_code: 'SERVER_ERROR',
                error_description: 'Ocorreu um erro ao processar a requisição.'
            });
        }
    }
}
