import {Router} from 'express';
import * as Controller from './inventory.controller.js';
import { isAuth } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/usersAuth.js';

const router = Router();

router.post('/', isAuth(), isAdmin(), Controller.createInventory);
router.put('/:_id', isAuth(), isAdmin(), Controller.updateInventory);

router.delete('/:_id', isAuth(), isAdmin(), Controller.deleteInventory);
router.get('/ById/:_id', isAuth(), isAdmin(), Controller.getInventoryById);
router.get('/', isAuth(), isAdmin(), Controller.getAllInventories);
router.get('/supplier/:supplierId', isAuth(), isAdmin(), Controller.getInventoryBySupplier);

export default router;