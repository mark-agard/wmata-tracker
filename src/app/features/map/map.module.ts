import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { LayerPanelComponent } from './components/layer-panel/layer-panel.component';

@NgModule({
  declarations: [
    MapComponent,
    MapViewerComponent,
    LayerPanelComponent
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
