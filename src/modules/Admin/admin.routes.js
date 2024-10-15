import { Router } from "express";
import * as Controller from "./admin.controllers.js";

import {asyncHanndler} from '../../utils/errorHandling.js'
import { isAuth } from "../../middlewares/auth.js";
import { isSuperAdmin } from "../../middlewares/usersAuth.js";

const router = Router();

router.post('/add', isAuth() , isSuperAdmin() , asyncHanndler(Controller.addAdmin))

router.get('/getAllAdmins',isAuth(), isSuperAdmin() , asyncHanndler(Controller.getAllAdmins))

router.delete('/',isAuth(), isSuperAdmin() ,asyncHanndler(Controller.deleteAdmin)) 
 

export default router