import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient) {
  }

  getMenu() {
   return this.httpClient.get('..//assets/menu.json');
  }
}
