import { Router } from 'express';
import { createUser, getUserBySocketId } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:socketId', getUserBySocketId);

export default router;
