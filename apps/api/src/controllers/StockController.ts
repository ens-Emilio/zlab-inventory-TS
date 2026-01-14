import { Request, Response, NextFunction } from 'express';
import { StockService } from '../services/StockService';

const stockService = new StockService();

export class StockController {
    static async createMovement(req: Request, res: Response, next: NextFunction) {
        try {
            await stockService.createMovement(req.body);
            res.status(201).json({ message: 'Stock movement recorded successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const itemId = parseInt(req.params.itemId as string);
            const history = await stockService.getHistory(itemId);
            res.json(history);
        } catch (error) {
            next(error);
        }
    }
}
