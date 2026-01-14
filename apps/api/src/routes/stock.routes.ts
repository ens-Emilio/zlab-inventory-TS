import { Router } from 'express';
import { StockController } from '../controllers/StockController';

const router = Router();

router.post('/move', StockController.createMovement);
router.get('/history/:itemId', StockController.getHistory);

export default router;
