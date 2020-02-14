import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

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
  shopNameOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  ReceivorType: any;
  Society: any;
  GCode: any;
  RCode: any;
  s_cd: any;
  t_cd: any;
  Iss_cd: any;
  Iss: any;
  SOCData: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  loading: boolean;
  maxDate: Date;
  roleId: any;
  username: any;
  loggedInRCode: any;
  regions: any;
  TypeSelection = [];
  SocietySelection = [];
  IssuerSelection = [];
  disableSociety: boolean = true;
  Shop: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('shop', { static: false }) shopPanel: Dropdown;
  @ViewChild('society', { static: false }) societyPanel: Dropdown;
  @ViewChild('receivor', { static: false }) receiverPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterEntryCols = this.tableConstants.SocietyMasterEntry;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let shopSelection = [];
    let receiverSelection = [];
    let societySelection = [];
    let IssuerShop = [];
    let IssuerSociety = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'tab') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ label: x.GName, value: x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'sh':
        if (type === 'tab') {
          this.shopPanel.overlayVisible = true;
        }
        this.SocietyMasterEntryData.forEach(vv => {
          shopSelection.push({ 'label': vv.Issuername, 'value': vv.IssuerCode });
        });
        this.shopNameOptions = shopSelection;
        break;
      case 'r':
        if (type === 'tab') {
          this.receiverPanel.overlayVisible = true;
        }
        if (this.receiverOptions === undefined) {
          const params = new HttpParams().set('TRCode', 'Shop');
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
            res.forEach(s => {
              receiverSelection.push({ label: s.Tyname, value: s.Tycode });
            });
            this.receiverOptions = receiverSelection;
            this.receiverOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });

          });
        }
        break;
      case 's':
        if (type === 'tab') {
          this.societyPanel.overlayVisible = true;
        }
        this.IssuerData.forEach(S => {
          societySelection.push({ 'label': S.SocietyName, 'value': S.SocietyCode });
        });
        this.societyOptions = societySelection;
        break;
    }
  }

  onResetTable() {
    // this.SocietyMasterEntryData = [];
  }

  onView() {
    this.loading = true;
    const params = new HttpParams().set('GCode', this.GCode.value);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {
      this.SocietyMasterEntryData = res.Table;
      this.IssuerData = res.Table1;
      if (this.SocietyMasterEntryData !== undefined && this.SocietyMasterEntryData !== 0) {
        this.SocietyMasterEntryData = this.SocietyMasterEntryData.filter((value: { Tyname: any; }) => { return value.Tyname === this.ReceivorType.label });
      }
      let sno = 0;
      this.SocietyMasterEntryData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onUpdate() {
    const params = {
      'GCode': this.GCode.value,
      'SCode': this.Society.value,
      'ICode': this.Shop.value,
      'IType': this.ReceivorType.value
    };
    this.restAPIService.put(PathConstants.SOCIETY_MASTER_ENTRY_PUT, params).subscribe(val => {
      if (val) {
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
  }
}


  // onSelect() {
  //   if (this.typeOptions === undefined && this.societyOptions === undefined && this.IssuerOptions === undefined) {
  //     const params = new HttpParams().set('GCode', this.GCode);
  //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {

  //       if (res !== undefined) {
  //         var result = Array.from(new Set(res.map((item: any) => item.Tyname))); //Get distinct values from array
  //         var code = Array.from(new Set(res.map((item: any) => item.Tycode)));
  //         for (var index in result && code) {
  //           this.TypeSelection.push({ 'label': result[index], 'value': code[index] });
  //         }
  //         this.typeOptions = this.TypeSelection;
  //         var result = Array.from(new Set(res.map((item: any) => item.Societyname))); //Get distinct values from array
  //         var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
  //         for (var index in result && code) {
  //           this.SocietySelection.push({ 'label': result[index], 'value': code[index] });
  //         }
  //         this.societyOptions = this.SocietySelection;
  //         res.forEach(x => {
  //           this.IssuerSelection.push({ 'label': x.Issuername, 'value': x.IssuerCode });
  //           this.IssuerOptions = this.IssuerSelection;
  //         });
  //       }
  //     });
  //     // this.SocietyMasterEntryData = this.IssuerSelection;
  //     // this.IssuerSelection.forEach(s => {
  //     //   this.IssuerSelection.push({ 'label': s.Issuername, 'value': s.IssuerCode });
  //     //   this.IssuerOptions = this.IssuerSelection;
  //     // });
  //   }
  // }


  //   case 'Iss':
  // if (this.IssuerOptions === undefined) {
  //   const params = new HttpParams().set('GCode', this.GCode);
  //   this.restAPIService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(res => {
  //     if (res !== undefined) {
  //       res.forEach(x => {
  //         IssuerSelection.push({ 'label': x.Issuername, 'value':x.IssuerCode });
  //         this.IssuerOptions = IssuerSelection;
  //       });
  //     }
  //   });
  // }
// }
// }