import { IValidationService } from './IValidationService';
import logger from './logger';

export class ValidationService implements IValidationService {
    private validMeasureTypes = ['WATER', 'GAS'];

    public validateMeasureType(measureType: string | undefined): string | null {
        if (measureType && !this.validMeasureTypes.includes(measureType.toUpperCase())) {
            logger.warn('Tipo de medição inválido fornecido', { measureType });
            return 'INVALID_TYPE';
        }
        return null;
    }
    public validateIsBase64(base64Image: string): boolean {
        logger.info('Iniciando validação de base64', { base64ImageLength: base64Image.length });

        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        const isValid = base64Regex.test(base64Image);

        logger.info('Validação de base64 concluída', { isValid });
        return isValid;
    }
    public validateUploadData(image: string, customer_code: string, measure_datetime: string, measure_type: string): string | null {
        if (!image || typeof image !== 'string') {
            logger.error('Imagem inválida ou não fornecida');
            return 'A imagem é obrigatória e não foi fornecida ou está em formato inválido.';
        }

        if (!this.validateIsBase64(image)) {
            logger.error('Imagem não está em formato Base64 válido');
            return 'A imagem fornecida não está em formato Base64 válido.';
        }

        if (!customer_code || typeof customer_code !== 'string') {
            logger.error('Código do cliente inválido ou não fornecido');
            return 'O código do cliente é obrigatório e não foi fornecido ou está em formato inválido.';
        }

        if (!measure_datetime || typeof measure_datetime !== 'string') {
            logger.error('Data e hora da medição inválidas ou não fornecidas');
            return 'A data e hora da medição são obrigatórias e não foram fornecidas ou estão em formato inválido.';
        }

        if (!['WATER', 'GAS'].includes(measure_type) || typeof measure_type !== 'string') {
            logger.error('Tipo de medição inválido');
            return "O tipo de medição deve ser 'WATER' ou 'GAS'.";
        }

        return null;
    }
}
