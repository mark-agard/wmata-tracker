import { Router } from 'express';
import { getTrips, getCachedTrips, getStationArrivals } from '../controllers/tripController';

const router = Router();

router.get('/', getTrips);
router.get('/cached', getCachedTrips);
router.get('/station/:stopId', getStationArrivals);

export default router;
