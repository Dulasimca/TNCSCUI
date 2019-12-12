import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { Dropdown } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-stack-card',
  templateUrl: './stack-card.component.html',
  styleUrls: ['./stack-card.component.css']
})
export class StackCardComponent implements OnInit {
  StackCardCols: any;
  StackCardData: any = [];
  data: any;
  roleId: any;
  regions: any;
  GCode: any;
  RCode: any;
  ITCode: any;
  Year: any;
  TStockNo: any;
  userId: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  stackOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loggedInRCode: string;
  loading: boolean;
  selectedHeader: string;
  showPane: boolean;
  selectedRowCols: any;
  selectedRowData: any[] = [];
  totalRecords: number;
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') CommodityPanel: Dropdown;
  @ViewChild('stackYear') StackYearPanel: Dropdown;
  @ViewChild('stockNo') StockNoPanel: Dropdown;
  @ViewChild('table') Table: Table;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private authService: AuthService, private restAPIService: RestAPIService,
    private roleBasedService: RoleBasedService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.StackCardCols = this.tableConstants.StackCard;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.data = this.roleBasedService.getInstance();
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let YearSelection = [];
    let commoditySelection = [];
    let regionSelection = [];
    let StackSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.RegionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
          } else {
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          } else {
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ label: x.GName, value: x.GCode, rcode: x.RCode, rname: x.RName });
            }
          });
          this.godownOptions = godownSelection;
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'cd':
        if (type === 'enter') { this.CommodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ label: y.ITDescription, value: y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            } else {
              this.commodityOptions = commoditySelection;
            }
          })
        }
        break;
      case 'st_yr':
        if (type === 'enter') { this.StackYearPanel.overlayVisible = true; }
        if (this.YearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ label: y.ShortYear, value: y.ShortYear });
              });
              this.YearOptions = YearSelection;
            } else {
              this.YearOptions = YearSelection;
            }
          })
        }
        break;
      case 'st_no':
        if (type === 'enter') { this.StockNoPanel.overlayVisible = true; }
        if (this.GCode.value !== undefined && this.GCode.value !== null && this.Year !== undefined && this.Year !== null
          && this.ITCode.value !== undefined && this.ITCode.value !== null) {
          const params = {
            'GCode': this.GCode.value,
            'StackDate': this.Year,
            'ICode': this.ITCode.value,
            'Type': 3
          }
          this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(s => {
                StackSelection.push({ label: s.StackNo, value: s.StackDate });
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
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'StackDate': this.TStockNo.value,
      'ICode': this.ITCode.value,
      'ITName': this.ITCode.label,
      'TStockNo': this.TStockNo.label,
      'UserName': this.userId.user,
      'StackYear': this.Year,
      'Type': 4
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res) {
        this.StackCardData = res;
        this.loading = false;
        let sno = 1;
        this.StackCardData.forEach(data => {
          data.SlNo = (data.AckDate !== 'Total') ? sno : '';
          data.SDate = this.datepipe.transform(data.SDate, 'MM/dd/yyyy');
          data.AckDate = (data.AckDate).toString().replace('00:00:00', '');
          data.ReceiptBags = (data.ReceiptBags !== null && data.ReceiptBags !== undefined) ? (data.ReceiptBags * 1) : '-';
          data.IssuesBags = (data.IssuesBags !== null && data.IssuesBags !== undefined) ? (data.IssuesBags * 1) : '-';
          data.ReceiptQuantity = (data.ReceiptQuantity !== null && data.ReceiptQuantity !== undefined) ? (data.ReceiptQuantity * 1).toFixed(3) : '-';
          data.IssuesQuantity = (data.IssuesQuantity !== null && data.IssuesQuantity !== undefined) ? (data.IssuesQuantity * 1).toFixed(3) : '-';
          data.ClosingBalance = (data.ClosingBalance !== null && data.ClosingBalance !== undefined) ? (data.ClosingBalance * 1).toFixed(3) : '-';
          sno += 1;
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

  onFieldClick(data, type) {
    const params = {
      'DocumentDate': data.SDate,
      'GodownCode': this.GCode.value,
      'RegionCode': this.RCode.value
    }
    this.selectedRowCols = this.tableConstants.StackCardDocDetailsCols;
    this.Table.reset();
    if (type === '1' && (data.ReceiptQuantity !== '-') && ((data.ReceiptQuantity * 1) !== 0) && data.AckDate !== 'Total') {
      this.loading = true;
      this.selectedHeader = 'Receipt - Details';
      this.loadData(PathConstants.DAILY_DOCUMENT_RECEIPT_POST, params, type);
    } else if (type === '2' && (data.IssuesQuantity !== '-') && ((data.IssuesQuantity * 1) !== 0) && data.AckDate !== 'Total') {
      this.loading = true;
      this.selectedHeader = 'Issue - Details';
      this.loadData(PathConstants.DAILY_DOCUMENT_ISSUE_POST, params, type);
    } else {
      this.loading = false;
      this.showPane = false;
    }
  }

  loadData(path, params, type) {
    let totalBags = 0;
    let totalQty = 0;
    let sno = 1;
    this.restAPIService.post(path, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.showPane = true;
        this.loading = false;
        let filteredData = res.filter(x => {
          return (x.StackNo.trim() === this.TStockNo.label.trim());
        })
        filteredData.forEach(y => {
          y.CreatedDate = (type === '1') ? y.SRTime : y.SITime;
          totalBags += (y.NOOfPACKING * 1);
          totalQty += (y.NETWT * 1);
          y.SlNo = sno;
          sno += 1;
        })
        filteredData.push({ DocNo: 'Total', NOOfPACKING: totalBags, NETWT: totalQty });
        this.selectedRowData = filteredData;
        this.totalRecords = this.selectedRowData.length;
      } else {
        this.loading = false;
        this.showPane = false;
        this.totalRecords = 0;
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

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    else if(item === 'cd') { this.TStockNo = null ;}
    else if (item === 'st_yr') { this.TStockNo = null; }
    this.StackCardData = [];
    this.selectedRowData.length = 0;
    this.totalRecords = 0;
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.StackCardDetailsReport + ".txt";
    saveAs(path + filename, filename);
  }

  public getStyle(title: string, value: any, id: string): string {
    if(id === 'line') {
    return (((value * 1) !== 0 && value !== '-') && title !== 'Total') ? "underline" : "none";
    } else {
    return (((value * 1) !== 0 && value !== '-') && title !== 'Total') ? "#1377b9" : "black";
    }
  }
}