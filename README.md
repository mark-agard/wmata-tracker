# WMATA Train Tracker
*Note: This project was created with AI assistance, though I'd never subject the reader to AI-generated documentation.*

This lightweight application displays real-time WMATA rail vehicle positions, station and line information, and service alerts. It serves as a simple alternative to the WMATA website. While not technically complex, it made for a fun first project using GTFS-RT and OpenLayers, since I had never worked with either before (I use Mapbox in my day job).

I need to remember to add this to railway so it's actually available to the public. 

## Features
- Real-time WMATA rail vehicle positions
- Station and line information, including live arrival/departure data
- Service alerts and disruptions

## Stack
The application is built using Angular 20 for the frontend and Node.js/Express for the backend. Webmapping is powered by OpenLayers.

## Data Sources
- The features for stations and lines were retrieved as geojson from opendata.dc.gov.
- Real-time vehicle position and trip information are retrieved from the WMATA GTFS-RT API.

## Lessons Learned
- Ascertaining correct column information to make use of the Rail RT Trip Updates endpoint took longer than it should've. I assumed that the GIS_ID field of the stations geojson would match the ID field of the trip updates, but it didn't. Spent a while assuming my backend logic was broken before realizing by chance that deriving stop required using the TRAININFO_URL field from the geojson. A value like "https://.../nexttrain.html#E03|Georgia Ave-Petworth" contains the sring E03, which matches the "PF_B06_C" pattern present in the vehicle positions responses. That PF_B06_C value is what I needed to match against in the trip updates.
- Enriching the station arrivals panel with direction also took a bit of extra legwork. The trip updates don't include a direction field, so I had to derive it from the route and stop information. This involved extracting all stops from a trip, then determing the position of the train relative to the midpoint of the trip to determine which direction it was heading.

All in all, I should have probably spent more time thinking through the logic and checking assumptions (like the GIS_ID) before diving in. It was pretty fun to identify the GIS_ID issue though, since neither Kimi K2.5 nor Claude 4.5 Sonnet could figure it out on their own. Perhaps our jobs are safe so long as AI doesn't think to actually read the data before I do.

## Planned Features

- Implement app routing to allow for, at a minimum, an about page that provides information about the application and usage. I may also add a data page explaining the GTFS-RT structure. Eventually, the app router could be used to meaningfully enrich the application with pages for trip details, timetable information, etc.
- It might be fun to implement some routing functionality to allow users to plan trips between stations. I am not sure if this is possible with the minimalist backend I built, but it would be a nice addition. 
- Extending the application to support bus information would be a nice feature. I wonder if I could re-use the rail logic for that, or if I'd need to build a separate backend service for bus data. My hope is that the GTFS-RT API for buses is similar enough to the rail API that I could abstract the existing code into generalized methods.