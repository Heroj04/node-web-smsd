import { Router } from 'express';
import routes from './routes';

const router = Router();

router.use('/session', routes.session);
router.use('/users', routes.user);
router.use('/messages', routes.messages);

export default router;
