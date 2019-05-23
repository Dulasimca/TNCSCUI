import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared-services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
showMenu: boolean;
  constructor(private httpClient: HttpClient) {
  }

  getMenu() {
   return this.httpClient.get('..//assets/menu.json');
  }

}
