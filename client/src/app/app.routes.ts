import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/map/map-viewer/map-viewer.component').then(m => m.MapViewerComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
