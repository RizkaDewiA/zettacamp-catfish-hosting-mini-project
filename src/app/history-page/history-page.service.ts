import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class HistoryPageService {
  constructor(private apollo: Apollo) {}

  getAllHistoryAdmin(pagination:any, order_status:any, lastname:any){
    return this.apollo.watchQuery({
      query: gql`
      query GetHistory($limit: Int, $page: Int, $orderStatus: oder_status, $lastNameUser: String) {
        getHistory(limit: $limit, page: $page, order_status: $orderStatus, last_name_user: $lastNameUser) {
          count_failed
          count_pending
          count_success
          count_total
          data_transaction {
            user_id {
              _id
              first_name
              last_name
              status
              email
            }
            id
            menu {
              _id
              amount
              note
              recipe_id {
                recipe_name
                price
                image
                discount
                afterDiscount
              }
              total_recipe
            }
            order_status
            order_date
            total
            status
          }
        }
      }`,
      variables: {
        page: pagination.page,
        limit: pagination.limit,
        orderStatus:order_status,
        lastNameUser:lastname
      },
      fetchPolicy: 'network-only',
    })
  }

  getAllCartStatus(pagination: any, order_status: any) {
    return this.apollo.watchQuery({
      query: gql`
        query GetAllTransaction(
          $page: Int
          $limit: Int
          $orderStatus: oder_status
        ) {
          getAllTransaction(
            page: $page
            limit: $limit
            order_status: $orderStatus
          ) {
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
                  recipe_name
                  status
                  price
                  discount
                  afterDiscount
                }
                note
                _id
                amount
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
        }
      `,
      variables: {
        page: pagination.page,
        limit: pagination.limit,
        orderStatus: order_status,
      },
      fetchPolicy: 'network-only',
    });
  }

  getBalanceAdmin(){
    return this.apollo.watchQuery({
      query: gql`
      query IncomingAdmin {
        incomingAdmin {
          balanceAdmin
        }
      }`,
      fetchPolicy: 'network-only'
    });
  }
}
