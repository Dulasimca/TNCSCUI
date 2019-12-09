import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-party-ledger-update',
  templateUrl: './party-ledger-update.component.html',
  styleUrls: ['./party-ledger-update.component.css']
})
export class PartyLedgerUpdateComponent implements OnInit {

  PartyLedgerData: any = [];
  PartyLedgerCols: any = [];
  IssuerCols: any = [];
  IssuerData: any = [];
  PartyName: any;
  PartyCode: any;
  IssuerName: any;
  IssCode: any;
  canShowMenu: boolean;
  data?: any;
  roleId: any;
  regionOptions: SelectItem[];
  partyOptions: SelectItem[];
  issuerOptions: SelectItem[];
  godownOptions: SelectItem[];
  regions: any;
  RCode: any;
  Region: any;
  regionsData: any;
  CompanyTitle: any;
  maxDate: Date;
  loggedInRCode: any;
  GCode: any;
  viewPane: boolean;
  isViewed: boolean = false;
  disableOkButton: boolean = true;
  selectedRow: any;
  searchText: any;
  RName: any;
  loading: boolean = false;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('party') partyPanel: Dropdown;
  @ViewChild('issuer') issuerPanel: Dropdown;
  @ViewChild('godown') godownPanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let issuerSelection = [];
    let partySelection = [];
    switch (item) {
      case 'reg':
        this.regionsData = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
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
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'party':
        if (type === 'enter') {
          this.partyPanel.overlayVisible = true;
        }
        if (this.regionOptions !== undefined) {
          const params = {
            'RCode': this.RCode.value,
          };
          this.restApiService.getByParameters(PathConstants.PARTY_LEDGER_ENTRY_GET, params).subscribe(res => {
            if (res !== undefined) {
              // this.PartyLedgerCols = this.tableConstant.PartyLedgerMaster;
              // this.PartyLedgerData = res;
              res.forEach(s => {
                partySelection.push({ 'label': s.PartyName, 'value': s.PCode });
              });
              this.partyOptions = partySelection;
              this.partyOptions.unshift({ 'label': '-select-', value: null, disabled: true });
            }
          });
        }
        break;
      case 'issuer':
        if (type === 'enter') {
          this.issuerPanel.overlayVisible = true;
        }
        if (this.godownOptions !== undefined) {
          this.PartyLedgerData.forEach(data => {
            issuerSelection.push({ 'label': data.Issuername, 'value': data.IssuerCode });
          });
          this.issuerOptions = issuerSelection;
          this.issuerOptions.unshift({ 'label': '-select-', value: null, disabled: true });
        }
        break;
    }
  }

  onView() {
    this.loading = true;
    this.IssuerCols = this.tableConstant.IssuerPartyCols;
    const params = {
      'Type': 1,
      'GCode': this.GCode,
    };
    this.restApiService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(res => {
      if (res !== undefined) {
        this.PartyLedgerData = res;
        this.loading = false;
        this.IssuerData = res;
        this.CompanyTitle = res;
        let sno = 0;
        res.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onSubmit() {
    const params = {
      'Type': 1,
      'RCode': this.RCode.value,
      'IssuerCode': this.IssuerName.value || this.IssCode,
      'PartyID': this.PartyName.value || this.PartyCode
    };
    this.restApiService.put(PathConstants.ISSUER_MASTER_PUT, params).subscribe(value => {
      if (value) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });

      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
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
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
    this.viewPane = false;
    this.isViewed = true;
    this.partyOptions = [{ label: this.selectedRow.PartyName, value: this.selectedRow.PartyID }];
    this.issuerOptions = [{ label: this.selectedRow.Issuername, value: this.selectedRow.IssuerCode }];
    this.PartyName = this.selectedRow.PartyName;
    this.PartyCode = this.selectedRow.PartyID;
    this.IssuerName = this.selectedRow.Issuername;
    this.IssCode = this.selectedRow.IssuerCode;
  }

  onSearch(value) {
    this.CompanyTitle = this.PartyLedgerData;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerData = this.CompanyTitle.filter(item => {
        return item.Issuername.toString().startsWith(value);
      });
    } else {
      this.CompanyTitle = this.PartyLedgerData;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.IssuerData = [];
  }
}