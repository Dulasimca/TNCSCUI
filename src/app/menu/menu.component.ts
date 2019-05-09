import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { MenuService } from './menu.service';
import { AuthService } from '../shared-services/auth.service';


@Component({
  selector: 'app-menu',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  isUser = false;
  username: string;
  password: any;
  isLoggedIn: boolean;

  constructor(private router: Router, private menuService: MenuService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.getValidUser();
    this.menuService.getMenu().subscribe((response: any) => {
      this.items = response.items;
    })
  }

  onLogin() {
    if (this.username !== '' && this.password !== '') {
      this.router.navigate(['login']);
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
