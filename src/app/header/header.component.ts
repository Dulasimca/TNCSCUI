import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import {  Observable } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isValidUser: boolean;
  loggedUsername: string;
  countDown;
  timer = 1800;
  tick = 1000;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    // this.countDown = Observable.timer(0, this.tick)
    //   .take(this.timer)
    //   .map(() => --this.timer
    //   )
    this.isValidUser = (this.loginService.getUsername() !== undefined && this.loginService.getUsername() !== '') ? true : false;
    this.loggedUsername = this.loginService.getUsername();
  }
  
  
}
@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
  }

}