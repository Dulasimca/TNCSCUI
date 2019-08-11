import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-godown-profile',
  templateUrl: './godown-profile.component.html',
  styleUrls: ['./godown-profile.component.css']
})
export class GodownProfileComponent implements OnInit  {
  username: any;
  userdata: any;
  data: any;
  roleId: any;
  g_cd: any;
  gCode: any;
  Gname: any;
  designation: [];
  address1: any;
  address2: any;
  address3: any;
  telno: any;
  phone: any;
  fax: any;
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  formUser = [];

  constructor(private authService: AuthService, private excelService: ExcelService, private tableConstants: TableConstants, private messageService: MessageService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.userdata = new FormGroup({
   });

  }

  onSelect() {
    let godownSelection = [];
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
      }

  onClear() {

  }

  onSubmit(formUser) {

    // console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
    const params = {
      'RowId': this.roleId,
      'GodownCode': (this.gCode !== undefined && this.gCode !== null) ? this.gCode : this.gCode,
      'Gname': formUser.Gname,
      'desig': formUser.designation,
      'add1': formUser.address1,
      'add2': formUser.address2,
      'add3': formUser.address3,
      'telno': formUser.telno,
      'mobno': formUser.phone,
      'faxno': formUser.fax,
    };
    this.restAPIService.post(PathConstants.GODOWN_PROFILE, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }
}
