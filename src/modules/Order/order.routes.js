import { Router } from 'express';
import * as Controller  from './order.controller.js';
import { isAuth } from '../../middlewares/auth.js';
import { is_Staff_Admin } from '../../middlewares/usersAuth.js';

const router = Router();

router.post('/', isAuth() , is_Staff_Admin(), Controller.createOrder);

router.put('/', isAuth() , is_Staff_Admin(), Controller.completeOrder);
router.put('/:orderId', isAuth() , is_Staff_Admin(), Controller.updateOrder);
router.put('/:orderId/:status', isAuth() , is_Staff_Admin(), Controller.updateOrderStatus);

router.delete('/:orderId', isAuth() , is_Staff_Admin(), Controller.deleteOrder);

router.get('/', isAuth() , is_Staff_Admin(), Controller.getOrders);
router.get('/id/:orderId', isAuth() , is_Staff_Admin(), Controller.getOrderById);
router.get('/table/:table', isAuth() , is_Staff_Admin(), Controller.getOrderOfTable);
router.get('/status/:status', isAuth() , is_Staff_Admin(), Controller.getOrdersByStatus);

export default router;