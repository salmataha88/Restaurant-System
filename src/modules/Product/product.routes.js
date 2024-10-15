import { Router } from 'express'
import { isAuth } from '../../middlewares/auth.js'
import { isAdmin } from '../../middlewares/usersAuth.js'

import * as Controller from './product.controller.js'

const router = Router()

router.get('/', Controller.getProducts)
router.get('/ByName', Controller.getProductByName)
router.get('/ByCategory', Controller.getProductsByCategory)

router.post('/', isAuth(), isAdmin() ,Controller.addProduct)
router.put('/update/:_id', isAuth(), isAdmin() ,Controller.updateProduct)
router.delete('/:id', isAuth(), isAdmin() ,Controller.deleteProduct)

router.get('/inStock', Controller.getInStockProducts)
router.get('/outOfStock', Controller.getOutStockProducts)

export default router