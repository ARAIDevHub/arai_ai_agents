import { Router } from 'express';
import { signup, login, forgotPassword } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;