import { Request, Response } from 'express';

export interface IImageController {
    sendImage(req: Request, res: Response): Promise<void>;
}