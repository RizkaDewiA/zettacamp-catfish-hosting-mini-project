import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ProfilePageService {

  constructor(private apollo:Apollo) { }

  getUserProfile(id:string){
    return this.apollo.watchQuery({
      query: gql`
      query GetOneUser($getOneUserId: ID) {
        getOneUser(id: $getOneUserId) {
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
}
