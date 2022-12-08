import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../model/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class HomepageRestaurantService {

  constructor(private apollo:Apollo) { }

  getMenuHighlight(pagination:Pagination, highlight:boolean){
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
      },
      fetchPolicy: "network-only"
    })
  }

  getMenuOffer(pagination:Pagination, offer:boolean){
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
            afterDiscount
          }
        }
      }`,
      variables:{
        specialOffers: offer, 
        limit: pagination.limit, 
        page: pagination.page
      },
      fetchPolicy: "network-only"
    });
  }

  userLogout(){
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.user_id);
    localStorage.removeItem(environment.role);
    localStorage.removeItem(environment.usertype); 
  }

  getUserProfile(id:string){
    return this.apollo.watchQuery({
      query: gql`
      query GetOneUser($getOneUserId: ID, $email: String) {
        getOneUser(id: $getOneUserId, email: $email) {
          _id
          email
          first_name
          last_name
          role
          saldo
          status
        }
      }`,
      variables: {
        getOneUserId: id
      },
      fetchPolicy: 'network-only'
    });
  }

  getOneCart(){
    return this.apollo.watchQuery({
      query: gql`
      query GetOneTransaction{
        getOneTransaction {
          id
          menu {
            note
            amount
            _id
            recipe_id {
              recipe_name
            }
          }
        }
      }`,
      fetchPolicy:'network-only'
    })
  }
  
}
