# WMATA Train Tracker

A web application for displaying real-time WMATA vehicle positions on an interactive map.

- Angular 20+ used for the frontend
- Node.js/Express used for the backend
- OpenLayers used for map rendering and manipulation

While the application is still very much in progress, the desired functionality is to display real-time bus and rail vehicle positions on an interactive map, with layer visibility toggles by vehicle type. I'd also like to add a live feed of service alerts and disruptions.

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
│   │   │       └── map.service.ts          # OpenLayers map 
│   │   ├── features/
│   │   │   └── map/                         # Map feature module
│   │   │       ├── map.component.ts         # Main map feature container
│   │   │       ├── map.component.html
│   │   │       ├── map.component.scss
│   │   │       ├── map.module.ts            # Map feature module
│   │   │       └── components/
│   │   │           └── map-viewer/          # Map display component
│   │   │               ├── map-viewer.component.ts
│   │   │               ├── map-viewer.component.html
│   │   │               └── map-viewer.component.scss
│   │   ├── models/
│   │   │   └── train.model.ts              # TypeScript interfaces for train data
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
│   │   │   └── trainController.ts              # Train API route handlers
│   │   ├── services/
│   │   │   └── trainService.ts                 # WMATA API integration
│   │   ├── models/
│   │   │   └── train.model.ts                  # Train data models
│   │   ├── routes/
│   │   │   └── trainRoutes.ts                  # Train API routes
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
