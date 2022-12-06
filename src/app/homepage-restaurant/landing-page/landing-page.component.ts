import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { HomepageRestaurantService } from '../homepage-restaurant.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css','../homepage-restaurant.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  pagination = {
    page: 1,
    limit: 100
  }

  highlight:boolean = true;
  offer:boolean = true;
  menuHighlight:any;
  menuOffer:any;

  constructor(private router:Router, private serviceHomepage:HomepageRestaurantService) { }

  ngOnInit(): void {
    this.subs.sink = this.serviceHomepage.getMenuHighlight(this.pagination, this.highlight).valueChanges.subscribe((res)=>{
      this.menuHighlight = res?.data;
      this.menuHighlight = this.menuHighlight?.getAllRecipesNoToken.data_recipes.filter((stat)=>stat.status == 'publish');
    });

    this.subs.sink = this.serviceHomepage.getMenuOffer(this.pagination, this.offer).valueChanges.subscribe((res)=>{
      this.menuOffer = res?.data;
      this.menuOffer = this.menuOffer?.getAllRecipesNoToken.data_recipes.filter((stat)=>stat.status == 'publish');
    });
  }

  onRight(event){
    document.getElementById(event).scrollLeft += 200;
  }

  onLeft(event){
    document.getElementById(event).scrollLeft -= 200;
  }

  loginPage(){
    this.router.navigate(['/login-page']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
