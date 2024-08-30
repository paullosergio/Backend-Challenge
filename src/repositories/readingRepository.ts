import { Db, Document } from 'mongodb';
import { getDb } from '../db';
import logger from '../services/logger';

export class ReadingRepository {
    private db: Db | undefined;
    private readingsCollection: any;

    constructor() {
        this.initialize()
    }

    public async initialize(): Promise<void> {
        this.db = await getDb();
        this.readingsCollection = this.db.collection('readings');
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
            logger.info('Salvando leitura no banco de dados', { readingData });

            await this.readingsCollection.insertOne({
                ...readingData,
                has_confirmed: false,
            });

            logger.info('Leitura registrada com sucesso', { measure_uuid: readingData.measure_uuid });
        } catch (error) {
            logger.error('Erro ao salvar leitura no banco de dados', { error });
            throw new Error('Erro ao salvar leitura no banco de dados');
        }
    }

    public async getReadings(customerCode: string, measureType?: string): Promise<Document[] | []> {
        const query: any = { customer_code: customerCode };

        if (measureType) {
            query.measure_type = measureType.toUpperCase();
        }

        logger.info('Consultando o banco de dados com os critérios', { query });
        return await this.readingsCollection.find(query).toArray();
    }

    public async findReadingByTypeAndDate(measureType: string, startDate: Date, endDate: Date): Promise<Document | null> {

        try {
            return await this.readingsCollection.findOne({
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
