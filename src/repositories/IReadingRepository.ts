import { Document } from 'mongodb';

export interface IReadingRepository{
    saveReading(readingData: {
        customer_code: string;
        measure_type: string;
        measure_datetime: Date;
        measure_value: number;
        image_url: string;
        measure_uuid: string;
    }): Promise<void>;
    getReadings(customerCode: string, measureType?: string): Promise<Document[] | []>;
    findReadingByTypeAndDate(measureType: string, startDate: Date, endDate: Date): Promise<Document | null>;
}