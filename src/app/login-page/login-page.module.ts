import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { MaterialModule } from '../material/material.module';
import { Routes, RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpLoaderFactory } from '../app.module';

const routes : Routes = [
  {path:"", component:LoginPageComponent}
]
@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage:'en', 
    }),
  ],
  exports: [
    LoginPageComponent
  ]
})
export class LoginPageModule { }

