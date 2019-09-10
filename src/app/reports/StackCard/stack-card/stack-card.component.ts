import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService, SelectItem } from 'primeng/api';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-stack-card',
  templateUrl: './stack-card.component.html',
  styleUrls: ['./stack-card.component.css']
})
export class StackCardComponent implements OnInit {
  StackCardCols: any;
  StackCardData: any;
  StackCardNoData: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  c_cd: any;
  Year: any;
  s_cd: any;
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  stackOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isActionDisabled = true;
    this.StackCardCols = this.tableConstants.StackCard;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let godownSelection = [];
    let YearSelection = [];
    let commoditySelection = [];
    let StackSelection = [];
    switch (item) {
      case 'gd':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
        break;
      case 'cd':
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
        }
        break;
      case 'y':
        if (this.YearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ 'label': y.ShortYear });
                this.YearOptions = YearSelection;
              });
            }
          })
        }
        break;
      case 's':
        if (this.g_cd.value !== undefined && this.g_cd.value !== null && this.Year.label !== undefined && this.Year.label !== null
          && this.c_cd.value !== undefined && this.c_cd.value !== null) {
          const params = {
            'GCode': this.g_cd.value,
            'StackDate': this.Year.label,
            'ICode': this.c_cd.value,
            'Type': 3
          }
          this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
            this.StackCardNoData = res;
            if (this.StackCardNoData !== undefined) {
              this.StackCardNoData.forEach(s => {
                StackSelection.push({ 'label': s.StackNo, 'value': s.StackDate });
                this.stackOptions = StackSelection;
              })
            }
          })
        }
        else {
          this.stackOptions = StackSelection;
        }

    }
  }

  onView() {
    this.loading = true;
    const params = {
      'GCode': this.g_cd.value,
      'StackDate': this.s_cd.value,
      'ICode': this.c_cd.value,
      'TStockNo': this.s_cd.label,
      'Type': 4
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {

      if (res) {
        this.StackCardData = res;
        this.StackCardData.forEach(data => {
          data.AckDate = (data.AckDate !== 'Total') ? this.datePipe.transform(data.AckDate, 'dd-MM-yyyy') : data.AckDate;
          data.ReceiptQuantity = (data.ReceiptQuantity * 1).toFixed(3);
          data.IssuesQuantity = (data.IssuesQuantity * 1).toFixed(3);
          data.ClosingBalance = (data.ClosingBalance * 1).toFixed(3);

        });
        this.isActionDisabled = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }

    });
    this.loading = false;
  }

  onResetTable() {
    this.StackCardData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var StackCardData = [];
    this.StackCardData.forEach(data => {
      StackCardData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Ackno: data.Ackno,
        Date: data.Date, Commodity: data.Commodity, Bags_No: data.Bags_No, Quantity: data.Quantity, RecdFrom: data.RecdFrom,
        Lorryno: data.Lorryno, TruckMemoNo: data.TruckMemoNo, Truckmemodate: data.Truckmemodate, Orderno: data.Orderno
      })
    })
    this.excelService.exportAsExcelFile(StackCardData, 'STACK_CARD_REPORT', this.StackCardCols);
  }

  onPrint() { }
}