import { Router } from 'express';
import * as Controller from './reservation.controller.js';
import * as auth from '../../middlewares/usersAuth.js';
import {isAuth} from '../../middlewares/auth.js'


const router = Router();

router.post('/',isAuth(), auth.isUser(), Controller.createReservation);

router.put('/:_id',isAuth(), Controller.updateReservation);

router.get('/ById/:_id',isAuth(), Controller.getReservationById);
router.get('/user',isAuth(), Controller.getReservationsOfUser);

router.get('/admin/:_id',isAuth(),auth.is_Staff_Admin(), Controller.getReservationsByUserId);
router.get('/table/:_id',isAuth(),auth.is_Staff_Admin(), Controller.getReservationsByTableId);
router.get('/date',isAuth(),auth.is_Staff_Admin(), Controller.getReservationByDate);

router.put('/place/:_id',isAuth(),auth.is_Staff_Admin(), Controller.placeReservation);

router.delete('/:_id',isAuth(), Controller.cancelReservation);

export default router;