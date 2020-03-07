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
import { Toast } from 'primeng/toast';

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
  GodownEmployeeData: any;
  GodownEmployeeCols: any;
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
  Jrtype: any;
  Jrdate: Date;
  Rdate: Date;
  Refno: any;
  Refdate: Date;
  releiv: any;
  Ref: any;
  join: any;
  Join: boolean;
  Relieve: boolean;
  Regular: any;
  userdata: any;
  maxDate: Date;
  loggedInRCode: any;
  viewPane: boolean;
  isViewed: boolean = false;
  loading: boolean = false;
  OnEdit: boolean = false;
  GName: any;
  RName: any;
  RowID: any;
  ECode: any;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('designation', { static: false }) designationPanel: Dropdown;

  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

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
    const params = {
      'GCode': this.GCode,
      'Type': 1
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.GodownEmployeeData = res;
        this.GodownEmployeeCols = this.tableConstant.GodownEmployeeCols;
        let sno = 0;
        this.GodownEmployeeData.forEach(s => {
          s.RefDate = this.datepipe.transform(s.RefDate, 'MM/dd/yyyy');
          s.JRDate = this.datepipe.transform(s.JRDate, 'MM/dd/yyyy');
          s.RDate = this.datepipe.transform(s.RDate, 'MM/dd/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let designationSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'tab') {
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
        if (type === 'tab') {
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

  onLoad() {
    const params = {
      'GCode': this.GCode,
      'Type': 1
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.GodownEmployeeData = res;
        this.GodownEmployeeCols = this.tableConstant.GodownEmployeeCols;
        let sno = 0;
        this.GodownEmployeeData.forEach(s => {
          s.RefDate = this.datepipe.transform(s.RefDate, 'MM/dd/yyyy');
          s.JRDate = this.datepipe.transform(s.JRDate, 'MM/dd/yyyy');
          s.RDate = this.datepipe.transform(s.RDate, 'MM/dd/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onView() {
    const params = {
      'Empno': this.Empno,
      'Regular': this.Regular,
      'roleId': 3
    };
    this.restApiService.getByParameters(PathConstants.EMPLOYEE_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.EmployeeCols = this.tableConstant.EmployeeMaster;
        this.EmployeeData = res;
        let sno = 0;
        this.EmployeeData.forEach(s => {
          s.Empno = this.Empno;
          s.DOB = this.datepipe.transform(s.DOB, 'MM/dd/yyyy');
          s.RefDate = this.datepipe.transform(s.RefDate, 'MM/dd/yyyy');
          s.JRDate = this.datepipe.transform(s.JRDate, 'MM/dd/yyyy');
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
    this.Regular = this.Rdate = this.releiv = this.ECode = this.join = this.Ref = this.Designation = undefined;
    this.designationOptions = undefined;
    this.Join = this.Relieve = false;
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.OnEdit = true;
    this.viewPane = false;
    this.isViewed = true;
    this.Empno = this.selectedRow.Empno;
    this.Empname = this.selectedRow.Empname;
    this.designationOptions = [{ label: this.selectedRow.DesignationName, value: this.selectedRow.DesignationCode }];
    this.Designation = this.selectedRow.DesignationName;
    this.DesignationCode = this.selectedRow.DesignationCode;
  }

  onRow(event, selectedRow) {
    // var Ref: any = [];
    // var join: any = [];
    // var releiv: any = [];
    this.OnEdit = true;
    this.viewPane = false;
    this.isViewed = true;
    this.Empno = selectedRow.Empno;
    this.Empname = selectedRow.EmpName;
    this.Refno = selectedRow.RefNo;
    this.Refdate = selectedRow.RefDate;
    this.Jrdate = selectedRow.JRDate;
    this.Rdate = selectedRow.RDate;
    // this.Ref = this.datepipe.transform(selectedRow.RefDate, 'MM/dd/yyyy');
    // this.Refdate = this.Ref;
    // this.join = this.datepipe.transform(selectedRow.RefDate, 'MM/dd/yyyy');
    // this.Jrdate = this.join;
    // this.releiv = this.datepipe.transform(selectedRow.RefDate, 'MM/dd/yyyy');
    // this.Rdate = this.releiv;
    this.Jrtype = selectedRow.JRTYPE;
    this.designationOptions = [{ label: selectedRow.DesignationName, value: selectedRow.Designation }];
    this.Designation = selectedRow.DesignationName;
    this.DesignationCode = selectedRow.Designation;
    this.RowID = selectedRow.RowID;
    this.ECode = selectedRow.Empno;
    (this.Jrtype === "J") ? (this.Relieve = false, this.Join = true) : (this.Relieve = true, this.Join = false)
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
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID,
          life: 5000, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onRelieve() {
    if (this.Jrtype === "R") {
      this.Relieve = true;
      this.Join = false;
    } else {
      this.Relieve = false;
      this.Join = true;
    }
  }

  onSubmit(formUser) {
    const params = {
      'RowID': this.RowID || '',
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Roleid': this.roleId,
      'Empno': (this.ECode === undefined && this.Regular === 'L') ? 'L' + this.Empno : this.Empno,
      'Empname': this.Empname,
      'Designation': this.Designation.value || this.DesignationCode,
      'Jrtype': this.Jrtype,
      'Rdate': this.datepipe.transform(this.Rdate, 'MM/dd/yyyy'),
      'Refdate': this.datepipe.transform(this.Refdate, 'MM/dd/yyyy'),
      'Jrdate': this.datepipe.transform(this.Jrdate, 'MM/dd/yyyy'),
      'Refno': this.Refno,
      'ExportFlag': '1'
    };
    this.restApiService.post(PathConstants.EMPLOYEE_MASTER_POST, params).subscribe(value => {
      if (value) {
        this.onLoad();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });

      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
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

  onClose() {
    this.messageService.clear('t-err');
  }
}