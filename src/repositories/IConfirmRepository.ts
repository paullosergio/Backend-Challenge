export interface Reading {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: string;
    has_confirmed?: boolean;
    measure_value?: number;
    image_url?: string;
}
export interface IConfirmeRepository{
    findReadingByUUID(measure_uuid: string): Promise<any>;
    updateReading(measure_uuid: string, confirmed_value: number): Promise<void>;
}