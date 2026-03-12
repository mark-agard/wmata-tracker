# GIS Server API

Node.js/Express backend for the GIS web application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Layers
- `GET /api/layers` - Get all layers
- `GET /api/layers/:id` - Get layer by ID
- `POST /api/layers` - Create a new layer
- `PUT /api/layers/:id` - Update a layer
- `DELETE /api/layers/:id` - Delete a layer

### Maps
- `GET /api/maps/config` - Get map configuration

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code

## Architecture

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Data models and types
├── routes/         # API route definitions
├── middleware/     # Express middleware
├── config/         # Configuration files
├── utils/          # Utility functions
└── server.ts       # Application entry point
```
