import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CartPageGuard } from './guard/cart-page.guard';
import { MenuManagementGuard } from './guard/menu-management.guard';
import { StockManagementGuard } from './guard/stock-management.guard';
import { HomepageRestaurantComponent } from './homepage-restaurant/homepage-restaurant.component';
import { HomepageUserComponent } from './homepage-restaurant/homepage-user/homepage-user.component';
import { LandingPageComponent } from './homepage-restaurant/landing-page/landing-page.component';
import { MenuHiglightComponent } from './homepage-restaurant/menu-higlight/menu-higlight.component';

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  {
    path: 'home-page',
    component: HomepageRestaurantComponent,
    children: [
      { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
      { path: 'landing-page', component: LandingPageComponent },
      {
        path: 'menu-page',
        loadChildren: () =>
          import('./menu-page/menu-page.module').then((m) => m.MenuPageModule),
      },
      { path: '**', redirectTo: "landing-page", pathMatch:"full"}
    ],
  },
  {
    path: 'main-page',
    component: HomepageRestaurantComponent,
    children: [
      { path: '', redirectTo: 'menu-offer', pathMatch: 'full' },
      {
        path: 'menu-page',
        loadChildren: () =>
          import('./menu-page/menu-page.module').then((m) => m.MenuPageModule),
      },
      {
        path: 'cart-page',
        loadChildren: () =>
          import('./cart-page/cart-page.module').then((m) => m.CartPageModule),
          canActivate:[CartPageGuard]
      },
      {
        path: 'history-page',
        loadChildren: () =>
          import('./history-page/history-page.module').then(
            (m) => m.HistoryPageModule
          ),
      },
      {
        path: 'about-page',
        loadChildren: () =>
          import('./about-page/about-page.module').then(
            (m) => m.AboutPageModule
          ),
      },
      {
        path: 'stock-management',
        loadChildren: () =>
          import('./stock-management/stock-management.module').then(
            (m) => m.StockManagementModule
          ),
          canActivate:[StockManagementGuard]
      },
      {
        path: 'menu-management',
        loadChildren: () =>
          import('./menu-management/menu-management.module').then(
            (m) => m.MenuManagementModule
          ),
          canActivate:[MenuManagementGuard]
      },
      {
        path: 'menu-offer',
        component: HomepageUserComponent
      },
      {
        path:'**', redirectTo:"menu-offer", pathMatch:"full"
      }
    ],
  },
  {
    path: 'login-page',
    loadChildren: () =>
      import('./login-page/login-page.module').then((m) => m.LoginPageModule),
  },
//   {
//     path: 'register-page',
//     loadChildren: () =>
//       import('./register-page/register-page.module').then((m) => m.RegisterPageModule),
//   },
  {
    path:'**', redirectTo:"home-page", pathMatch:"full"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
