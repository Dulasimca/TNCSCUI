import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-party-ledger-master',
  templateUrl: './party-ledger-master.component.html',
  styleUrls: ['./party-ledger-master.component.css']
})
export class PartyLedgerMasterComponent implements OnInit {

  PartyLedgerData: any = [];
  PartyLedgerCols: any;
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  selectedRow: any;
  data?: any;
  roleId: any;
  regionOptions: SelectItem[];
  ActiveOptions: SelectItem[];
  regions: any;
  RCode: any;
  Region: any;
  formUser = [];
  searchText: any;
  Pan: any;
  State: any;
  Tin: any;
  Partyname: any;
  PartyCode: any;
  Favour: any;
  LedgerID: any;
  Gst: any;
  Account: any;
  Bank: any;;
  Branch: any;
  IFSC: any;
  userdata: any;
  CompanyTitle: any;
  maxDate: Date;
  loggedInRCode: any;
  GCode: any;
  loading: boolean = false;
  viewPane: boolean;
  isViewed: boolean = false;
  RName: any;
  isActive: any;
  Flag: any;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('active') activePanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.userdata = this.fb.group({
      'PanNo': new FormControl(''),
      'Partyname': new FormControl(''),
      'Favour': new FormControl(''),
      'GST': new FormControl(''),
      'Account': new FormControl(''),
      'Bank': new FormControl(''),
      'Branch': new FormControl(''),
      'IFSC': new FormControl(''),
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let ActiveSelection = [];
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
            if (this.roleId !== 3) {
              this.regionOptions.unshift({ label: 'All', value: 'All' });
            }
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            if (this.roleId !== 3) {
              this.regionOptions.unshift({ label: 'All', value: 'All' });
            }
          }
        }
        break;
      case 'active':
        if (type === 'enter') {
          this.activePanel.overlayVisible = true;
        }
        if (this.ActiveOptions === undefined) {
          ActiveSelection.push({ 'label': 'Active', 'value': 'Active' }, { 'label': 'InActive', 'value': 'InActive' });
          this.ActiveOptions = ActiveSelection;
        }
        break;
    }
  }


  onView() {
    this.loading = true;
    const params = {
      'Type': (this.isActive !== undefined && this.isActive !== null) ? this.isActive.value : 'Active',
      'RCode': this.RCode.value,
    };
    this.restApiService.getByParameters(PathConstants.PARTY_LEDGER_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.PartyLedgerCols = this.tableConstant.PartyLedgerMaster;
        this.loading = false;
        this.CompanyTitle = res;
        this.PartyLedgerData = res;
        let sno = 0;
        this.PartyLedgerData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
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


  onClear() {
    this.Pan = this.Partyname = this.Favour = this.Gst = this.State = this.Account = this.Bank = this.Branch = this.IFSC = this.LedgerID = this.PartyCode = null;
    this.RCode = this.isActive = undefined;
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    this.regionOptions = [{ label: this.selectedRow.RName, value: this.selectedRow.RCode }];
    this.Pan = this.selectedRow.Pan;
    this.Partyname = this.selectedRow.PartyName;
    this.Gst = this.selectedRow.GST;
    this.State = this.selectedRow.StateCode;
    this.Account = this.selectedRow.Account;
    this.RName = this.selectedRow.RName;
    this.Favour = this.selectedRow.Favour;
    this.Bank = this.selectedRow.Bank;
    this.Branch = this.selectedRow.Branch;
    this.IFSC = this.selectedRow.IFSC;
    this.LedgerID = this.selectedRow.LedgerID;
    this.PartyCode = this.selectedRow.PCode;
    this.Flag = this.selectedRow.isActive;
  }

  onSubmit(formUser) {
    const params = {
      'LedgerID': (this.LedgerID !== undefined && this.LedgerID !== null) ? this.LedgerID : '',
      'PCode': (this.PartyCode !== undefined && this.PartyCode !== null) ? this.PartyCode : 0,
      'Roleid': this.roleId,
      'Pan': this.Pan,
      'StateCode': this.State,
      'PartyName': this.Partyname,
      'RCode': this.RCode.value,
      'GST': this.Gst,
      'Tin': this.State + this.Pan + this.Gst,
      'Favour': this.Favour,
      'Account': this.Account,
      'Bank': this.Bank,
      'Branch': this.Branch,
      'IFSC': this.IFSC,
      'Flag': (this.isActive.value === 'Active') ? 1 : 0
    };
    this.restApiService.post(PathConstants.PARTY_LEDGER_ENTRY_POST, params).subscribe(value => {
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
    }, (err: HttpErrorResponse) => {
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

  onSearch(value) {
    this.PartyLedgerData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.PartyLedgerData = this.CompanyTitle.filter(item => {
        return item.PartyName.toString().startsWith(value);
      });
    } else {
      this.PartyLedgerData = this.CompanyTitle;
    }
  }

  onResetTable(item) { }

}