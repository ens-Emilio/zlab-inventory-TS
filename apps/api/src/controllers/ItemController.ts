import { Request, Response, NextFunction } from 'express';
import { ItemService } from '../services/ItemService';
import { QrService } from '../services/QrService';

const itemService = new ItemService();
const qrService = new QrService();

export class ItemController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const items = await itemService.getAllItems();
            res.json(items);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            const item = await itemService.getItemById(id);
            if (!item) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.json(item);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const newItem = await itemService.createItem(req.body);
            res.status(201).json(newItem);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            const updatedItem = await itemService.updateItem(id, req.body);
            if (!updatedItem) {
                res.status(404).json({ message: 'Item not found or no changes made' });
                return;
            }
            res.json(updatedItem);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            const success = await itemService.deleteItem(id);
            if (!success) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async getQr(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            const item = await itemService.getItemById(id);
            if (!item) {
                res.status(404).json({ message: 'Item not found' });
                return;
            }

            // Construct the URL that the QR code will point to
            const protocol = req.protocol;
            const host = req.get('host');
            const itemUrl = `${protocol}://${host}/items/${id}`;

            const qrBuffer = await qrService.generateBuffer(itemUrl);

            res.setHeader('Content-Type', 'image/png');
            res.send(qrBuffer);
        } catch (error) {
            next(error);
        }
    }

    static async uploadPhoto(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);

            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // In a real app, you would save the filename to the database associated with the item
            // await itemService.addPhoto(id, req.file.filename);

            res.json({
                message: 'File uploaded successfully',
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`
            });
        } catch (error) {
            next(error);
        }
    }
}
