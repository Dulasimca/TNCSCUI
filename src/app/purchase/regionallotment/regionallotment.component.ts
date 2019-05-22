import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-regionallotment',
  templateUrl: './regionallotment.component.html',
  styleUrls: ['./regionallotment.component.css']
})
export class RegionAllotmentComponent implements OnInit {
  canShowMenu: boolean;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.canShowMenu = (this.loginService.canShow()) ? this.loginService.canShow() : false;
  }

}
