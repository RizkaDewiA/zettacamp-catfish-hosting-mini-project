import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Ingred, Ingredients} from '../model/ingredients.model';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {

  constructor(private apollo:Apollo) { }

  getAllStock(pagination:any, searchStockName:string){
    // console.log(pagination);
    return this.apollo.watchQuery({
      query:gql`
      query GetAllIngredients($getAllIngredientsStock2: Int, $getAllIngredientsLimit2: Int, $getAllIngredientsPage2: Int, $name: String){
        getAllIngredients(stock: $getAllIngredientsStock2, limit: $getAllIngredientsLimit2, page: $getAllIngredientsPage2, name: $name) {
          page
          max_page
          data {
            id
            name
            status
            stock
          }
          count_active
        }
      }`,
      variables:{
        getAllIngredientsStock2: pagination.stock,
        getAllIngredientsLimit2: pagination.limit,
        getAllIngredientsPage2: pagination.page,
        name: searchStockName
      },
      fetchPolicy: 'network-only'
    });
  };
  

  getOneStock(id:Ingredients):Observable<any>{
    // console.log(id);
    return this.apollo.query({
      query: gql`
      query GetOneIngredients($getOneIngredientsId: ID){
        getOneIngredients(id: $getOneIngredientsId) {
          id
          name
          stock
          status
        }
      }`,
      variables:{
        getOneIngredientsId : id
      }
    });
  };

  createNewStock(data:Ingred):Observable<any>{
    // console.log(name, stock);
    return this.apollo.mutate({
      mutation: gql`
      mutation CreateIngredints($name: String, $stock: Int) {
        CreateIngredints(name: $name, stock: $stock) {
          id
          name
          status
          stock
        }
      }`,
      variables:{
        name : data.name,
        stock : data.stock
      }
    });
  };

  updateStock(id:Ingredients, data:Ingred):Observable<any>{
    // console.log(id, stock);
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateIngredients($updateIngredientsId: ID, $name: String, $stock: Int) {
        UpdateIngredients(id: $updateIngredientsId, name: $name, stock: $stock) {
          id
          name
          stock
          status
        }
      }`,
      variables:{
        updateIngredientsId: id,
        name: data.name, 
        stock: data.stock
      }
    });
  };

  //delete belum jadi
  deleteStock(id:Ingredients):Observable<any>{
    // console.log(id);
    return this.apollo.mutate({
      mutation: gql`
      mutation DeleteIngredients($deleteIngredientsId: ID) {
        DeleteIngredients(id: $deleteIngredientsId) {
          id
          name
          status
          stock
        }
      }`,
      variables:{
        deleteIngredientsId : id
      }
    });
  };
}
