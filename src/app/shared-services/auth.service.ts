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
     localStorage.setItem('ACCESS_TOKEN', "access_token");
     if (userInfo !== undefined) {
       this.isSignedIn = true;
     }
   }

  public isLoggedIn() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;

  }

  public logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    this.isSignedIn = false;
    this.router.navigate(['/login']);
  }
}
