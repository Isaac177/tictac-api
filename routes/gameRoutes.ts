import { Router } from 'express';
import { createGame, getGameById } from '../controllers/gameController';

const router = Router();

router.post('/games', createGame);
router.get('/games/:id', getGameById);

export default router;
