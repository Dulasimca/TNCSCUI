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
  fromDate: any;
  toDate: any;
  regionOptions: SelectItem[];
  regions: any;
  RCode: any;
  formUser = [];
  Pan: any;
  Partyname: any;
  Favour: any;
  Gst: any;
  Account: any;
  Bank: any;;
  Branch: any;
  IFSC: any;
  userdata: any;
  maxDate: Date;
  loggedInRCode: any;
  GCode: any;
  viewPane: boolean;
  isViewed: boolean = false;
  RName: any;
  @ViewChild('region') regionPanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.RName = this.authService.getUserAccessible().rName;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.GCode = this.authService.getUserAccessible().gCode;
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
      // 'telno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      // 'mobno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
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
    }
  }

  onView() {
    // if (this.formUser !== undefined) {
    //   this.PartyLedgerData = this.formUser;
    //   this.PartyLedgerCols = this.tableConstant.PartyLedgerMaster;
    // }
    const params = {
      'GCode': this.GCode,
      'RCode': this.RCode,
    };
    this.restApiService.getByParameters(PathConstants.PARTY_LEDGER_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.PartyLedgerCols = this.tableConstant.PartyLedgerMaster;
        this.PartyLedgerData = res;
        let sno = 0;
        this.PartyLedgerData.forEach(s => {
          s.REName = this.RName;
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onClear() {
    this.Pan = this.Partyname = this.Favour = this.Gst = this.Account = this.Bank = this.Branch = this.IFSC = [];
    this.regionOptions = null;
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
    this.Account = this.selectedRow.Account;
    this.RCode = this.selectedRow.RName;
    this.Favour = this.selectedRow.Favour;
    this.Bank = this.selectedRow.Bank;
    this.Branch = this.selectedRow.Branch;
    this.IFSC = this.selectedRow.IFSC;
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
      // 'Roleid': this.roleId,
      'Pan': this.Pan,
      'PartyName': this.Partyname,
      'RCode': this.loggedInRCode,
      'GCode': this.GCode,
      'GST': this.Gst,
      'Favour': this.Favour,
      'Account': this.Account,
      'Bank': this.Bank,
      'Branch': this.Branch,
      'IFSC': this.IFSC,
    };
    this.restApiService.post(PathConstants.PARTY_LEDGER_ENTRY_POST, params).subscribe(value => {
      if (value) {
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
    this.onClear();
  }
  onResetTable(item) {

  }
}