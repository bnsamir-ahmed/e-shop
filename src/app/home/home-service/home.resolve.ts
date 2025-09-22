import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router'
import { Product } from '../modal/products.modal';
import { inject } from '@angular/core';
import { HomeService } from './home.service';

export const homeResolver: ResolveFn<Product[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const homeService = inject(HomeService);
  return homeService.getAllPosts();
};

// export const homeResolverId: ResolveFn<Product> = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   const homeService = inject(HomeService);
//   return homeService.getProductById(route.paramMap.get('id')!);
// };

export const homeResolverId: ResolveFn<Product> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const homeService = inject(HomeService);
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('Product ID is missing in route parameters');
  }

  return homeService.getProductById(id);
};

