import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-society-master-new',
  templateUrl: './society-master-new.component.html',
  styleUrls: ['./society-master-new.component.css']
})
export class SocietyMasterNewComponent implements OnInit {
  SocietyMasterEntryCols: any;
  SocietyMasterEntryData: any;
  data?: any;
  typeOptions: SelectItem[];
  SocietyOptions: SelectItem[];
  gCode: any;
  t_cd: any;
  s_cd: any;
  Name: any;
  SlNo: any;
  SocietyCode: any;
  trCode: any;
  Trcode: any;
  rCode: any;
  SocietyData = [];
  SocietyType: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  loading: boolean;
  viewPane: boolean = false;
  OnEdit: boolean = false;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterEntryCols = this.tableConstants.SocietyMasterEntry;
    this.data = this.roleBasedService.getInstance();
    this.gCode = this.authService.getUserAccessible().gCode;
    this.rCode = this.authService.getUserAccessible().rCode;
  }

  ontype() {
    let TypeSelection = [];
    if (this.typeOptions === undefined) {
      const params = new HttpParams().set('GCode', this.gCode);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_NEW_ENTRY_GET, params).subscribe(res => {
        if (res !== undefined) {
          this.typeOptions = TypeSelection;
          this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true },
            { 'label': 'All', 'value': 'All' },
            { 'label': 'CRS', 'value': 'TY004' },
            { 'label': 'COOPERATIVES LEADING', 'value': 'TY002' },
            { 'label': 'COOPERATIVES PRIMARY', 'value': 'TY003' });
        }
      });
    }
  }

  onView() {
    this.loading = true;
    this.SocietyMasterEntryCols = this.tableConstants.SocietyMasterNewEntry;
    const params = new HttpParams().set('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_NEW_ENTRY_GET, params).subscribe(res => {
      this.SocietyMasterEntryData = res;
      if (this.SocietyMasterEntryData !== undefined && this.SocietyMasterEntryData !== 0) {
        if (this.t_cd.value !== 'All') {
          this.SocietyMasterEntryData = res.filter((value: { Tyname: any; }) => { return value.Tyname === this.t_cd.label });
        }
        let sno = 0;
        this.SocietyMasterEntryData.forEach(data => {
          sno += 1;
          data.Sno = sno;
        });
        this.loading = false;
      }
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please contact administrator' });
      }
    });
  }

  onRowSelect(event, selectedRow) {
    this.OnEdit = true;
    this.viewPane = false;
    this.typeOptions = [{ label: selectedRow.Tyname, value: selectedRow.SocietyType }];
    this.SlNo = selectedRow.SlNo;
    this.SocietyCode = selectedRow.SocietyCode;
    this.SocietyType = selectedRow.SocietyType;
    this.t_cd = selectedRow.Tyname;
    this.Name = selectedRow.Societyname;
  }

  onSave() {
    const params = {
      'SlNo': this.SlNo || '',
      'gowdoncode': this.gCode,
      'SocietyCode': this.SocietyCode || '',
      'RCode': this.rCode,
      'SocietyName': this.Name,
      'SocietyType': this.t_cd.value || this.SocietyType,
      'eflag': 'N'
    };
    this.restAPIService.post(PathConstants.SOCIETY_MASTER_NEW_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.onView();
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Updated Successfully!' });
        const params = new HttpParams().set('GCode', this.gCode);
        this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_NEW_ENTRY_GET, params).subscribe(res => {
          this.SocietyMasterEntryData = res;
          let sno = 0;
          this.SocietyMasterEntryData.forEach(data => {
            sno += 1;
            data.SlNo = sno;
          });
        });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
  }

  onClear() {
    this.SlNo = this.SocietyCode = undefined;
  }
}