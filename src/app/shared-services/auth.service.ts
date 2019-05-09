import { Injectable } from '@angular/core';
// import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;

  constructor() { }

  public getValidUser() {
    return this.isSignedIn;
  }

  public setValidUser(value) {
    this.isSignedIn = value;
  }

  // public login(userInfo: User) {
  //  localStorage.setItem('ACCESS_TOKEN', "access_token");
  // }

  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;

  }

  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
  }
}
