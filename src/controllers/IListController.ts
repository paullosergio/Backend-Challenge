import { Request, Response } from 'express';

export interface IListController {
    listReadings(req: Request, res: Response): Promise<Response>;
}