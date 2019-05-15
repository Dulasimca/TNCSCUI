import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
roleID: number;
  constructor() {
  }
setValue(value) {
    this.roleID = value;
}

getValue(){
    return this.roleID;
}
}
