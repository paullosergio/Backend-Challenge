import { ReadingRepository } from '../repositories/readingRepository';
import { ListOutput } from '../types/listOutput';
import { IReadingService } from './IReadingService';
import logger from './logger';

export class ReadingService implements IReadingService {

    private readingRepository: ReadingRepository;

    constructor() {
        this.readingRepository = new ReadingRepository();
    }
    public async saveReading(readingData: {
        customer_code: string;
        measure_type: string;
        measure_datetime: Date;
        measure_value: number;
        image_url: string;
        measure_uuid: string;
    }): Promise<void> {
        await this.readingRepository.saveReading(readingData);
    }

    public async getReadings(customerCode: string, measureType?: string): Promise<ListOutput[] | []> {
        const documents = await this.readingRepository.getReadings(customerCode, measureType);

        if (documents.length === 0) {
            return [];
        }

        logger.info('Leituras encontradas', { documents });
        const measureMap: { [key: string]: ListOutput } = {};

        for (const doc of documents) {
            const { customer_code, measure_uuid, measure_datetime, measure_type, has_confirmed, image_url } = doc as any; // Use o tipo apropriado aqui

            if (!measureMap[customer_code]) {
                measureMap[customer_code] = {
                    customer_code,
                    measures: []
                };
            }

            measureMap[customer_code].measures.push({
                measure_uuid,
                measure_datetime,
                measure_type,
                has_confirmed,
                image_url
            });
        }

        return Object.values(measureMap);
    }

    public async checkDuplicateReading(measureType: string, measureDatetime: Date): Promise<boolean> {
        logger.info('Verificando leitura duplicada', { measureType, measureDatetime });

        const year = measureDatetime.getUTCFullYear();
        const month = measureDatetime.getUTCMonth() + 1;

        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));

        const existingReading = await this.readingRepository.findReadingByTypeAndDate(measureType, startDate, endDate);

        const isDuplicate = !!existingReading;
        logger.info('Verificação de leitura duplicada concluída', { isDuplicate });
        return isDuplicate;

    }
}