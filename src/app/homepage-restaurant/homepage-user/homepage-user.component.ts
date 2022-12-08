import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/model/pagination.model';
import { SubSink } from 'subsink';
import { HomepageRestaurantService } from '../homepage-restaurant.service';

@Component({
  selector: 'app-homepage-user',
  templateUrl: './homepage-user.component.html',
  styleUrls: ['./homepage-user.component.css']
})
export class HomepageUserComponent implements OnInit {
  private subs = new SubSink();
  pagination:Pagination = {
    page: 1,
    limit: 100
  }

  highlight:boolean = true;
  offer:boolean = true;
  menuHighlight:any;
  menuOffer:any;
  constructor(private serviceHighOffer:HomepageRestaurantService) { }

  ngOnInit(): void {
    this.subs.sink = this.serviceHighOffer.getMenuHighlight(this.pagination, this.highlight).valueChanges.subscribe((res)=>{
      this.menuHighlight = res?.data;
      this.menuHighlight = this.menuHighlight?.getAllRecipesNoToken.data_recipes.filter((stat)=>stat.status == 'publish');
    });

    this.subs.sink = this.serviceHighOffer.getMenuOffer(this.pagination, this.offer).valueChanges.subscribe((res)=>{
      this.menuOffer = res?.data;
      this.menuOffer = this.menuOffer?.getAllRecipesNoToken.data_recipes.filter((stat)=>stat.status == 'publish');
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
