import { Component, OnInit, ViewChild } from '@angular/core';
import { Dropdown, SelectItem, MessageService } from 'primeng/primeng';
import { AuthService } from '../shared-services/auth.service';
import { TableConstants } from '../constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from '../shared-services/restAPI.service';
import { RoleBasedService } from '../common/role-based.service';
import { PathConstants } from '../constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from '../constants/Messages';

@Component({
  selector: 'app-transfer-opening-balance-to-hoqty',
  templateUrl: './transfer-opening-balance-to-hoqty.component.html',
  styleUrls: ['./transfer-opening-balance-to-hoqty.component.css']
})
export class TransferOpeningBalanceToHOQtyComponent implements OnInit {
  regionOptions: SelectItem[];
  regions: any;
  RCode: any;
  Year: any;
  yearOptions: SelectItem[];
  transferOBToHOCols: any;
  transferOBToHOData: any = [];
  loggedInRCode: any;
  roleId: any;
  canShowMenu: boolean;
  blockScreen: boolean;
  currYrSelection: any = [];
  loading: boolean;
  @ViewChild('year', { static: false }) yearPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;

  constructor(private authService: AuthService, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstants: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.transferOBToHOCols = this.tableConstants.TransferOBToHOQtyColumns;
    /// curyear
    this.restApiService.get(PathConstants.STACKCARD_YEAR_GET).subscribe(res => {
      for (let i = 0; i <= 2; i++) {
        this.currYrSelection.push({ label: res[i].StackYear, value: res[i].StackYear });
      }
      this.currYrSelection.unshift({ 'label': '-select-', 'value': null, disabled: true });
    });
  }

  onSelect(selectedItem, type) {
    let regionSelection = [];
    switch (selectedItem) {
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
            this.regionOptions.unshift({ label: '-select-', value: null });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          }
        }
        break;
      case 'y':
        if (type === 'tab') {
          this.yearPanel.overlayVisible = true;
        }
        this.yearOptions = this.currYrSelection;
        break;
    }
  }

  onChange() {
    this.transferOBToHOData.length = 0;
    if (this.Year !== undefined && this.Year !== null && this.RCode !== null && this.RCode !== undefined) {
      this.loading = true;
      const params = {
        'RCode': this.RCode,
        'CurYear': this.Year
      }
      this.restApiService.getByParameters(PathConstants.TRANSFER_OB_TO_HO_QTY_GET, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.transferOBToHOData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    }
  }

  onTransfer() {
    this.blockScreen = true;
    this.restApiService.post(PathConstants.TRANSFER_OB_TO_HO_QTY_POST, this.transferOBToHOData).subscribe(res => {
      if (res !== undefined && res !== null && res.Item1) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.TransferSuccessMsg });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }
}
