import { Request, Response, NextFunction } from 'express';
import trainService from '../services/trainService';

export const getTrainPositions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trainPositions = await trainService.fetchTrainPositions();
    res.json({
      status: 'success',
      data: trainPositions,
      lastUpdate: trainService.getLastUpdateTime(),
      isFresh: trainService.isDataFresh()
    });
  } catch (error) {
    next(error);
  }
};

export const getCachedTrainPositions = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const trainPositions = trainService.getTrainPositions();
    const lastUpdate = trainService.getLastUpdateTime();
    const isFresh = trainService.isDataFresh();
    
    res.json({
      status: 'success',
      data: trainPositions,
      lastUpdate,
      isFresh,
      message: isFresh ? 'Data is fresh' : 'Data may be stale'
    });
  } catch (error) {
    next(error);
  }
};
