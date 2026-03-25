import { Router } from 'express';
import { getAlerts, getCachedAlerts } from '../controllers/alertController';

const router = Router();

router.get('/', getAlerts);
router.get('/cached', getCachedAlerts);

export default router;
