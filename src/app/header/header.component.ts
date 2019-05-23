import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable, interval } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared-services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isValidUser: boolean;
  loggedUsername: string;
  timeString: string;
  duration = 120;
  hours: any;
  minutes: any;
  clockDisplay: string;
  interval: number;
  date: any;
  constructor(private loginService: LoginService, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit() {
    let secPerMin = 60;
    let oneMinToMilliSec = 60000;
    this.hours = new Date().getHours();
    this.minutes = new Date().getMinutes();
    this.clockDisplay = this.hours + ':' + this.minutes;
    if (this.duration > 0) {
      setInterval(() => {
      this.duration = this.duration - 1;
        if (this.duration <= 0) {
          clearInterval(this.interval)
        }
        // if (this.duration % 60 >= 0) {
        //   this.minutes = (this.duration % 60 < 10) ? ("0" + this.duration % 60) : (this.duration % 60).toString();
        // } else {
        //    this.authService.logout();
        // }

        // if (this.duration / 60 < 10) {
        //   this.hours = "0" + parseInt("" + this.duration / 60, 10);
        // } else {
        //   this.hours = "" + parseInt((this.duration / 60).toString(), 10);
        // }
        this.clockDisplay = new Date().getHours() + " : " + new Date().getMinutes();
      }, oneMinToMilliSec);
    }
    const currentDate = new Date();
    this.date = this.datePipe.transform(currentDate, 'dd-MM-yyyy');
    this.isValidUser = (this.loginService.getUsername() !== undefined && this.loginService.getUsername() !== '') ? true : false;
    this.loggedUsername = this.loginService.getUsername();
  }
}
