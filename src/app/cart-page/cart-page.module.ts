import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartPageComponent } from './cart-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ListCartComponent } from './list-cart/list-cart.component';
import { MaterialModule } from '../material/material.module';
import { DialogCartComponent } from './dialog-cart/dialog-cart.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { SharedPipeModule } from '../pipe/shared-pipe.module';

const routes: Routes = [{ path: '', component: CartPageComponent }];

@NgModule({
  declarations: [CartPageComponent, ListCartComponent, DialogCartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    SharedPipeModule
  ],
  exports: [CartPageComponent, ListCartComponent, DialogCartComponent],
})
export class CartPageModule {}
