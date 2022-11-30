import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageRestaurantComponent } from './homepage-restaurant.component';
import { MaterialModule } from '../material/material.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { MenuHiglightComponent } from './menu-higlight/menu-higlight.component';
import { SpecialOfferComponent } from './special-offer/special-offer.component';
import { HomepageUserComponent } from './homepage-user/homepage-user.component';
import { AboutPageModule } from '../about-page/about-page.module';

@NgModule({
  declarations: [
    HomepageRestaurantComponent,
    LandingPageComponent,
    MenuHiglightComponent,
    SpecialOfferComponent,
    HomepageUserComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslateModule.forChild({
      extend: true
    }),
    AboutPageModule
  ],
  exports:[
    HomepageRestaurantComponent,
    LandingPageComponent,
    HomepageUserComponent,
    MenuHiglightComponent,
    SpecialOfferComponent
  ]
})
export class HomepageRestaurantModule { }
