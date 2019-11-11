import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
roleID: number;
mappingID: number;
showMenu: boolean;
userName: any;
  constructor() {
  }
setValue(value) {
    this.roleID = value;
}

getValue(){
    return this.roleID;
}

setMappingID(id) {
  this.mappingID = id;
}

getMappingID(){
  return this.mappingID;
}

setUsername(username) {
  this.userName = username;
}

getUsername(){
  return this.userName;
}
}
