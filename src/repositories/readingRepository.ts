import { getDb } from '../db';
import logger from '../services/logger';

export class ReadingRepository {

    constructor() {
    }

    public async saveReading(readingData: {
        customer_code: string;
        measure_type: string;
        measure_datetime: Date;
        measure_value: number;
        image_url: string;
        measure_uuid: string;
    }): Promise<void> {
        try {
            const db =  getDb();
            const readingsCollection = db.collection('readings');

            logger.info('Salvando leitura no banco de dados', { readingData });

            await readingsCollection.insertOne({
                ...readingData,
                has_confirmed: false,
            });

            logger.info('Leitura registrada com sucesso', { measure_uuid: readingData.measure_uuid });
        } catch (error) {
            logger.error('Erro ao salvar leitura no banco de dados', { error });
            throw new Error('Erro ao salvar leitura no banco de dados');
        }
    }

    public async getReadings(customerCode: string, measureType?: string): Promise<any[]> {
        const db =  getDb();
        const readingsCollection = db.collection('readings');
        const query: any = { customer_code: customerCode };

        if (measureType) {
            query.measure_type = measureType.toUpperCase();
        }

        logger.info('Consultando o banco de dados com os critérios', { query });
        return await readingsCollection.find(query).toArray();
    }

    public async findReadingByTypeAndDate(measureType: string, startDate: Date, endDate: Date): Promise<any | null> {
        const db =  getDb();
        const readingsCollection = db.collection('readings');

        try {
            return await readingsCollection.findOne({
                measure_type: measureType,
                measure_datetime: {
                    $gte: startDate,
                    $lt: endDate,
                },
            });
        } catch (error) {
            logger.error('Erro ao consultar leitura no banco de dados', { error });
            throw new Error('Erro ao consultar leitura no banco de dados');
        }
    }
}
