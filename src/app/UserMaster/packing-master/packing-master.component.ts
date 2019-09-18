import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-packing-master',
  templateUrl: './packing-master.component.html',
  styleUrls: ['./packing-master.component.css']
})
export class PackingMasterComponent implements OnInit {
  canShowMenu: boolean;
  data: any;
  selectedValue: string[];

  constructor(private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
  }

}
