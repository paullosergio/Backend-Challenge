import { ConfirmReadingResponse } from '../types/confirmResponses';

export interface IConfirmService {
    confirmReading(measure_uuid: string, confirmed_value: number): Promise<ConfirmReadingResponse>;
}