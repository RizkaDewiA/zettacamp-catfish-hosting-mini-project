import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomepageRestaurantService {

  constructor(private apollo:Apollo) { }

  getMenuHighlight(pagination:any, highlight:boolean){
    return this.apollo.watchQuery({
      query: gql`
      query GetAllRecipesNoToken($menuHighlight: Boolean, $limit: Int, $page: Int) {
        getAllRecipesNoToken(menu_highlight: $menuHighlight, limit: $limit, page: $page) {
          data_recipes {
            recipe_name
            menu_highlight
            image
            description
            available
            price
            status
            id
          }
        }
      }`,
      variables:{
        menuHighlight: highlight, 
        limit: pagination.limit, 
        page: pagination.page
      }
    })
  }

  getMenuOffer(pagination:any, offer:boolean){
    return this.apollo.watchQuery({
      query: gql`
      query GetAllRecipesNoToken($specialOffers: Boolean, $limit: Int, $page: Int) {
        getAllRecipesNoToken(special_offers: $specialOffers, limit: $limit, page: $page) {
          data_recipes {
            recipe_name
            image
            description
            special_offers
            available
            price
            status
            id
            discount
          }
        }
      }`,
      variables:{
        specialOffers: offer, 
        limit: pagination.limit, 
        page: pagination.page
      }
    });
  }

  userLogout(){
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.user_id);
    localStorage.removeItem(environment.role);
    localStorage.removeItem(environment.usertype); 
  }
  
}
