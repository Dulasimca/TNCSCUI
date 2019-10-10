import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

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
  roleId: any;
  fromDate: any;
  toDate: any;
  designationOptions: SelectItem[];
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  regions: any;
  d_cd: any;
  desig: any = [];
  RCode: any;
  GCode: any;
  designationSelection: any[] = [];
  formUser = [];
  Empname: any;
  Empno: any;
  Designation: any;
  DesigCode: any;
  Jrtype: Boolean;
  Jrdate: Date;
  Refno: any;
  Refdate: Date;
  Join: any;
  Relieve: any;
  userdata: any;
  maxDate: Date;
  loggedInRCode: any;
  viewPane: boolean;
  isViewed: boolean = false;
  GName: any;
  RName: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('designation') designationPanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.GName = this.authService.getUserAccessible().gName;
    this.RName = this.authService.getUserAccessible().rName;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
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
    // const params = {
    //   'Gcode': this.gCode,
    //   'Rcode': this.rCode,
    //   'Roleid': this.roleId
    // };
    // this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
    //   if (res !== undefined) {
    //     this.EmployeeCols = this.tableConstant.EmployeeMaster;
    //     this.EmployeeData = res;
    //     this.EmployeeData.forEach(s => {
    //       s.Jrdate = this.datepipe.transform(s.Jrdate, 'dd/MM/yyyy');
    //       s.Refdate = this.datepipe.transform(s.Refdate, 'dd/MM/yyyy');
    //     });
    //   }
    // });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let designationSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'd':
        if (type === 'enter') {
          this.designationPanel.overlayVisible = true;
        }
        this.restApiService.get(PathConstants.DESIGNATION_MASTER).subscribe(res => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(s => {
              designationSelection.push({ 'label': s.DESIGNATIONNAME, 'value': s.DESGINATIONCODE });
            });
          }
          this.designationOptions = designationSelection;
          this.designationOptions.unshift({label: '-select-', value: null });
        });
        break;
    }
  }

  onView() {
    const params = {
      'GCode': this.GCode,
      'RCode': this.RCode,
      'roleId': this.roleId
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.EmployeeCols = this.tableConstant.EmployeeMaster;
        this.EmployeeData = res;
        let sno = 0;
        this.EmployeeData.forEach(s => {
          s.Jrdate = this.datepipe.transform(s.Jrdate, 'dd/MM/yyyy');
          s.Refdate = this.datepipe.transform(s.Refdate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onClear() {
    this.formUser = [];
    this.Join = this.Relieve = false;
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    this.designationOptions = [{ label: this.selectedRow.DesignationName, value: this.selectedRow.Designation }];
    this.Empno = this.selectedRow.Empno;
    this.Empname = this.selectedRow.Empname;
    // this.DesigCode = this.selectedRow.Designation;
    this.Designation = this.selectedRow.DesignationName;
    this.Refno = this.selectedRow.Refno;
    this.Refdate = this.selectedRow.Refdate;
    this.Jrdate = this.selectedRow.Jrdate;
    this.Jrtype = this.selectedRow.Jrtype;
  }

  // onDesignation() {
  //   this.restApiService.get(PathConstants.DESIGNATION_MASTER).subscribe(res => {
  //     if (res !== undefined && res !== null && res.length !== 0) {
  //       res.forEach(s => {
  //         this.designationSelection.push({ 'label': s.DESIGNATIONNAME, 'value': s.DESGINATIONCODE });
  //       });
  //     }
  //     this.designationOptions = this.designationSelection;
  //   });
  //   this.designationOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
  // }

  onCommodityClicked() {
    if (this.designationOptions !== undefined && this.designationOptions.length <= 1) {
      this.designationOptions = this.designationSelection;
    }
  }

  onDateSelect() {
    this.checkValidDateSelection();
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onSubmit(formUser) {
    const params = {
      'GCode': this.GCode,
      'Roleid': this.roleId,
      'Empno': this.Empno,
      'Empname': this.Empname,
      'Designation': this.Designation.value,
      // 'Jrtype': (this.Join === true) ? 'J' : 'R',
      // 'Jrtype': (this.Join || this.Relieve),
      'Jrtype': this.Jrtype,
      'Refdate': this.Refdate,
      'Jrdate': this.Jrdate,
      'Refno': this.Refno,
      'RCode': this.RCode
    };
    this.restApiService.post(PathConstants.EMPLOYEE_MASTER_POST, params).subscribe(value => {
      if (value) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    this.onClear();
  }
}