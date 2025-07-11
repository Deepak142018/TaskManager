import express from 'express';
import { getCategories,createCategory,updateCategory,deleteCategory } from '../Controller.js/categoryController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
