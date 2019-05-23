import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;

  constructor(private router: Router) { }

  public getValidUser() {
    return this.isSignedIn;
  }

  public setValidUser(value) {
    this.isSignedIn = value;
  }

   public login(userInfo: User) {
     if (userInfo !== undefined) {
       this.isSignedIn = true;
       localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
     }
   }

  public isLoggedIn() {
    let getInfo = localStorage.getItem('USER_INFO');
   if(getInfo !== null) {
    return true;
   }
   return false;
  }

  public logout() {
    localStorage.removeItem('USER_INFO');
    this.isSignedIn = false;
    this.router.navigate(['/login']);
  }
}
