import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../../../apps/web')));

// Routes
import itemRoutes from './routes/items.routes';
import stockRoutes from './routes/stock.routes';

app.use('/api/items', itemRoutes);
app.use('/api/stock', stockRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';

// Handle undefined routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
