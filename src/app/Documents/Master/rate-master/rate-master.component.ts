import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { Dropdown, MessageService } from 'primeng/primeng';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table } from 'primeng/table';

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
  Rate: number;
  Commodity: any;
  Scheme: any;
  SchemeOptions: SelectItem[];
  commodityOptions: SelectItem[];
  loading: boolean = false;
  blockScreen: Boolean;
  Hsncode: any;
  ActiveFlag: any;
  RowID: any;
  Tax: number;
  FinalDate: any;
  Remark: any;
  endedDate: any;
  CommodityValue: any;
  TaxValue: any;
  RateValue: any;
  filterArray: any;
  data: any;
  items: any;
  searchText: string;
  @ViewChild('scheme', { static: false }) SchemePanel: Dropdown;
  @ViewChild('commodity', { static: false }) CommodityPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private authService: AuthService, private datepipe: DatePipe, private TableConstant: TableConstants,
    private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.table.exportCSV();
        }
      },
      {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF();
        }
      }];
    this.loading = true;
    this.restApiService.get(PathConstants.RATE_MASTER_GET).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.RateMasterCols = this.TableConstant.RateMaster;
        this.RateMasterData = res;
        this.filterArray = res;
        this.RateMasterData.forEach(s => {
          s.EffectiveDate = this.datepipe.transform(s.EffectDate, 'dd/MM/yyyy');
          s.EndedDate = this.datepipe.transform(s.EndDate, 'dd/MM/yyyy');
          s.Rate = s.Rate.toFixed(4);
          s.TaxPercentage = s.TaxPercentage.toFixed(2);
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
                CommoditySelection.push({ 'label': s.AllotmentName, 'value': s.AllotmentCode, 'Hsncode': s.Hsncode });
              });
              CommoditySelection.unshift({ label: '-select-', value: null, disabled: true });
              this.commodityOptions = CommoditySelection;
            }
          });
        }
        if (this.Commodity !== undefined) {
          this.Hsncode = (this.Commodity.Hsncode !== undefined) ? this.Commodity.Hsncode : '';
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
    const params = {
      'Type': 1,
      'Scheme': this.Scheme,
      'Allotment': this.CommodityValue || this.Commodity.value,
    };
    this.restApiService.getByParameters(PathConstants.RATE_MASTER_GET, params).subscribe(res => {
      if (res.length === 0) {
        this.onSave();
      } else if (this.RowID !== undefined) {
        this.onSave();
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.RateExists
        });
      }
    });
  }

  onSave() {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'RowID': this.RowID || '',
      'ScCode': this.Scheme,
      'Allotment': this.CommodityValue || this.Commodity.value,
      'Rate': this.Rate,
      'EffectDate': this.FinalDate || this.effectiveDate,
      'EndDate': this.endDate,
      'CreatedDate': this.datepipe.transform(this.maxDate, 'MM/dd/yyyy'),
      'Remark': this.Remark,
      'Activeflag': (this.endDate !== undefined) ? 0 : 1,
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
    this.Commodity = selectedRow.AllotmentName;
    this.CommodityValue = selectedRow.AllotmentCode;
    this.Scheme = selectedRow.Scheme;
    this.Rate = selectedRow.Rate;
    this.RateValue = selectedRow.Rate;
    this.effectiveDate = selectedRow.EffectiveDate;
    this.FinalDate = selectedRow.EffectDate;
    this.endDate = selectedRow.EndedDate;
    this.endedDate = selectedRow.endDate;
    this.Remark = selectedRow.Remarks;
    this.Hsncode = selectedRow.Hsncode;
    this.Tax = selectedRow.TaxPercentage;
    this.TaxValue = selectedRow.TaxPercentage;
    this.ActiveFlag = selectedRow.Flag;
  }

  onView() {
    this.restApiService.get(PathConstants.RATE_MASTER_GET).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.RateMasterCols = this.TableConstant.RateMaster;
        this.RateMasterData = res;
        this.filterArray = res;
        this.RateMasterData.forEach(s => {
          s.EffectiveDate = this.datepipe.transform(s.EffectDate, 'dd/MM/yyyy');
          s.EndedDate = this.datepipe.transform(s.EndDate, 'dd/MM/yyyy');
          s.Rate = s.Rate.toFixed(4);
          s.TaxPercentage = s.TaxPercentage.toFixed(2);
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
    this.commodityOptions = this.SchemeOptions = this.Tax = this.FinalDate = this.CommodityValue = undefined;
  }

  onReset(item) {
    if (item === 'commodity') { this.Hsncode = undefined; }
  }

  onSearch(value) {
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
        return item.AllotmentName.toString().startsWith(value);
      });
    }
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.RateMasterCols;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.SlNo, element.AllotmentName, element.SchemeName, element.Hsncode, element.TaxPercentage, element.Rate,
      element.EffectiveDate, element.EndedDate, element.Remarks];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('RATE_MASTER.pdf');
  }
}