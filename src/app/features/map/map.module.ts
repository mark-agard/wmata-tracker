import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { LayerToggleComponent } from './components/layer-toggle/layer-toggle.component';

@NgModule({
  declarations: [
    MapComponent,
    MapViewerComponent,
    LayerToggleComponent
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
