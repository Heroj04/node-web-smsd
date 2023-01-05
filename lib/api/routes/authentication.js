import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => res.send('user login stub'));

router.post('/logout', (req, res) => res.send('user logout stub'));

export default router;
