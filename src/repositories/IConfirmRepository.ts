import { Document } from 'mongodb';

export interface IConfirmeRepository{
    findReadingByUUID(measure_uuid: string): Promise<Document | null>;
    updateReading(measure_uuid: string, confirmed_value: number): Promise<void>;
}