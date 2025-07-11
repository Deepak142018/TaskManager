import express from 'express';
import {
  getTasks, createTask, updateTask, toggleStatus, deleteTask
} from '../Controller.js/taskController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', toggleStatus);
router.delete('/:id', deleteTask);

export default router;
