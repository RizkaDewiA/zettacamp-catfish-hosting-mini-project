import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuPageService {

  constructor(private apollo:Apollo) { }

  getAllMenuNow(pagination:any, filterMenu:any){
    return this.apollo.watchQuery({
      query: gql`
      query GetAllRecipesNoToken($limit: Int, $status: status_recipe, $page: Int, $recipeName: String) {
        getAllRecipesNoToken(limit: $limit, status: $status, page: $page, recipe_name: $recipeName) {
          data_recipes {
            id
            description
            available
            image
            price
            status
            recipe_name
            special_offers
            menu_highlight
            discount
          }
          count_publish
        }
      }`,
      variables:{
        page: pagination.page,
        limit: pagination.limit,
        recipeName: filterMenu,
        status: 'publish',
      },
      fetchPolicy:"network-only"
    });
  };

  getOneMenu(id:string):Observable<any>{
    return this.apollo.query({
      query:gql`
      query GetOneRecipes($getOneRecipesId: ID) {
        getOneRecipes(id: $getOneRecipesId) {
          available
          id
          ingredients {
            ingredient_id {
              id
              name
              stock
              status
            }
            stock_used
          }
          price
          recipe_name
          status
          description
          image
        }
      }`,
      variables:{
        getOneRecipesId : id
      }
    });
  };

  addCart(addMenu:any):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation AddCart($menu: [trans_menuInput]) {
        addCart(menu: $menu) {
          id
          menu {
            note
            amount
            _id
            recipe_id {
              recipe_name
              price
              id
            }
          }
        }
      }`,
      variables: {
        menu: [addMenu]
      }
    })
  }
}
