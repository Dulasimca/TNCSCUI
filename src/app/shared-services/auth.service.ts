import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;
  canGoBack = true;

  constructor(private router: Router) { }

  public getValidUser() {
    return this.isSignedIn;
  }

  public setValidUser(value) {
    this.isSignedIn = value;
  }

   public login(userInfo: User, id) {
     if (userInfo !== undefined && id !== undefined) {
       this.isSignedIn = true;
       localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
       localStorage.setItem('ID', id);
     }
   }

  public isLoggedIn() {
    let getInfo = localStorage.getItem('USER_INFO');
   if(getInfo !== null) {
    return true;
   }
   return false;
  }

  public checkLoggedInUserId() {
    let roleId = localStorage.getItem('ID');
    if (roleId !== undefined && roleId !== '') {
      return roleId;
    }
  }

  public logout() {
    localStorage.removeItem('USER_INFO');
    localStorage.removeItem('ID');
    this.isSignedIn = false;
    this.router.navigateByUrl('');
  }
}
