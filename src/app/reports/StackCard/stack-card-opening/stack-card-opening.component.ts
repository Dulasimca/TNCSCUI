import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Router } from '@angular/router';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stack-card-opening',
  templateUrl: './stack-card-opening.component.html',
  styleUrls: ['./stack-card-opening.component.css']
})
export class StackCardOpeningComponent implements OnInit {
  StackCardCols: any;
  StackCardData: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  c_cd: any;
  tr_cd: any;
  StackDate: any;
  ICode: any;
  godownOptions: SelectItem[];
  transactionOptions: SelectItem[];
  commodityOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isActionDisabled = true;
    this.StackCardCols = this.tableConstants.StackCardOpening;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let godownSelection = [];
    let transactionSelection = [];
    let commoditySelection = [];
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
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactionSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactionSelection;
              });
            }
          })
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
    }
  }

  onView() {
    this.loading = true;
    const params = {
      'GCode': this.g_cd.value,
      'StackDate':  this.StackDate,
      'ICode': this.ICode, 
      'TRCode': this.tr_cd.value,
    }
    this.restAPIService.post(PathConstants.STACK_CARD_OPENING_GET, params).subscribe(res => {
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
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.router.navigate(['pageNotFound']);
      }
    })
  }

  onResetTable() {
    this.StackCardData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var StackData = [];
    this.StackCardData.forEach(data => {
      StackData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Ackno: data.Ackno,
        Date: data.Date, Commodity: data.Commodity, Bags_No: data.Bags_No, Quantity: data.Quantity, RecdFrom: data.RecdFrom,
        Lorryno: data.Lorryno, TruckMemoNo: data.TruckMemoNo, Truckmemodate: data.Truckmemodate, Orderno: data.Orderno
      })
    })
    this.excelService.exportAsExcelFile(StackData, 'STACK_CARD_OPENING_REPORT', this.StackCardCols);
  }
}