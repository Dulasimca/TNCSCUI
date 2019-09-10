import { Component, OnInit, ViewChild } from '@angular/core';
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
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-stack-card',
  templateUrl: './stack-card.component.html',
  styleUrls: ['./stack-card.component.css']
})
export class StackCardComponent implements OnInit {
  StackCardCols: any;
  StackCardData: any = [];
  data: any;
  GCode: any;
  ITCode: any;
  Year: any;
  TStockNo: any;
  userId: any;
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  stackOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') CommodityPanel: Dropdown;
  @ViewChild('stackYear') StackYearPanel: Dropdown;
  @ViewChild('stockNo') StockNoPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.StackCardCols = this.tableConstants.StackCard;
    this.data = this.roleBasedService.getInstance();
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let YearSelection = [];
    let commoditySelection = [];
    let StackSelection = [];
    switch (item) {
      case 'gd':
        if(type === 'enter') { this.GodownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
        break;
      case 'cd':
          if(type === 'enter') { this.CommodityPanel.overlayVisible = true; }
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
      case 'st_yr':
          if(type === 'enter') { this.StackYearPanel.overlayVisible = true; }
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
      case 'st_no':
          if(type === 'enter') { this.StockNoPanel.overlayVisible = true; }
          if (this.GCode.value !== undefined && this.GCode.value !== null && this.Year.label !== undefined && this.Year.label !== null
          && this.ITCode.value !== undefined && this.ITCode.value !== null) {
          const params = {
            'GCode': this.GCode.value,
            'StackDate': this.Year.label,
            'ICode': this.ITCode.value,
            'Type': 3
          }
          this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(s => {
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
      'GCode': this.GCode.value,
      'StackDate': this.TStockNo.value,
      'ICode': this.ITCode.value,
      'TStockNo': this.TStockNo.label,
      'Type': 4
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res) {
        this.StackCardData = res;
        let sno = 1;
        this.StackCardData.forEach(data => {
          data.SlNo = (data.AckDate !== 'Total') ? sno : '';
          data.AckDate = (data.AckDate).toString().replace('00:00:00', '');
          data.ReceiptQuantity = (data.ReceiptQuantity * 1).toFixed(3);
          data.IssuesQuantity = (data.IssuesQuantity * 1).toFixed(3);
          data.ClosingBalance = (data.ClosingBalance * 1).toFixed(3);
          sno += 1;
        });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }

    });
    this.loading = false;
  }

  onResetTable() {
    this.StackCardData = [];
  }

  exportAsXLSX(): void {
    var StackCardData = [];
    this.StackCardData.forEach(data => {
      StackCardData.push({
        SlNo: data.SlNo, AckDate: data.AckDate, ReceiptBags: data.ReceiptBags,
        ReceiptQuantity: data.ReceiptQuantity, IssuesBags: data.IssuesBags,
        IssuesQuantity: data.IssuesQuantity, ClosingBalance: data.ClosingBalance })
    })
    this.excelService.exportAsExcelFile(StackCardData, 'STACK_CARD_REPORT', this.StackCardCols);
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.StackCardDetailsReport + ".txt";
    saveAs(path + filename, filename);
   }
}