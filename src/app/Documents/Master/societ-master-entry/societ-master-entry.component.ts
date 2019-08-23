import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-societ-master-entry',
  templateUrl: './societ-master-entry.component.html',
  styleUrls: ['./societ-master-entry.component.css']
})
export class SocietMasterEntryComponent implements OnInit {
  SocietyMasterEntryCols: any;
  SocietyMasterEntryData: any;
  data?: any;
  typeOptions: SelectItem[];
  societyOptions: SelectItem[];
  IssuerOptions: SelectItem[];
  gCode: any;
  s_cd: any;
  t_cd: any;
  Iss_cd: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterEntryCols = this.tableConstants.SocietyMasterEntry;
    this.data = this.roleBasedService.getInstance();
    this.gCode = this.authService.getUserAccessible().gCode;

  }
  ontype() {
    let TypeSelection = [];
    if (this.typeOptions === undefined) {
      const params = new HttpParams().set('GCode', this.gCode);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
        if (res !== undefined) {
          this.typeOptions = TypeSelection;
          this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COOPERATIVES LEADING', 'value': this.typeOptions }, { 'label': 'COOPERATIVES PRIMARY', 'value': this.typeOptions });
        }
      });
    }
  }
  onSo() {
    let SocietySelection = [];
    if (this.societyOptions === undefined) {
      const params = new HttpParams().set('GCode', this.gCode);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
        if (res !== undefined) {
          res.forEach(x => {
            SocietySelection.push({ 'label': x.Societyname, 'value': x.Societyname });
            this.societyOptions = SocietySelection;
          });
        }
      });
    }
  }
  onIss(){
  let IssuerSelection = [];
  if (this.IssuerOptions === undefined) {
    const params = new HttpParams().set('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined) {
        res.forEach(x => {
          IssuerSelection.push({ 'label': x.Issuername, 'value': x.Issuername });
          this.IssuerOptions = IssuerSelection;
        });
      }
    });
  }
}

  // onSelect(item) {
  //   let TypeSelection = [];
  //   let SocietySelection = [];
  //   let IssuerSelection = [];
  //   switch (item) {
  //     case 't':
  //       if (this.typeOptions === undefined) {
  //         const params = new HttpParams().set('GCode', this.gCode);
  //         this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //           if (res !== undefined) {
  //             this.typeOptions = TypeSelection;
  //             this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COOPERATIVES LEADING', 'value': this.typeOptions }, { 'label': 'COOPERATIVES PRIMARY', 'value': this.typeOptions });
  //           }
  //         });
  //       }
  //       break;
  //     case 's':
  //       if (this.societyOptions === undefined) {
  //         const params = new HttpParams().set('GCode', this.gCode);
  //         this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //           if (res !== undefined) {
  //             res.forEach(x => {
  //               SocietySelection.push({ 'label': x.Societyname, 'value': x.Societyname });
  //               this.societyOptions = SocietySelection;
  //             });
  //           }
  //         });
  //       }
  //       break;
  //     case 'Iss':
  //       if (this.IssuerOptions === undefined) {
  //         const params = new HttpParams().set('GCode', this.gCode);
  //         this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //           if (res !== undefined) {
  //             res.forEach(x => {
  //               IssuerSelection.push({ 'label': x.Issuername, 'value': x.Issuername });
  //               this.IssuerOptions = IssuerSelection;
  //             });
  //           }
  //         });
  //       }
  //   }
  // }

  // onSelect() {
  //   let TypeSelection = [];
  //   let SocietySelection = [];
  //   let IssuerSelection = [];
  //   const params = new HttpParams().set('GCode', this.gCode);
  //   this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //     if (res !== undefined) {
  //       if (this.typeOptions === undefined) {
  //         this.typeOptions = TypeSelection;
  //         this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COOPERATIVES LEADING', 'value': this.typeOptions }, { 'label': 'COOPERATIVES PRIMARY', 'value': this.typeOptions });
  //       }
  //       if (this.societyOptions === undefined) {
  //         res.forEach(x => {
  //           SocietySelection.push({ 'label': x.Societyname, 'value': x.Societyname });
  //           this.societyOptions = SocietySelection;
  //         });
  //       }
  //       if (this.IssuerOptions === undefined) {
  //         res.forEach(x => {
  //           IssuerSelection.push({ 'label': x.Issuername, 'value': x.Issuername });
  //           this.IssuerOptions = IssuerSelection;
  //         });
  //       }

  //     }
  //    
  // }

  onResetTable() {
    this.SocietyMasterEntryData = [];
    this.isActionDisabled = true;
  }

  onView() {
    this.loading = true;
    this.ontype();
    this.onSo();
    this.onIss();
    const params = new HttpParams().set('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
      this.SocietyMasterEntryData = res;
      let sno = 0;
      this.SocietyMasterEntryData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }
}