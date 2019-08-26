import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  employeeName: any;
  employeeUser: any;
  EmployeeData: any;
  EmployeeCols: any;
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  selectedRow: any;
  data?: any;
  rCode: any;
  gCode: any;
  roleId: any;
  designationOptions: SelectItem[];
  d_cd: any;
  desig: any = [];
  designationSelection: any[] = [];
  formUser = [];
  EmpName: any;
  Empno: any;
  Designation: any;
  JRType: Boolean;
  JRDate: Date;
  Refno: any;
  RefDate: Date;
  Join: any;
  Relieve: any;
  userdata: any;
  maxDate: Date;
  viewPane: boolean;
  isViewed: boolean = false;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.rCode = this.authService.getUserAccessible().rCode;
    this.gCode = this.authService.getUserAccessible().gCode;
    this.roleId = this.authService.getUserAccessible().roleId;
    this.userdata = this.fb.group({
      'EmpName': new FormControl(''),
      'Designation': new FormControl(''),
      'Empno': new FormControl(''),
      'JRType': new FormControl(''),
      'JRDate': new FormControl(''),
      'Refno': new FormControl(''),
      'RefDate': new FormControl('')
      // 'telno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      // 'mobno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      // 'faxno': new FormControl('', Validators.compose([Validators.required]))
    });
    const params = {
      'Gcode': this.gCode,
      'Rcode': this.rCode,
      'Roleid': this.roleId
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined) {
        this.EmployeeCols = this.tableConstant.EmployeeMaster;
        this.EmployeeData = res;
      }
    });
  }

  onView() {
    const params = {
      'Gcode': this.gCode,
      'Rcode': this.rCode,
      'Roleid': this.roleId
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined) {
        this.EmployeeCols = this.tableConstant.EmployeeMaster;
        this.EmployeeData = res;
      }
    });
  }

  onClear() {
    this.formUser = [];
    this.Join = this.Relieve = false;
  }

  onRowSelect(formUser) {
    this.disableOkButton = false;
    this.selectedRow = formUser.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    // this.commodityOptions = [{ 'label': this.selectedRow.ITDescription, 'value': this.selectedRow.CommodityCode }];
    // this.c_cd = this.selectedRow.ITDescription;
    // this.commodityCd = this.selectedRow.CommodityCode;
    this.Empno = this.selectedRow.Empno;
    this.EmpName = this.selectedRow.EmpName;
    this.Designation = this.selectedRow.Designation;
    this.Refno = this.selectedRow.Refno;
  }

  onDesignation() {
    let designationSelection = [];
    this.restApiService.get(PathConstants.DESIGNATION_MASTER).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(s => {
          designationSelection.push({ 'label': s.DESIGNATIONNAME, 'value': s.DESGINATIONCODE });
        });
        this.designationOptions = designationSelection;
        this.designationOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
      }
    });
  }

  // onChange(e) {
  //   if (this.designationOptions !== undefined) {
  //     const selectedItem = e.value;
  //     if (selectedItem !== null) {
  //       this.EmployeeData = this.EmployeeData.filter(x => { return x.ITDescription === selectedItem.label });
  //       if (this.EmployeeData.length === 0) {
  //         this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
  //       }
  //     } else {
  //       this.EmployeeData = this.desig;
  //     }
  //   }
  // }

  onCommodityClicked() {
    if (this.designationOptions !== undefined && this.designationOptions.length <= 1) {
      this.designationOptions = this.designationSelection;
    }
  }

  onSubmit(formUser) {
    const params = {
      'Gcode': this.gCode,
      'Roleid': this.roleId,
      'Empno': formUser.Empno,
      'Empname': formUser.EmpName,
      'Designation': this.d_cd.value,
      // 'Jrtype': (this.Join === true) ? 'J' : 'R',
      'Jrtype': (this.Join || this.Relieve),
      'Jrdate': this.datepipe.transform(formUser.JRDate, 'MM/dd/yyyy'),
      'Refno': formUser.Refno,
      'Refdate': this.datepipe.transform(formUser.RefDate, 'MM/dd/yyyy'),
      'RCode': this.rCode
    };
    this.restApiService.post(PathConstants.EMPLOYEE_MASTER_POST, params).subscribe(value => {
      if (value) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    this.onClear();
  }
}