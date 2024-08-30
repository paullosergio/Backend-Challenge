import { ListOutput } from "../types/listOutput";

export interface IReadingService {
    saveReading(readingData: {
        customer_code: string;
        measure_type: string;
        measure_datetime: Date;
        measure_value: number;
        image_url: string;
        measure_uuid: string;
    }): Promise<void>;
    getReadings(customerCode: string, measureType?: string): Promise<ListOutput[] | []>;
    checkDuplicateReading(measureType: string, measureDatetime: Date): Promise<boolean>;
}