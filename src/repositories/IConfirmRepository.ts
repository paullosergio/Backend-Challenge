export interface IConfirmeRepository{
    findReadingByUUID(measure_uuid: string): Promise<any>;
    updateReading(measure_uuid: string, confirmed_value: number): Promise<void>;
}