export interface Measure {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: string;
    has_confirmed: boolean;
    image_url: string;
}

export interface ListOutput {
    customer_code: string;
    measures: Measure[];
}
