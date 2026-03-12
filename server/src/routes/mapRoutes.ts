import { Router, Request, Response } from 'express';

const router = Router();

router.get('/config', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      defaultCenter: [-98.5795, 39.8283],
      defaultZoom: 4,
      projection: 'EPSG:3857',
      baseLayers: [
        {
          id: 'osm',
          name: 'OpenStreetMap',
          type: 'tile',
          source: {
            type: 'OSM'
          }
        }
      ]
    }
  });
});

export default router;
