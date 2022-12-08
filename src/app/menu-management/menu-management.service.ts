import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Menu, MenuRecipes } from '../model/menu.model';
import { Pagination } from '../model/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MenuManagementService {

  constructor(private apollo:Apollo) { }

  getAllStock():Observable<any>{
    return this.apollo.query({
      query:gql`
      query GetAllIngredients{
        getAllIngredients(page: 1, limit: 100, stock: 1) {
          data {
            id
            name
          }
        }
      }`
    });
  };

  getAllMenu(pagination:Pagination, name:any, status:any){
    // console.log(pagination);
    return this.apollo.watchQuery({
      query: gql`
      query GetAllRecipes($page: Int, $limit: Int, $recipeName: String, $status: status_recipe){
        getAllRecipes(page: $page, limit: $limit, recipe_name: $recipeName, status: $status) {
          count_unpublish
          count_total
          count_publish
          count_deleted
          page
          max_page
          data_recipes {
            available
            id
            status
            recipe_name
            price
            menu_highlight
            special_offers
            discount
          }
        }
      }`,
      variables:{
        page: pagination.page,
        limit: pagination.limit,
        recipeName: name,
        status: status
      },
      fetchPolicy:"network-only"
    });
  }

  getOneMenu(id:Menu):Observable<any>{
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

  createNewMenu(dataRecipes: MenuRecipes){
    return this.apollo.mutate({
      mutation: gql`
      mutation CreateRecipes($recipeName: String, $description: String, $image: String, $ingredients: [ingredientidinput], $status: status_recipe, $price: Int) {
        CreateRecipes(recipe_name: $recipeName, description: $description, image: $image, ingredients: $ingredients, status: $status, price: $price) {
          available
          description
          id
          image
          ingredients {
            ingredient_id {
              name
              id
              status
              stock
            }
            stock_used
          }
          price
          recipe_name
          status
        }
      }`,
      variables:{
        recipeName: dataRecipes.recipe_name,
        ingredients:dataRecipes.ingredients,
        status: dataRecipes.status,
        price: dataRecipes.price,
        image: dataRecipes.image,
        description: dataRecipes.description
      }
    });
  };

  updateMenu(id: Menu, dataRecipes: MenuRecipes):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateRecipe($updateRecipeId: ID, $status: status_recipe, $recipeName: String, $price: Int, $ingredients: [ingredientidinput], $image: String, $description: String) {
        UpdateRecipe(id: $updateRecipeId, status: $status, recipe_name: $recipeName, price: $price, ingredients: $ingredients, image: $image, description: $description) {
          id
          status
          available
          ingredients {
            ingredient_id {
              id
              name
              status
              stock
            }
            stock_used
          }
          price
          recipe_name
          description
          image
        }
      }`,
      variables:{
        updateRecipeId:id,
        recipeName: dataRecipes.recipe_name,
        ingredients: dataRecipes.ingredients,
        status: dataRecipes.status,
        price: dataRecipes.price,
        image: dataRecipes.image,
        description: dataRecipes.description
      }
    })
  }

  updateStatusMenu(id: string, status: string):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateRecipe($updateRecipeId: ID, $status: status_recipe) {
        UpdateRecipe(id: $updateRecipeId, status: $status) {
          id
          status
        }
      }`,
      variables: {
        updateRecipeId: id,
        status: status
      }
    });
  }

  updateHighlight(id: string, highlight: boolean):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateRecipe($menuHighlight: Boolean, $updateRecipeId: ID) {
        UpdateRecipe(menu_highlight: $menuHighlight, id: $updateRecipeId) {
          id
          menu_highlight
        }
      }`,
      variables: {
        updateRecipeId:id,
        menuHighlight:highlight
      }
    })
  }

  updateSpecialOffer(id: string, offer: boolean, discount: number):Observable<any>{
    console.log(discount);
    return this.apollo.mutate({
      mutation: gql `
      mutation UpdateRecipe($updateRecipeId: ID, $specialOffers: Boolean, $discount: Int) {
        UpdateRecipe(id: $updateRecipeId, special_offers: $specialOffers, discount: $discount) {
          id
          special_offers
          recipe_name
          discount
        }
      }`,
      variables: {
        updateRecipeId:id,
        specialOffers:offer,
        discount: discount
      }
    })
  }

  deleteMenu(id: Menu):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation DeleteRecipe($deleteRecipeId: ID) {
        DeleteRecipe(id: $deleteRecipeId) {
          id
          recipe_name
          status
        }
      }`,
      variables: {
        deleteRecipeId: id
      }
    })
  }
}
