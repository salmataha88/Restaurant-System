import { Router } from "express";
import * as Controller from "./user.controller.js";

import {asyncHanndler} from '../../utils/errorHandling.js'
import { isAuth } from "../../middlewares/auth.js";

const router = Router();

router.post('/signup', asyncHanndler(Controller.SignUp))
router.post('/login', asyncHanndler(Controller.SignIn))

router.get('/', isAuth(),asyncHanndler(Controller.getUserById))

router.put('/update', isAuth() ,asyncHanndler(Controller.updateUser))


export default router