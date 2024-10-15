import {Router} from 'express';
import * as Controller from './supplier.controller.js';
import { isAuth } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/usersAuth.js';

const router = Router();

router.post('/',isAuth() , isAdmin() ,Controller.createSupplier);
router.put('/:supplierId', isAuth(), isAdmin(), Controller.updateSupplier);
router.get('/', isAuth(), isAdmin(), Controller.getAllSuppliers);
router.get('/:supplierId', isAuth(), isAdmin(), Controller.getSupplierById);
router.delete('/:_id', isAuth(), isAdmin(), Controller.deleteSupplier);

export default router;