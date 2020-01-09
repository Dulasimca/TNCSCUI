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
  selector: 'app-godown-employee-details',
  templateUrl: './godown-employee-details.component.html',
  styleUrls: ['./godown-employee-details.component.css']
})
export class GodownEmployeeDetailsComponent implements OnInit {
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
  DesignationCode: any;
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
  loading: boolean = false;
  OnEdit: boolean = false;
  GName: any;
  RName: any;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('designation') designationPanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.GName = this.authService.getUserAccessible().gName;
    this.RName = this.authService.getUserAccessible().rName;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.userdata = this.fb.group({
      'EmpName': new FormControl(''),
      'Designation': new FormControl(''),
      'Empno': new FormControl(''),
      'JRType': new FormControl(''),
      'JRDate': new FormControl(''),
      'Refno': new FormControl(''),
      'RefDate': new FormControl('')
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
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
            this.regionOptions.unshift({ label: 'All', value: null });
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
      case 'd':
        if (type === 'enter') {
          this.designationPanel.overlayVisible = true;
        }
        this.restApiService.get(PathConstants.DESIGNATION_MASTER).subscribe(res => {
          if (res !== undefined && res !== null && res.length !== 0) {
            res.forEach(s => {
              designationSelection.push({ 'label': s.DESGN, 'value': s.DESGNCOD });
            });
          }
          this.designationOptions = designationSelection;
          this.designationOptions.unshift({ label: '-select-', value: null });
        });
        break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      'Empno': this.Empno,
      'RCode': this.RCode,
      'roleId': this.roleId
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.EmployeeData = res;
        this.OnEdit = true;
        this.designationOptions = [{ label: res[0].DesignationName, value: res[0].DesignationCode }];
        this.Empno = res[0].Empno;
        this.Empname = res[0].Empname;
        this.Designation = res[0].DesignationName;
        this.DesignationCode = res[0].DesignationCode;
        this.Refno = res[0].RefNo;
        res[0].RefDate = this.datepipe.transform(res[0].RefDate, 'MM/dd/yyyy');
        res[0].JRDate = this.datepipe.transform(res[0].JRDate, 'MM/dd/yyyy');
        this.Refdate = res[0].RefDate;
        this.Jrdate = res[0].JRDate;
        this.Jrtype = res[0].JRTYPE;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }


  onAdd() {
    // this.OnEdit = true;
    const params = {
      'Empno': this.Empno,
      'RCode': 'All',
      'roleId': '1'
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.EmployeeCols = this.tableConstant.EmployeeMaster;
        this.EmployeeData = res;
        let sno = 0;
        this.EmployeeData.forEach(s => {
          s.Empno = this.Empno;
          s.DOB = this.datepipe.transform(s.DOB, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onClear() {
    this.Empname = this.Empno = this.Jrdate = this.Refdate = this.Refno = this.Jrtype = undefined;
    this.designationOptions = undefined;
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.OnEdit = true;
    this.viewPane = false;
    this.isViewed = true;
    this.designationOptions = [{ label: this.selectedRow.DesignationName, value: this.selectedRow.DesignationCode }];
    this.Empno = this.selectedRow.Empno;
    this.Empname = this.selectedRow.Empname;
    this.Designation = this.selectedRow.DesignationName;
    this.DesignationCode = this.selectedRow.DesignationCode;
    // this.Refno = this.selectedRow.Refno;
    // this.Refdate = this.selectedRow.Refdate;
    // this.Jrdate = this.selectedRow.Jrdate;
    // this.Jrtype = this.selectedRow.Jrtype;
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
      'RCode': this.RCode,
      'Roleid': this.roleId,
      'Empno': this.Empno,
      'Empname': this.Empname,
      'Designation': this.DesignationCode,
      'Jrtype': this.Jrtype,
      'Refdate': this.Refdate,
      'Jrdate': this.Jrdate,
      'Refno': this.Refno,
      'ExportFlag': '1'
    };
    this.restApiService.post(PathConstants.EMPLOYEE_MASTER_POST, params).subscribe(value => {
      if (value) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });

      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }
      , (err: HttpErrorResponse) => {
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
}