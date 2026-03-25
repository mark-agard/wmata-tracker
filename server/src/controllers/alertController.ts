import { Request, Response, NextFunction } from 'express';
import alertService from '../services/alertService';

export const getAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const alerts = await alertService.fetchAlerts();
    res.json({
      status: 'success',
      data: alerts,
      lastUpdate: alertService.getLastUpdateTime(),
      isFresh: alertService.isDataFresh()
    });
  } catch (error) {
    next(error);
  }
};

export const getCachedAlerts = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const alerts = alertService.getAlerts();
    const lastUpdate = alertService.getLastUpdateTime();
    const isFresh = alertService.isDataFresh();

    res.json({
      status: 'success',
      data: alerts,
      lastUpdate,
      isFresh,
      message: isFresh ? 'Data is fresh' : 'Data may be stale'
    });
  } catch (error) {
    next(error);
  }
};
