import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

  userLogin(data:any){
    console.log(data);
    localStorage.setItem(environment.tokenKey, JSON.stringify(data.login.token));
    localStorage.setItem(environment.user_id, JSON.stringify(data.login.id));
    localStorage.setItem(environment.role, JSON.stringify(data.login.role));
    localStorage.setItem(environment.usertype, JSON.stringify(data.login.usertype));
  }
}
