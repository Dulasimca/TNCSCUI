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
  trCode: any;
  Trcode: any;
  rCode: any;
  SocietyData = [];
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
    this.rCode = this.authService.getUserAccessible().rCode;
    // const params = new HttpParams().set('GCode', this.gCode);
    // this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_NEW_ENTRY_GET, params).subscribe(res => {
    //   if (res !== undefined) {
    //     res.forEach(x => {
    //       res.push({ 'value': x.SocietyCode });
    //       this.SocietyData = res;
    //     });
    //   }
    // });
  }

  // ontype() {
  //   let TypeSelection = [];
  //   if (this.typeOptions === undefined) {
  //     this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(tr => {
  //       if (tr !== undefined) {
  //         tr.forEach(x => {
  //           tr.push({ 'label': x.TRName, 'value': x.TRCode });
  //           this.Trcode = tr;
  //           if (this.Trcode !== null && this.Trcode !== undefined) {
  //             // if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
  //             const params = new HttpParams().set('TRCode', (this.Trcode !== undefined) ? this.Trcode : this.trCode).append('GCode', this.gCode);
  //             this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
  //               if (res) {
  //                 // this.typeOptions = TypeSelection;
  //                 res.forEach(x => {
  //                   TypeSelection.push({'value': x.TRCode });
  //                   this.typeOptions = TypeSelection;
  //                 });
  //               }
  //             });
  //           }
  //           // }
  //         });
  //       }
  //     });
  //   }
  // }

  ontype() {
    let TypeSelection = [];
    if (this.typeOptions === undefined) {
      const params = new HttpParams().set('GCode', this.gCode);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_NEW_ENTRY_GET, params).subscribe(res => {
        if (res !== undefined) {
          // res.forEach(x => {
          // this.SocietyData.push({ 'label': x.SocietyCode, 'value': x.Societyname });
          // this.SocietyOptions = this.SocietyData;
          this.typeOptions = TypeSelection;
          this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, 
          { 'label': 'CRS', 'value': 'TY004' },
           { 'label': 'COOPERATIVES LEADING', 'value': 'TY002' }, { 'label': 'COOPERATIVES PRIMARY', 'value': 'TY003' });
          // });
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
      let sno = 0;
      this.SocietyMasterEntryData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please contact administrator' });
      }
    });
  }

  onSave() {
    const params = {
      'gowdoncode': this.gCode,
      'SocietyCode': '0',
      'RCode': this.rCode,
      'SocietyName': this.Name,
      'SocietyType': this.t_cd.value,
      'eflag': 'N'
    };
    this.restAPIService.post(PathConstants.SOCIETY_MASTER_NEW_ENTRY_POST, params).subscribe(value => {
      if (value) {
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
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
  }
}