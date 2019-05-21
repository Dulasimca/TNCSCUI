import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable, interval } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared-services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isValidUser: boolean;
  loggedUsername: string;
  timeString: string;
  duration = 60;
  seconds = "--";
  minutes = "--";
  clockDisplay: string;
  interval: number;
  constructor(private loginService: LoginService, private authService: AuthService) { }

  ngOnInit() {
    // if (this.duration > 0) {
    //   setInterval(() => {
    //   this.duration = this.duration - 1;
    //     if (this.duration <= 0) {
    //       clearInterval(this.interval)
    //     }

    //     if (this.duration % 60 >= 0) {
    //       this.seconds = (this.duration % 60 < 10) ? ("0" + this.duration % 60) : (this.duration % 60).toString();
    //     } else {
    //       // this.authService.logout();
    //     }

    //     if (this.duration / 60 < 10) {
    //       this.minutes = "0" + parseInt("" + this.duration / 60, 10);
    //     } else {
    //       this.minutes = "" + parseInt((this.duration / 60).toString(), 10);
    //     }
    //     this.clockDisplay = this.minutes + " : " + this.seconds;
    //   }, 1000);
    // }
    this.isValidUser = (this.loginService.getUsername() !== undefined && this.loginService.getUsername() !== '') ? true : false;
    this.loggedUsername = this.loginService.getUsername();
  }
}
