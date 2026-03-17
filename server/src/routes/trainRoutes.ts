import { Router } from 'express';
import { getTrainPositions, getCachedTrainPositions } from '../controllers/trainController';

const router = Router();

// Get fresh train positions from WMATA API
router.get('/', getTrainPositions);

// Get cached train positions (faster, may be stale)
router.get('/cached', getCachedTrainPositions);

export default router;
