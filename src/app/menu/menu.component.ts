import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenuService } from './menu.service';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { LoginService } from '../login/login.service';


@Component({
  selector: 'app-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items?: MenuItem[];
  isUser = false;
  roleId: any;
  username: string;
  password: any;
  isLoggedIn: boolean;
  canShowMenu: boolean;

  constructor(private router: Router, private menuService: MenuService,
    private restApiService: RestAPIService, private authService: AuthService, private loginService: LoginService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.roleId = this.loginService.getValue();
    let roleId = new HttpParams().append('roleId', this.roleId);
      this.restApiService.getByParameters(PathConstants.MENU, roleId).subscribe((res: any[]) => {
        if (res !== undefined) {
          this.items = res;
          this.items.forEach(x => {
            let list: any = x.items;
            if (x.items.length === 0) {
              return delete (x.items);
            } else {
              list.forEach(y => {
                let nestedList: any = y.items;
                if(y.items.length === 0) {
                 return delete (y.items);
                } else {
                  nestedList.forEach(z => {
                    let deepNestedList: any = z.items;
                    if(z.items.length === 0) {
                     return delete (z.items);
                    }
                  });
                }
              });
            }
          });
        }
      });
  }

  onLogout() {
    this.authService.logout();
  }
}

