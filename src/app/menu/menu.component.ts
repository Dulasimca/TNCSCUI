import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/primeng';
import { MenuService } from './menu.service';


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
  isViewLogin = false;
  @Input() LoggedIn: boolean;

  constructor(private router: Router, private menuService: MenuService) { }

  ngOnInit() {
    this.isLoggedIn = false;
    this.menuService.getMenu().subscribe((response: any) => {
      this.items = response.items;
    })
  }

  onLoggedIn(event) {
    this.isLoggedIn = event;
  }

  onLogin() {
    this.isViewLogin = true;
    if (this.username !== '' && this.password !== '') {
      this.isLoggedIn = true;
      this.router.navigate(['login']);
    }
  }

  onLogout() {
    this.router.navigate(['login']);
    this.isViewLogin = true;
  }
}
