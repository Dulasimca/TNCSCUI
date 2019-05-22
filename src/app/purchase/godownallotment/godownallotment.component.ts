import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
canShowMenu: boolean;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.canShowMenu = (this.loginService.canShow()) ? this.loginService.canShow() : false;
  }

}
