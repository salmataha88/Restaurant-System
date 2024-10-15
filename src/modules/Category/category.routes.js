import { Router } from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { isAdmin } from '../../middlewares/usersAuth.js'

import * as Controller from './category.controller.js'

const router = Router()

router.get('/', Controller.getCategories)
router.get('/byName', Controller.getCategoryByName)

router.post('/', isAuth(), isAdmin() ,Controller.addCategory)
router.put('/update/:_id', isAuth(), isAdmin() ,Controller.updateCategory)
router.delete('/:name', isAuth(), isAdmin() ,Controller.deleteCategory)

export default router