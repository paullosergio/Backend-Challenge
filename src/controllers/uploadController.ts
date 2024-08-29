import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ValidationService } from '../services/validationService';
import { ReadingService } from '../services/readingService';
import { LLMService } from '../services/llmService';
import logger from '../services/logger';
import { ImageService } from '../services/imageService';

export class UploadController {
    private validationService: ValidationService;
    private readingService: ReadingService;
    private llmService: LLMService;
    private imageService: ImageService;

    constructor() {
        this.validationService = new ValidationService();
        this.readingService = new ReadingService();
        this.llmService = new LLMService();
        this.imageService = new ImageService();
    }

    public async handleUpload(req: Request, res: Response): Promise<Response> {
        try {
            const { image, customer_code, measure_datetime, measure_type } = req.body;

            this.validationService.validateUploadData(image, customer_code, measure_datetime, measure_type);

            const hasDuplicate = await this.readingService.checkDuplicateReading(measure_type, new Date(measure_datetime));
            if (hasDuplicate) {
                return res.status(409).json({
                    error_code: 'DOUBLE_REPORT',
                    error_description: 'Leitura do mês já realizada.'
                });
            }

            const measureValue = await this.llmService.extractValueFromLLM(image);
            const measureUUID = uuidv4();
            this.imageService.saveImage(image, measureUUID);

            const reading = {
                customer_code,
                measure_type,
                measure_datetime: new Date(measure_datetime),
                measure_value: measureValue,
                image_url: `localhost:3000/image-temp/${measureUUID}`,
                measure_uuid: measureUUID
            };

            await this.readingService.saveReading(reading);

            return res.status(200).json(reading);

        } catch (error) {
            logger.error('Erro ao processar a requisição', { error });
            return res.status(500).json({
                error_code: 'SERVER_ERROR',
                error_description: 'Ocorreu um erro ao processar a requisição.'
            });
        }
    }
}
