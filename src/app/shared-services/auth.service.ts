import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;
  canGoBack = true;
  getUserInfo: any;

  constructor(private router: Router) { }

  public getValidUser() {
    return this.isSignedIn;
  }

  public getMenu(){
    let menu: any = localStorage.getItem('MENU');
    if(menu !== null) {
     return JSON.parse(menu);
    }
    return null;
  }

  public setValidUser(value) {
    this.isSignedIn = value;
  }
  public setMenu(data) {
    localStorage.setItem('MENU', JSON.stringify(data));
  }

   public login(userInfo: User, id) {
     if (userInfo !== undefined && id !== undefined) {
       this.isSignedIn = true;
       localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
       localStorage.setItem('ID', id);
     }
   }

   public getCredentials() {
    this.getUserInfo = localStorage.getItem('USER_INFO');
     return this.getUserInfo;
   }

   public isKeepMeLoggedIn(isLogged) {
    let userCredentials;
     if(isLogged) {
       userCredentials = localStorage.getItem('USER_INFO');
     }
    localStorage.setItem('KEEP_ME_LOGGED_IN', isLogged);
    return userCredentials;
   }

   public checkLoggedIn() {
    let isLoggedInTrue = localStorage.getItem('KEEP_ME_LOGGED_IN');
       return isLoggedInTrue;
   }


  public isLoggedIn() {
    let getInfo = localStorage.getItem('USER_INFO');
    let roleId = localStorage.getItem('ID');
   if(getInfo !== null && roleId !== null) {
    return true;
   }
   return false;
  }

  public canShowMenu() {
    let getInfo = localStorage.getItem('USER_INFO');
    let roleId = localStorage.getItem('ID');
    let menu = localStorage.getItem('MENU');
   if(getInfo !== null && roleId !== null && menu !== null) {
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
    localStorage.removeItem('MENU');
    this.isSignedIn = false;
    this.router.navigateByUrl('');
  }
}
