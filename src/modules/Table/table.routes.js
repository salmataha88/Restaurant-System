import { Router } from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { isAdmin } from '../../middlewares/usersAuth.js'

import * as Controller from './table.controller.js'

const router = Router()

router.post('/add', isAuth(), isAdmin(), Controller.addTables)
router.put('/update/status', isAuth(), isAdmin(), Controller.updateStatus)

router.delete('/:id', isAuth(), isAdmin(), Controller.deleteTable)

router.get('/', isAuth(), Controller.getTables)
router.get('/status', isAuth(), Controller.getTablesByStatus)
router.get('/capacity', isAuth(), Controller.getTablesByCapacity)
router.get('/:id', isAuth(), Controller.getTableById)
router.get('/capacity/status', isAuth(), Controller.getTablesByCapacityAndStatus)


export default router