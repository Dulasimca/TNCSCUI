import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { Dropdown, MessageService } from 'primeng/primeng';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rate-master',
  templateUrl: './rate-master.component.html',
  styleUrls: ['./rate-master.component.css']
})
export class RateMasterComponent implements OnInit {
  RateMasterCols: any;
  RateMasterData: any;
  canShowMenu: Boolean;
  maxDate: Date;
  effectiveDate: any;
  endDate: any;
  Rate: any;
  Commodity: any;
  Scheme: any;
  SchemeOptions: SelectItem[];
  commodityOptions: SelectItem[];
  loading: boolean = false;
  blockScreen: Boolean;
  Hsncode: any;
  ActiveFlag: any;
  RowID: any;
  Tax: any;
  Remark: any;
  @ViewChild('scheme', { static: false }) SchemePanel: Dropdown;
  @ViewChild('commodity', { static: false }) CommodityPanel: Dropdown;

  constructor(private authService: AuthService, private datepipe: DatePipe, private TableConstant: TableConstants,
    private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.loading = true;
    this.restApiService.get(PathConstants.RATE_MASTER_GET).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.RateMasterCols = this.TableConstant.RateMaster;
        this.RateMasterData = res;
        this.RateMasterData.forEach(s => {
          s.EffectDate = this.datepipe.transform(s.EffectDate, 'dd/MM/yyyy');
          s.EndDate = this.datepipe.transform(s.EndDate, 'dd/MM/yyyy');
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onDateSelect() { }

  onSelect(item, type) {
    let CommoditySelection = [];
    let SchemeSelection = [];
    const range = 2;
    switch (item) {
      case 'commodity':
        if (type === 'tab') {
          this.CommodityPanel.overlayVisible = true;
        }
        if (this.commodityOptions === undefined) {
          this.restApiService.get(PathConstants.ALLOTMENT_GROUP_ITEM).subscribe(res => {
            if (res !== undefined) {
              res.forEach(s => {
                CommoditySelection.push({ label: s.AllotmentName, value: s.AllotmentCode });
              });
              CommoditySelection.unshift({ label: '-select-', value: null, disabled: true });
              this.commodityOptions = CommoditySelection;
            }
          });
        }
        break;
      case 'scheme':
        if (type === 'tab') {
          this.SchemePanel.overlayVisible = true;
        }
        if (this.SchemeOptions === undefined) {
          this.restApiService.get(PathConstants.SCHEMES).subscribe(res => {
            res.forEach(s => {
              SchemeSelection.push({ label: s.Name, value: s.SCCode });
            });
            this.SchemeOptions = SchemeSelection;
            this.SchemeOptions.unshift({ label: '-select-', value: null, disabled: true });
          });
        }
        break;
    }
  }

  onCheck() {
    if (this.RowID === undefined) {
      const params = {
        'Type': 1,
        'Scheme': this.Scheme,
        'Allotment': this.Commodity,
      };
      this.restApiService.getByParameters(PathConstants.RATE_MASTER_GET, params).subscribe(res => {
        if (res.length === 0) {
          this.onSave();
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.RateExists
          });
        }
      });
    } else {
      this.onSave();
    }
  }

  onSave() {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'RowID': this.RowID || '',
      'ScCode': this.Scheme,
      'Allotment': this.Commodity,
      'Rate': this.Rate,
      'EffectDate': this.datepipe.transform(this.effectiveDate, 'MM/dd/yyyy'),
      'EndDate': this.datepipe.transform(this.endDate, 'MM/dd/yyyy'),
      'CreatedDate': this.maxDate,
      'Remark': this.Remark,
      'Activeflag': this.ActiveFlag,
      'Hsncode': this.Hsncode,
      'TaxPercentage': this.Tax
    };
    this.restApiService.post(PathConstants.RATE_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.blockScreen = false;
        this.onView();
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

  onRowSelect(event, selectedRow) {
    this.RowID = selectedRow.RowID;
    this.commodityOptions = [{ label: selectedRow.AllotmentName, value: selectedRow.AllotmentCode }];
    this.SchemeOptions = [{ label: selectedRow.SchemeName, value: selectedRow.Scheme }];
    this.Commodity = selectedRow.AllotmentCode;
    this.Scheme = selectedRow.Scheme;
    this.Rate = selectedRow.Rate;
    this.effectiveDate = selectedRow.EffectDate;
    this.endDate = selectedRow.endDate;
    this.Remark = selectedRow.Remarks;
    this.Hsncode = selectedRow.Hsncode;
    this.effectiveDate = selectedRow.EffectDate;
    this.endDate = selectedRow.EndDate;
    this.Tax = selectedRow.TaxPercentage;
    this.ActiveFlag = selectedRow.Flag;
    // this.effectiveDate = this.datepipe.transform(selectedRow.EffectDate, 'MM/dd/yyyy');
    // this.endDate = this.datepipe.transform(selectedRow.EndDate, 'MM/dd/yyyy');
  }

  onView() {
    this.restApiService.get(PathConstants.RATE_MASTER_GET).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.RateMasterCols = this.TableConstant.RateMaster;
        this.RateMasterData = res;
        this.RateMasterData.forEach(s => {
          s.EffectDate = this.datepipe.transform(s.EffectDate, 'dd/MM/yyyy');
          s.EndDate = this.datepipe.transform(s.EndDate, 'dd/MM/yyyy');
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onClear() {
    this.Commodity = this.Scheme = this.Rate = this.effectiveDate = this.endDate = this.Remark = this.RowID = this.Hsncode = undefined;
    this.commodityOptions = this.SchemeOptions = this.Tax = undefined;
  }
}