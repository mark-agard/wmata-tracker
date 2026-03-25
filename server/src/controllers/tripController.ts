import { Request, Response, NextFunction } from 'express';
import tripService from '../services/trip.service';

export const getTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trips = await tripService.fetchTrips();
    res.json({
      status: 'success',
      data: trips,
      lastUpdate: tripService.getLastUpdateTime(),
      isFresh: tripService.isDataFresh()
    });
  } catch (error) {
    next(error);
  }
};

export const getCachedTrips = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const trips = tripService.getTrips();
    const lastUpdate = tripService.getLastUpdateTime();
    const isFresh = tripService.isDataFresh();

    res.json({
      status: 'success',
      data: trips,
      lastUpdate: lastUpdate ? lastUpdate.toISOString() : null,
      isFresh,
      message: isFresh ? 'Data is fresh' : 'Data may be stale'
    });
  } catch (error) {
    next(error);
  }
};

export const getStationArrivals = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const stopId = typeof req.params.stopId === 'string' ? req.params.stopId : req.params.stopId[0];
    const arrivals = tripService.getArrivalsForStation(stopId);

    res.json({
      status: 'success',
      data: arrivals,
      stopId,
      lastUpdate: tripService.getLastUpdateTime()?.toISOString() || null
    });
  } catch (error) {
    next(error);
  }
};
