import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', ItemController.getAll);
router.get('/:id', ItemController.getOne);
router.get('/:id/qr', ItemController.getQr);
router.post('/:id/photos', upload.single('photo'), ItemController.uploadPhoto);
router.post('/', ItemController.create);
router.put('/:id', ItemController.update);
router.delete('/:id', ItemController.delete);

export default router;
