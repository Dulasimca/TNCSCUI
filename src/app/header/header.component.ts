import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isValidUser: boolean;
  loggedUsername: string;
  timer: any;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.isValidUser = (this.loginService.getUsername() !== undefined && this.loginService.getUsername() !== '') ? true : false;
    this.loggedUsername = this.loginService.getUsername();
  }

}
