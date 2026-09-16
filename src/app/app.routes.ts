import { Routes } from '@angular/router';
import { Login } from './login/login';
import { ProductList } from './product-list/product-list';
import { Cart } from './cart/cart';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'products', component: ProductList, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' }
];