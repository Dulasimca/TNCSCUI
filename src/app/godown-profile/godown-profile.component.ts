import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup, FormBuilder, EmailValidator } from '@angular/forms';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { StatusMessage } from '../constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-godown-profile',
  templateUrl: './godown-profile.component.html',
  styleUrls: ['./godown-profile.component.css']
})
export class GodownProfileComponent implements OnInit {
  username: any;
  userdata: any;
  godownProfileCols: any;
  godownProfileData: any;
  data: any;
  roleId: any;
  g_cd: any;
  gCode: any;
  Gname: any;
  designation: any = [];
  designationOptions: SelectItem[];
  employeeOptions: SelectItem[];
  address1: any;
  address2: any;
  email: EmailValidator;
  telno: any[];
  phone: any;
  fax: any[];
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  blockScreen: boolean;
  formUser: any = [];
  RowId: any;
  InchargeID: any;
  Designation: any;
  loading: boolean = false;
  OnEdit: boolean = false;
  @ViewChild('designation', { static: false }) designationPanel: Dropdown;
  @ViewChild('gname', { static: false }) employeePanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private excelService: ExcelService,
    private tableConstants: TableConstants, private messageService: MessageService, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.gCode = this.authService.getUserAccessible().gCode;
    this.data = this.roleBasedService.getInstance();
    this.userdata = this.fb.group({
      'Gname': new FormControl(''),
      'Designation': new FormControl(''),
      'address1': new FormControl(''),
      'address2': new FormControl(''),
      'email': new FormControl(''),
      'telno': new FormControl(''),
      'mobno': new FormControl(''),
      'faxno': new FormControl('')
      // 'telno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      // 'mobno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      // 'faxno': new FormControl('', Validators.compose([Validators.required]))
    });
    const params = new HttpParams().append('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.GODOWN_PROFILE_GET, params).subscribe(value => {
      if (value !== undefined) {
        this.godownProfileCols = this.tableConstants.godownProfile;
        this.godownProfileData = value;
        let sno = 0;
        this.godownProfileData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onSelect(item, type) {
    let designationSelection = [];
    let employeeSelection = [];
    switch (item) {
      case 'emp':
        if (type === 'tab') {
          this.employeePanel.overlayVisible = true;
        }
        const params = {
          'GCode': this.gCode,
          'Type': 1
        };
        this.restAPIService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(s => {
              employeeSelection.push({ label: s.EmpName, value: s.Empno });
            });
          }
          this.employeeOptions = employeeSelection;
          this.employeeOptions.unshift({ label: '-select-', value: null });
        });
        break;
      case 'd':
        if (type === 'tab') {
          this.designationPanel.overlayVisible = true;
        }
        this.restAPIService.get(PathConstants.DESIGNATION_MASTER).subscribe(res => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(s => {
              designationSelection.push({ label: s.DESGN, value: s.DESGNCOD });
            });
          }
          this.designationOptions = designationSelection;
          this.designationOptions.unshift({ label: '-select-', value: null });
        });
        break;
    }
  }

  onRowSelect(event, selectedRow) {
    this.OnEdit = true;
    this.RowId = selectedRow.RowId;
    this.designationOptions = [{ label: selectedRow.DesignationName, value: selectedRow.DesignationCode }];
    this.employeeOptions = [{ label: selectedRow.EmpName, value: selectedRow.InchargeCode }];
    this.InchargeID = selectedRow.EmpName;
    this.Gname = selectedRow.InchargeCode;
    this.designation = selectedRow.DesignationName;
    this.Designation = selectedRow.DesignationCode;
    this.address1 = selectedRow.Address1;
    this.address2 = selectedRow.DistrictAddress;
    this.email = selectedRow.MailID;
    this.telno = selectedRow.TELNO;
    this.phone = selectedRow.MOBNO;
    this.fax = selectedRow.FAXNO;
  }

  onSubmit(formUser) {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'RowId': this.RowId || '',
      'GodownCode': this.gCode,
      'Gname': this.Gname,
      'desig': this.Designation,
      'add1': this.address1,
      'add2': this.address2,
      'add3': this.email,
      'telno': this.telno,
      'mobno': this.phone,
      'faxno': this.fax,
    };
    this.restAPIService.post(PathConstants.GODOWN_PROFILE_POST, params).subscribe(res => {
      if (res) {
        this.onView();
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
    this.onClear();
  }

  onView() {
    const params = new HttpParams().append('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.GODOWN_PROFILE_GET, params).subscribe(value => {
      if (value !== undefined) {
        // this.godownProfileCols = this.tableConstants.godownProfile;
        this.godownProfileData = value;
        let sno = 0;
        this.godownProfileData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onAdd() {
    this.OnEdit = true;
  }

  onClear() {
    this.formUser = this.Gname = this.Designation = this.RowId = this.address1 = this.address2 = this.email = undefined;
    this.designationOptions = this.employeeOptions = this.telno = this.phone = this.fax = this.InchargeID = this.designation = undefined;
  }
}
