import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmailPassword } from '../model/email-pass.model';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {

  constructor(private apollo:Apollo) { }

  loginUser(email: string, password:string):Observable<any>{
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        login (email: "${email}", password: "${password}"){
          token,
          role,
          id,
          usertype{
            name
            icon_name
            view
            slug
          }
        }
      }`
    }).pipe(
      map((resp) => {
        this.userLogin(resp.data);
        return resp;
      })
    ) 
  }

  checkValidation(email:string):Observable<any>{
    return this.apollo.query({
      query: gql`
      query GetOneUser($email: String) {
        getOneUser(email: $email) {
          _id
          email
          first_name
          last_name
        }
      }`,
      variables: {
        email: email
      }
    })
  }

  resetPassword(data: EmailPassword){
    return this.apollo.mutate({
      mutation: gql`
      mutation ForgetPassword($email: String, $password: String) {
        ForgetPassword(email: $email, password: $password) {
          _id
          email
          first_name
          last_name
        }
      }`,
      variables: {
        email: data.email,
        password: data.password,
      }
    });
  }

  userLogin(data:any){
    console.log(data);
    localStorage.setItem(environment.tokenKey, JSON.stringify(data.login.token));
    localStorage.setItem(environment.user_id, JSON.stringify(data.login.id));
    localStorage.setItem(environment.role, JSON.stringify(data.login.role));
    localStorage.setItem(environment.usertype, JSON.stringify(data.login.usertype));
  }
}
