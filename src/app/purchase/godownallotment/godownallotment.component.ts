import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
canShowMenu: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  }

}
