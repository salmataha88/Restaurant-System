import {Router} from 'express';
import * as controller from './report.controller.js';
import { isAuth } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/usersAuth.js';

const router = Router();

router.get('/dailyReservations',isAuth(), isAdmin() ,controller.dailyReservations);
router.get('/dailyOrders',isAuth(), isAdmin() ,controller.dailyOrders);

router.get('/monthlyOrders',isAuth(), isAdmin() ,controller.monthlyOrders);
router.get('/monthlyInventory',isAuth(), isAdmin() ,controller.monthlyInventory);


export default router;
