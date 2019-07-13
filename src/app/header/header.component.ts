import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Observable, interval } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from '../common/role-based.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isValidUser: boolean;
  username: any;
  godownName: string;
  regionName: string;
  timeString: string;
  duration = 120;
  hours: any;
  minutes: any;
  clockDisplay: string;
  interval: number;
  date: any;
  seconds: any;
  data: any;
  constructor(private roleBasedService: RoleBasedService, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.username = JSON.parse(this.authService.getCredentials());
    this.data = this.roleBasedService.getInstance();
  }
  
  onLogOut() {
   this.authService.logout();
 }

 onViewUserinfo(event, panel) {
   panel.toggle(event);
  this.username = this.username.user;
  this.godownName = this.data.rgData[1].GName;
  this.regionName = this.data.rgData[0].RName;
 }

 onForgetPswd(){
   
 }
}
// function showTime() {
//   let todayDate = new Date();
//   let hours: any = todayDate.getHours();
//   let minutes: any = todayDate.getMinutes();
//   let seconds: any = todayDate.getSeconds();
//   let period = 'AM';

//   if (hours === 0) {
//       hours = 12;
//   }
//   if (hours > 12) {
//       hours = hours - 12;
//       period = 'PM';
//   }
//   hours = (hours < 10) ? "0" + hours : hours;
//   minutes = (minutes < 10) ? "0" + minutes : minutes;
//   seconds = (seconds < 10) ? "0" + seconds : seconds;

//   let timer = hours + ':' + minutes + ':' + seconds + period;
//   document.getElementById('displayTimer').innerText = timer;
//   document.getElementById('displayTimer').innerHTML = timer;

//   setTimeout(showTime, 1000);
// }

