# DC OpenLayers GIS Application

A web application for viewing and manipulating spatial data focused on datasets local to the DMV.

- Angular 20+ used for the frontend
- Node.js/Express used for the backend
- OpenLayers used for map rendering and manipulation
- PostGIS used for spatial data storage and retrieval

This functions as a personal exploration of OpenLayers, since my tech stack for professional use relies on Mapbox GL JS. Additionally, I'd like to take some time to make better use of Angular features.

As far as backend functionality, this project provides an opportunity to refine my API design and SQL query optimization skills. In particular, I'd like to optimize the MVT tile generation and make effective use of caching to improve performance. Eventually, I would like to make use of WMATA's API to provide real-time transit data too.

Because this project is functionally similar to internal applications I've built in my current position, this serves as a portfolio piece I can share publicly. It also lets me play around with design/technical decisions that appeal to me personally, but aren't compatible with stakeholder requirements my internal products must satisfy.

## Project Structure

```
gis-client/                              # Monorepo Root
├── src/                                 # Angular 20+ Frontend
│   ├── app/
│   │   ├── core/
│   │   │   ├── header/                     # Application header component
│   │   │   │   ├── header.ts
│   │   │   │   ├── header.html
│   │   │   │   └── header.scss
│   │   │   └── services/
│   │   │       └── map.service.ts          # OpenLayers map management
│   │   ├── features/
│   │   │   └── map/                         # Map feature module
│   │   │       ├── map.component.ts         # Main map feature container
│   │   │       ├── map.component.html
│   │   │       ├── map.component.scss
│   │   │       ├── map.module.ts            # Map feature module
│   │   │       └── components/
│   │   │           ├── map-viewer/          # Map display component
│   │   │           │   ├── map-viewer.component.ts
│   │   │           │   ├── map-viewer.component.html
│   │   │           │   └── map-viewer.component.scss
│   │   │           └── layer-panel/         # Layer management panel
│   │   │               ├── layer-panel.component.ts
│   │   │               ├── layer-panel.component.html
│   │   │               └── layer-panel.component.scss
│   │   ├── models/
│   │   │   └── layer.model.ts              # TypeScript interfaces
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.config.ts                   # Application configuration
│   │   └── app.routes.ts                   # Route definitions
│   ├── environments/
│   │   ├── environment.ts                  # Development config
│   │   └── environment.prod.ts             # Production config
│   ├── index.html
│   ├── main.ts                             # Application entry point
│   └── styles.scss                         # Global styles
│
├── public/                                # Angular static assets
│   └── favicon.ico
│
├── server/                                # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── layerController.ts              # Layer route handlers
│   │   ├── services/
│   │   │   └── layerService.ts                 # Layer business logic
│   │   ├── models/
│   │   │   └── layer.model.ts                  # Data models & DTOs
│   │   ├── routes/
│   │   │   ├── layerRoutes.ts                  # Layer API routes
│   │   │   └── mapRoutes.ts                    # Map API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts                 # Error handling
│   │   │   └── notFoundHandler.ts              # 404 handler
│   │   └── server.ts                           # Express app entry point
│   ├── tsconfig.json
│   └── .env.example                            # Environment template
│
├── package.json                           # Root package.json (merged dependencies)
├── angular.json                           # Angular CLI configuration
├── tsconfig.json                          # TypeScript configuration
├── tsconfig.app.json
├── tsconfig.spec.json
├── Dockerfile                             # Railway deployment
├── railway.toml                           # Railway configuration
├── .env.example                           # Environment template
├── .gitignore
└── README.md                              # This file
```

## Architectural Choices

One of the first meaningful architectural choices I've made is to organize the project as a monorepo where the frontend and backend are in the same repository. In a production environment, it might be better to split them up into separate repositories for better isolation and deployment flexibility. For my purposes, however, it's nice to deploy this as one repo to Railway. 
