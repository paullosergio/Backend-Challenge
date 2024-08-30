import { Db, Document } from 'mongodb';
import { getDb } from '../db';
import logger from '../services/logger';
import { IConfirmeRepository } from './IConfirmRepository';

export class ConfirmRepository implements IConfirmeRepository {
    private db: Db | undefined;
    private readingsCollection: any;
    constructor() {
        this.initialize()
    }

    public async initialize(): Promise<void> {
        this.db = await getDb();
        this.readingsCollection = this.db.collection('readings');
    }

    public async findReadingByUUID(measure_uuid: string): Promise<Document | null> {
        try {
            logger.info('Consultando leitura no banco de dados', { measure_uuid });
            return await this.readingsCollection.findOne({ measure_uuid });
        } catch (error) {
            logger.error('Erro ao consultar leitura no banco de dados', { error });
            throw error;
        }
    }

    public async updateReading(measure_uuid: string, confirmed_value: number): Promise<void> {
        try {
            logger.info('Atualizando valor confirmado no banco de dados', { measure_uuid, confirmed_value });
            await this.readingsCollection.updateOne(
                { measure_uuid },
                {
                    $set: {
                        measure_value: confirmed_value,
                        has_confirmed: true
                    }
                }
            );
        } catch (error) {
            logger.error('Erro ao atualizar leitura no banco de dados', { error });
            throw error;
        }
    }
}
