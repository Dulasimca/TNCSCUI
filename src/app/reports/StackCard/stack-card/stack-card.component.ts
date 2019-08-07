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

@Component({
  selector: 'app-stack-card',
  templateUrl: './stack-card.component.html',
  styleUrls: ['./stack-card.component.css']
})
export class StackCardComponent implements OnInit {
  StackCardCols: any;
  StackCardData: any;
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
        const params = {
          'GCode': this.g_cd.value,
          'StackDate': this.Year.label,
          'ICode': this.c_cd.value,
          'Type': 2
        }
        this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
          this.StackCardData = res;
          if (this.StackCardData !== undefined) {
            this.StackCardData.forEach(s => {
              StackSelection.push({ 'label': s.Stackno });
              this.stackOptions = StackSelection;
            })
          }
        })
    }
  }

  onView() {
    this.loading = true;
    const params = {
      'GCode': this.g_cd.value,
      'StackDate': this.Year.label,
      'ICode': this.c_cd.value,
      'Type': 2
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      this.StackCardData = res;
      let sno = 0;
      this.StackCardData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }
    )
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
}