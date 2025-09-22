import { Routes } from '@angular/router';

export const ProductRoutes: Routes = [
  {
    path:'home',
    loadComponent:()=>import('./home.component').then(c=>c.HomeComponent),
    children:[
        

      {
        path:'product/:id',
        loadComponent:()=>import('./product-id/product-id.component').then(c=>c.ProductIdComponent)
      }

    ]
  },

  // {
  //   path:'product/:id',
  //   loadComponent:()=>import('./product.component').then(c=>c.ProductComponent)
  // }
];
