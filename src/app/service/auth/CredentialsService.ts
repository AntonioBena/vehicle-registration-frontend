import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService{

  set userCredentials(auth: any){
    localStorage.setItem('credentials', this.codePassword(auth))
  }

  get userCredentials(){
    return localStorage.getItem('credentials');
  }

  private codePassword(auth: any): string{
    return btoa(auth.accountId + ':' + auth.password);
  }
}
