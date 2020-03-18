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
  godownOptions: SelectItem[];
  regions: any;
  RCode: any;
  Region: any;
  formUser = [];
  searchText: any;
  Pan: any;
  State: any;
  TIN: any;
  Partyname: any;
  PartyCode: any;
  Favour: any;
  LedgerID: any;
  Gst: any;
  Account: any;
  Bank: any;
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
  onReg: boolean = false;
  onURD: boolean = false;
  blockScreen: boolean;
  RName: any;
  isActive: any;
  Flag: any;
  Godown: any;
  AADS: any;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('active', { static: false }) activePanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;

  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

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
    let GodownSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
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
                regionSelection.push({ label: x.RName, value: x.RCode });
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
          ActiveSelection.push({ label: 'Registered', value: 'Registered' }, { label: 'Un-Registered', value: 'URD' });
          this.ActiveOptions = ActiveSelection;
        }
        break;
      case 'godown':
        if (type === 'enter') {
          this.activePanel.overlayVisible = true;
        }
        if (this.godownOptions !== undefined) {
          GodownSelection.push({ label: 'Godown', value: 'Godown' }, { label: 'AADS', value: 'AADS' },
            { label: 'Both Use', value: 'Both' });
          this.godownOptions = GodownSelection;
        }
        break;
    }
  }

  onURDView(formUser) {
    const params = {
      'Type': 'URD',
      'PartyName': this.Partyname
    };
    this.restApiService.getByParameters(PathConstants.PARTY_LEDGER_ENTRY_GET, params).subscribe(res => {
      if (res.length === 0) {
        this.onURDSubmit();
      } else
        if (res !== undefined && res !== null && res.length !== 0) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.PartyNameExists
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
  }

  onView() {
    this.loading = true;
    const params = {
      'Type': (this.isActive === 'URD') ? 'URD' : 'Registered',
      'TIN': (this.State + this.Pan + this.Gst).toUpperCase(),
    };
    this.restApiService.getByParameters(PathConstants.PARTY_LEDGER_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        // this.PartyLedgerCols = this.tableConstant.PartyLedgerMaster;
        this.loading = false;
        this.CompanyTitle = res;
        this.PartyLedgerData = res;
        this.viewPane = false;
        this.onReg = true;
        this.Pan = this.PartyLedgerData[0].Pan;
        this.Partyname = this.PartyLedgerData[0].PartyName;
        this.Gst = this.PartyLedgerData[0].GST;
        this.State = this.PartyLedgerData[0].StateCode;
        this.Account = this.PartyLedgerData[0].Account;
        this.Favour = this.PartyLedgerData[0].Favour;
        this.Bank = this.PartyLedgerData[0].Bank;
        this.Branch = this.PartyLedgerData[0].Branch;
        this.IFSC = this.PartyLedgerData[0].IFSC;
        this.LedgerID = this.PartyLedgerData[0].LedgerID;
        this.PartyCode = this.PartyLedgerData[0].PCode;
        this.Flag = this.PartyLedgerData[0].isActive;
        this.godownOptions = [{ label: this.PartyLedgerData[0].AADSType, value: this.PartyLedgerData[0].AADSType }];
        this.Godown = this.PartyLedgerData[0].AADSType;
      } else {
        this.loading = false;
        this.onReg = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.onReg = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onLoad() {
    let value = [];
    if (this.Gst !== undefined && this.State !== undefined && this.Pan !== undefined) {
      value = this.State + this.Pan + this.Gst;
      if (value.length === 15) {
        this.TIN = value;
        this.onView();
      } else if (value.length !== 15) {
        this.onReg = false;
        this.onFormClear();
      }
    }
  }

  onFormClear() {
    this.Partyname = this.PartyCode = this.Favour = this.Account = this.Bank = this.Branch = this.IFSC = this.LedgerID = undefined;
    this.Godown = undefined;
  }

  onClear() {
    this.Pan = this.Favour = this.Gst = this.State = this.Account = this.Bank = this.Branch = this.IFSC = this.PartyCode = undefined;
    this.isActive = this.LedgerID = this.Partyname = this.Godown = this.TIN = undefined;
    this.onReg = false;
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData(event, selectedRow) {
    this.viewPane = false;
    this.isViewed = true;
    this.onReg = true;
    this.Pan = this.selectedRow.Pan;
    this.Partyname = this.selectedRow.PartyName;
    this.Gst = this.selectedRow.GST;
    this.State = this.selectedRow.StateCode;
    this.Account = this.selectedRow.Account;
    this.Favour = this.selectedRow.Favour;
    this.Bank = this.selectedRow.Bank;
    this.Branch = this.selectedRow.Branch;
    this.IFSC = this.selectedRow.IFSC;
    this.LedgerID = this.selectedRow.LedgerID;
    this.PartyCode = this.selectedRow.PCode;
    this.Flag = this.selectedRow.isActive;
  }

  onSubmit(formUser) {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'LedgerID': (this.LedgerID !== undefined && this.LedgerID !== null) ? this.LedgerID : '',
      'PCode': (this.PartyCode !== undefined && this.PartyCode !== null) ? this.PartyCode : 0,
      // 'Roleid': this.roleId,
      'Pan': this.Pan.toUpperCase(),
      'StateCode': this.State,
      'PartyName': this.Partyname.toUpperCase(),
      'GST': this.Gst.toUpperCase(),
      'Tin': (this.State + this.Pan + this.Gst).toUpperCase(),
      'Favour': this.Favour,
      'Account': this.Account.toUpperCase(),
      'Bank': this.Bank.toUpperCase(),
      'Branch': this.Branch.toUpperCase(),
      'IFSC': this.IFSC.toUpperCase(),
      'RCode': this.loggedInRCode,
      'AADSType': this.Godown,
      'Flag': (this.isActive === 'Registered') ? 1  : 0
    };
    this.restApiService.post(PathConstants.PARTY_LEDGER_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onURDSubmit() {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'Type': 1,
      'LedgerID': (this.LedgerID !== undefined && this.LedgerID !== null) ? this.LedgerID : '',
      'PCode': (this.PartyCode !== undefined && this.PartyCode !== null) ? this.PartyCode : 0,
      'PartyName': this.Partyname.toUpperCase(),
      'Tin': this.isActive,
      'RCode': this.loggedInRCode,
      'AADSType': this.Godown,
      'Flag': (this.isActive === 'URD') ? 1 : 0
    };
    this.restApiService.post(PathConstants.PARTY_LEDGER_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onSearch(value) {
    this.PartyLedgerData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.PartyLedgerData = this.CompanyTitle.filter(item => {
        return item.PartyName.startsWith(value) || item.TIN.toString().startsWith(value);
      });
    } else {
      this.PartyLedgerData = this.CompanyTitle;
    }
  }

  onResetTable(item) {
    if (item === 'URD') {
      this.onFormClear();
      this.Pan = this.State = this.Gst = this.TIN = undefined;
      this.onReg = false;
      this.godownOptions = null;
    } else if (item === 'godown') { }
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}