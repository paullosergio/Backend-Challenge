import { getDb } from '../db';
import logger from '../services/logger';
import { IConfirmeRepository } from './IConfirmRepository';

export class ConfirmRepository implements IConfirmeRepository{    
    constructor() {
    }
    
    public async findReadingByUUID(measure_uuid: string): Promise<any> {
        try {
            logger.info('Consultando leitura no banco de dados', { measure_uuid });
            const db =  getDb();
            const readingsCollection = db.collection('readings');
            return await readingsCollection.findOne({ measure_uuid });
        } catch (error) {
            logger.error('Erro ao consultar leitura no banco de dados', { error });
            throw error;
        }
    }

    public async updateReading(measure_uuid: string, confirmed_value: number): Promise<void> {
        try {
            logger.info('Atualizando valor confirmado no banco de dados', { measure_uuid, confirmed_value });
            const db =  getDb();
            const readingsCollection = db.collection('readings');
            await readingsCollection.updateOne(
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
