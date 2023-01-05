import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => res.send('Send message request stub'));

export default router;
