import { ConfirmRepository } from '../repositories/confirmRepository';
import logger from '../services/logger';
import { ConfirmReadingResponse } from '../types/confirmResponses';
import { IConfirmService } from './IConfirmService';

export class ConfirmService implements IConfirmService {
    private confirmRepository: ConfirmRepository;

    constructor() {
        this.confirmRepository = new ConfirmRepository();
    }

    public async confirmReading(measure_uuid: string, confirmed_value: number): Promise<ConfirmReadingResponse> {
        if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
            logger.warn('Dados inválidos fornecidos para confirmação', { measure_uuid, confirmed_value });
            return {
                status: 400,
                body: {
                    error_code: 'INVALID_DATA',
                    error_description: 'Os dados fornecidos são inválidos. Verifique o tipo de dados e tente novamente.'
                }
            };
        }

        const reading = await this.confirmRepository.findReadingByUUID(measure_uuid);

        if (!reading) {
            logger.info('Leitura não encontrada', { measure_uuid });
            return {
                status: 404,
                body: {
                    error_code: 'MEASURE_NOT_FOUND',
                    error_description: 'Leitura não encontrada.'
                }
            };
        }

        if (reading.has_confirmed) {
            logger.warn('Tentativa de confirmação duplicada', { measure_uuid });
            return {
                status: 409,
                body: {
                    error_code: 'CONFIRMATION_DUPLICATE',
                    error_description: 'Leitura do mês já confirmada.'
                }
            };
        }

        await this.confirmRepository.updateReading(measure_uuid, confirmed_value);
        logger.info('Confirmação de leitura concluída com sucesso', { measure_uuid });

        return {
            status: 200,
            body: { success: true }
        };
    }
}
