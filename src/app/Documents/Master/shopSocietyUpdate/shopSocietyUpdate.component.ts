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
  // tslint:disable-next-line: component-selector
  selector: 'app-shopSocietyUpdate',
  templateUrl: './shopSocietyUpdate.component.html',
  styleUrls: ['./shopSocietyUpdate.component.css']
})
export class ShopSocietUpdateMasterComponent implements OnInit {
  SocietyMasterEntryCols: any;
  SocietyMasterEntryData: any;
  IssuerData: any;
  data?: any;
  typeOptions: SelectItem[];
  societyOptions: SelectItem[];
  IssuerOptions: SelectItem[];
  gCode: any;
  s_cd: any;
  t_cd: any;
  Iss_cd: any;
  Iss: any;
  SOCData: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private authService: AuthService) { }

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

  // onIss() {
  //   // this.SocietyMasterEntryData = this.IssuerData;
  //   let IssuerSelection = [];
  //   if (this.IssuerOptions === undefined) {
  //     const params = new HttpParams().set('GCode', this.gCode);
  //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //       this.IssuerData = res;
  //       res.forEach(s => {
  //         if (s.Tyname === this.t_cd) {
  //           // IssuerSelection = s.filter((value: { Issuername: any; }) => { return value.Issuername === this.t_cd });
  //           return s;
  //         }
  //       });
  //       this.IssuerOptions = IssuerSelection;
  //     });
  //   }
  //   // if (this.s_cd !== undefined) {
  //   //   IssuerSelection.forEach(s => {
  //   //     this.IssuerOptions = IssuerSelection.filter((value: { Issuername: any; }) => { return value.Issuername === this.s_cd.label });
  //   //   });
  //   // }
  // }

  onIss() {
    let IssuerSelection = [];
    if (this.IssuerOptions === undefined) {
      const params = new HttpParams().set('GCode', this.gCode);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
        if (res !== undefined) {
          res.forEach(x => {
            IssuerSelection.push({ 'label': x.Issuername });
            this.IssuerOptions = IssuerSelection;
          });
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
          var result = Array.from(new Set(res.map((item: any) => item.Societyname))); //Get distinct values from array
          for (var index in result) {
            SocietySelection.push({ 'label': result[index] });
          }
          this.societyOptions = SocietySelection;
        }
      });
    }
  }

  //   onSo() {
  //       let SocietySelection = [];
  //       const params = new HttpParams().set('GCode', this.gCode);
  //       this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
  //       SocietySelection = res.filter((value) => { return value.Societyname === this.t_cd.label })
  //                       // .map((value) => { return { label: value.Tyname, value: value.Tyname } });
  //                       // this.societyOptions = SocietySelection;
  //                       res.forEach(y => {
  //                                   SocietySelection.push({ 'label': y.Societyname, 'value': y.Societyname === this.t_cd.label });
  //                                   this.societyOptions = SocietySelection;
  //                                   this.societyOptions.slice(this.societyOptions.Societyname);
  //                                 });
  //                     });  
  // }

  onResetTable() {
    this.SocietyMasterEntryData = [];
    this.isActionDisabled = true;
  }

  onView() {
    this.loading = true;
    const params = new HttpParams().set('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
      this.SocietyMasterEntryData = res;
      if (this.SocietyMasterEntryData !== undefined && this.SocietyMasterEntryData !== 0) {
        this.SocietyMasterEntryData = res.filter((value: { Tyname: any; }) => { return value.Tyname === this.t_cd.label });
      }
      let sno = 0;
      this.SocietyMasterEntryData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
      });
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
    });
  }

  onUpdate() {
    const params = {
      'GCode': this.gCode,
      'SCode': this.s_cd.label,
      'ICode': this.Iss_cd.label,
      'IType': this.t_cd.label
    };
    this.restAPIService.put(PathConstants.SOCIETY_MASTER_ENTRY_PUT, params).subscribe(val => {
      if (val) {
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Updated Successfully!' });

      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
        }
      });
    // this.onClear();
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
  //               SocietySelection.push({ 'label': x.Societyname });
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
  //               IssuerSelection.push({ 'label': x.Issuername });
  //               this.IssuerOptions = IssuerSelection;
  //             });
  //           }
  //         });
  //       }
  //   }
  // }