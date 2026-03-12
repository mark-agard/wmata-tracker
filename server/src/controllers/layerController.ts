import { Request, Response, NextFunction } from 'express';
import layerService from '../services/layerService';
import { CreateLayerDto, UpdateLayerDto } from '../models/layer.model';

export const getAllLayers = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const layers = layerService.getAllLayers();
    res.json({
      status: 'success',
      data: layers
    });
  } catch (error) {
    next(error);
  }
};

export const getLayerById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const layer = layerService.getLayerById(id);

    if (!layer) {
      res.status(404).json({
        status: 'error',
        message: 'Layer not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: layer
    });
  } catch (error) {
    next(error);
  }
};

export const createLayer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const dto: CreateLayerDto = req.body;
    const newLayer = layerService.createLayer(dto);

    res.status(201).json({
      status: 'success',
      data: newLayer
    });
  } catch (error) {
    next(error);
  }
};

export const updateLayer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const dto: UpdateLayerDto = req.body;
    const updatedLayer = layerService.updateLayer(id, dto);

    if (!updatedLayer) {
      res.status(404).json({
        status: 'error',
        message: 'Layer not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: updatedLayer
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLayer = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const deleted = layerService.deleteLayer(id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Layer not found'
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
