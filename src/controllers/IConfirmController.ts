import { Request, Response } from 'express';

export interface IConfirmController{
    confirmReading(req: Request, res: Response): Promise<void>;
}