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
  seconds: any;
  constructor(private loginService: LoginService, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit() {
    showTime();
    const currentDate = new Date();
    this.date = this.datePipe.transform(currentDate, 'dd-MM-yyyy');
    this.isValidUser = (this.loginService.getUsername() !== undefined && this.loginService.getUsername() !== '') ? true : false;
    this.loggedUsername = this.loginService.getUsername();
  }
  
  onLogOut() {
   this.authService.logout();
 }
}
function showTime() {
  let todayDate = new Date();
  let hours: any = todayDate.getHours();
  let minutes: any = todayDate.getMinutes();
  let seconds: any = todayDate.getSeconds();
  let period = 'AM';

  if (hours === 0) {
      hours = 12;
  }
  if (hours > 12) {
      hours = hours - 12;
      period = 'PM';
  }
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  let timer = hours + ':' + minutes + ':' + seconds + period;
  document.getElementById('displayTimer').innerText = timer;
  document.getElementById('displayTimer').innerHTML = timer;

  setTimeout(showTime, 1000);
}
