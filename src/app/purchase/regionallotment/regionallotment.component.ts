import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-regionallotment',
  templateUrl: './regionallotment.component.html',
  styleUrls: ['./regionallotment.component.css']
})
export class RegionAllotmentComponent implements OnInit {
  canShowMenu: boolean;
  regionName: any;
  orderNumberOptions: any[];
  orderNumber: any;
  regionNameOptions: any[];
  quantity: any;
  remarks: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    
  }

}
