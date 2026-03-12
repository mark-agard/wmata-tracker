# GIS Client

Angular 20+ frontend application with OpenLayers integration for GIS visualization.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:4200`

## Features

- **Interactive Map Viewer** - OpenLayers-powered map with pan, zoom, and navigation
- **Layer Management** - Add, remove, and configure map layers
- **Layer Controls** - Toggle visibility and adjust opacity
- **Responsive Design** - Works on desktop and mobile devices
- **Modular Architecture** - Feature-based organization for scalability

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Lint code

## Architecture

```
src/app/
├── core/           # Singleton services (MapService)
├── shared/         # Shared components, directives, pipes
├── features/       # Feature modules
│   └── map/        # Map feature
│       ├── map-viewer/      # Main map component
│       └── layer-panel/     # Layer management panel
├── models/         # TypeScript interfaces
└── services/       # Additional services
```

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@core/*` - Core services and utilities
- `@shared/*` - Shared components
- `@features/*` - Feature modules
- `@models/*` - Data models
- `@services/*` - Services
- `@environments/*` - Environment configs

## OpenLayers Integration

OpenLayers is integrated through the `MapService` which provides:
- Map initialization and configuration
- Layer management (add, remove, update)
- Map state management using Angular signals
