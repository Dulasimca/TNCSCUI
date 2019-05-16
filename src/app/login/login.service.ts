import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
roleID: number;
showMenu: boolean;
  constructor() {
  }
setValue(value) {
    this.roleID = value;
}

getValue(){
    return this.roleID;
}

isValid(value){
  this.showMenu = value;
}
canShow() {
  return this.showMenu;
}
}
