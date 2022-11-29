import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class HistoryPageService {

  constructor(private apollo:Apollo) { }

  getAllCartStatus(pagination:any, order_status:any){
    return this.apollo.watchQuery({
      query: gql`
      query GetAllTransaction($page: Int, $limit: Int, $orderStatus: oder_status) {
        getAllTransaction(page: $page, limit: $limit, order_status: $orderStatus) {
          count_failed
          count_pending
          count_success
          count_total
          data_transaction {
            id
            menu {
              recipe_id {
                available
                description
                id
                image
                price
                recipe_name
                status
              }
              note
              amount
              _id
              total_recipe
            }
            status
            order_status
            order_date
            total
            user_id {
              _id
              role
              password
              last_name
              first_name
            }
          }
        }
      }`,
      variables: {
        page: pagination.page,
        limit: pagination.limit,
        orderStatus: order_status
      },
      fetchPolicy:'network-only',
    })
  }
}
