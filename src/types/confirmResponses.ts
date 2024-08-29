export interface ConfirmReadingResponse {
    status: number;
    body: {
        error_code?: string;
        error_description?: string;
        success?: boolean;
    };
}
