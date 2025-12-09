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
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(c => c.CheckoutComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(c => c.AboutComponent)
  },
  {
    path: 'offers',
    loadComponent: () => import('./offers/offers.component').then(c => c.OffersComponent)
  },
  {
    path: 'account/history',
    loadComponent: () => import('./account/account-history.component').then(c => c.AccountHistoryComponent)
  },
  {
    path:'',
    redirectTo:'products',
     pathMatch: 'full'

  }
// ...ProductRoutes

];
