import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';

@NgModule({
  declarations: [
    MapComponent,
    MapViewerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    MapComponent
  ]
})
export class MapModule {}
