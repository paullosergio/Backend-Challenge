import { Request, Response } from 'express';
export interface IUploadController {
    handleUpload(req: Request, res: Response): Promise<Response>;
}