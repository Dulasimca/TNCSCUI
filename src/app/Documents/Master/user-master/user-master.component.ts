import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
  username: any;
  userdata: any;
  canShowMenu: boolean;
  formUser = [];
  roleId: any;
  roleIdOptions: SelectItem[];
  godownCode: any;
  godownOptions: SelectItem[];
  regionCode: any;
  regionOptions: SelectItem[];
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('role') rolePanel: Dropdown;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  //   this.user_data = new FormGroup({
  //  });

  }

  onSelect(type, id) {
    switch (id) {
      case 'gd':
        if(type === 'enter') {
        this.godownPanel.overlayVisible = true;
        }
        break;
      case 'reg':
          if(type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
        break;
      case 'role':
          if(type === 'enter') {
            this.rolePanel.overlayVisible = true;
          }
        break;
    }
  }

  onSubmit(form) {
    console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
  }
}
