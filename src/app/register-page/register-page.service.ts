import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class RegisterPageService {

  constructor(private apollo:Apollo) { }

  createNewUser(dataNewUser:any){
    return this.apollo.mutate({
      mutation: gql`
      mutation CreateUser($firstName: String, $lastName: String, $email: String, $password: String) {
        CreateUser(first_name: $firstName, last_name: $lastName, email: $email, password: $password) {
          _id
          email
          first_name
          last_name
          password
          role
          status
        }
      }`,
      variables: {
        firstName: dataNewUser.firstName,
        lastName: dataNewUser.lastName,
        email: dataNewUser.email,
        password: dataNewUser.password
      }
    })
  }
}
