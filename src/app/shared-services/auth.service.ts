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

  public setServerDate(date) {
    localStorage.setItem('SERVER_DATE', JSON.stringify(date));
  }

   public login(userInfo: User, obj) {
     if (userInfo !== undefined && obj.RoleId !== undefined) {
       this.isSignedIn = true;
       localStorage.setItem('USER_INFO', JSON.stringify(userInfo));
       localStorage.setItem('ID', obj.RoleId);
       localStorage.setItem('GCODE', obj.GCode);
       localStorage.setItem('RCODE', obj.RCode);
       localStorage.setItem('GNAME', obj.GName);
       localStorage.setItem('RNAME', obj.RName);
       localStorage.setItem('MAPPINGID', obj.MappingId);
       localStorage.setItem('MAPPINGNAME', obj.MappingName);
     }
   }

   public getCredentials() {
    this.getUserInfo = localStorage.getItem('USER_INFO');
     return this.getUserInfo;
   }

   public isKeepMeLoggedIn(isLogged) {
    localStorage.setItem('KEEP_ME_LOGGED_IN', isLogged);
   }

   public getKeepMeLoggedInStatus() {
    let isRemembered = JSON.parse(localStorage.getItem('KEEP_ME_LOGGED_IN'));
    return isRemembered;
   }

   public doRemeberMe() {
    let isRemembered = JSON.parse(localStorage.getItem('KEEP_ME_LOGGED_IN'));
    let userCredentials;
    if(isRemembered) {
        userCredentials = localStorage.getItem('USER_INFO');
      }
      return userCredentials;
    }


  public isLoggedIn() {
    let getInfo = localStorage.getItem('USER_INFO');
    let roleId = localStorage.getItem('ID');
   if(getInfo !== null && roleId !== null) {
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

  public getUserAccessible() {
    let roleId = localStorage.getItem('ID');
    let gCode = localStorage.getItem('GCODE');
    let rCode = localStorage.getItem('RCODE');
    let gName = localStorage.getItem('GNAME');
    let rName = localStorage.getItem('RNAME');
    let mappingId = localStorage.getItem('MAPPINGID');
    let mappingName = localStorage.getItem('MAPPINGNAME');

    if (roleId !== undefined && roleId !== '' && gCode !== undefined && gCode !== ''
    && rCode !== undefined && rCode !== '') {
      return {roleId, gCode, rCode, gName, rName, mappingId, mappingName};
    }
  }

  public getServerDate() {
    let serverDate = localStorage.getItem('SERVER_DATE');
    return serverDate;
  }

  public logout() {
    // let isRemembered = JSON.parse(localStorage.getItem('KEEP_ME_LOGGED_IN'));
    // if(!isRemembered) {
    //   localStorage.removeItem('USER_INFO');
    // }
    localStorage.removeItem('USER_INFO');
    localStorage.removeItem('ID');
    localStorage.removeItem('MENU');
    localStorage.removeItem('GCODE');
    localStorage.removeItem('RCODE');
    localStorage.removeItem('GNAME');
    localStorage.removeItem('RNAME');
    localStorage.removeItem('MAPPINGID');
    localStorage.removeItem('MAPPINGNAME');
    localStorage.removeItem('MAPPINGNAME');
    localStorage.removeItem('SERVER_DATE');
    this.isSignedIn = false;
    this.router.navigateByUrl('');
  }
}
