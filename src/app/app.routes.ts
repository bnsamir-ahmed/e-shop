import { Routes } from '@angular/router';
import { ProductRoutes } from './home/product.routes';
import { homeResolver, homeResolverId } from './home/home-service/home.resolve';
// import {pr}
export const routes: Routes = [

  {
    path:'products',
    loadComponent:()=>import('./home/home.component').then(c=>c.HomeComponent),
    children:[
      {
        path:'',
        loadComponent:()=>import('./home/products/products.component').then(c=>c.ProductsComponent),
        resolve: { products: homeResolver }
      },
      {
        path:':id',
        loadComponent:()=>import('./home/product-id/product-id.component').then(c=> c.ProductIdComponent),
        resolve: { product: homeResolverId }
      }
    ]
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(c => c.CartComponent)
  },
  {
    path:'',
    redirectTo:'products',
     pathMatch: 'full'

  }
// ...ProductRoutes

];
