import { Request, Response } from 'express';
import { ConfirmService } from '../services/confirmService';
import { IConfirmController } from './IConfirmController';

export class ConfirmController implements IConfirmController {
    private confirmService: ConfirmService;

    constructor() {
        this.confirmService = new ConfirmService();
    }

    public async confirmReading(req: Request, res: Response): Promise<void> {
        const { measure_uuid, confirmed_value } = req.body;

        try {
            const response = await this.confirmService.confirmReading(measure_uuid, confirmed_value);
            res.status(response.status).json(response.body);
        } catch (error) {
            res.status(500).json({
                error_code: 'SERVER_ERROR',
                error_description: 'Ocorreu um erro ao processar a requisição.'
            });
        }
    }
}
