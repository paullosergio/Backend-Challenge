export interface IValidationService {
    validateMeasureType(measureType: string | undefined): string | null;
    validateIsBase64(base64Image: string): boolean;
    validateUploadData(image: string, customer_code: string, measure_datetime: string, measure_type: string): string | null;
}
