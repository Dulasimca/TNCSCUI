import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-stack-card-opening',
  templateUrl: './stack-card-opening.component.html',
  styleUrls: ['./stack-card-opening.component.css']
})
export class StackCardOpeningComponent implements OnInit {
  StackCardOpeningCols: any;
  StackCardOpeningData: any = [];
  data: any;
  GCode: any;
  ITCode: any;
  RCode: any;
  Year: any;
  regions: any;
  roleId: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') CommodityPanel: Dropdown;
  @ViewChild('stackYear') StackYearPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.StackCardOpeningCols = this.tableConstants.StackCardOpening;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let YearSelection = [];
    let regionSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') {
          this.RegionPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.regions = this.roleBasedService.instance;
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            for (let i = 0; i < regionSelection.length - 1;) {
              if (regionSelection[i].value === regionSelection[i + 1].value) {
                regionSelection.splice(i + 1, 1);
              }
            }
          }
          this.regionOptions = regionSelection;
        } else {
          this.regions = this.roleBasedService.regionsData;
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'y':
        if (type === 'enter') {
          this.StackYearPanel.overlayVisible = true;
        }
        if (this.YearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ 'label': y.ShortYear, 'value': y.ShortYear });
                this.YearOptions = YearSelection;
              });
            }
          })
        }
        break;
      case 'cd':
        if (type === 'enter') {
          this.CommodityPanel.overlayVisible = true;
        }
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
      'GCode': this.GCode,
      'StackDate': this.Year,
      'ICode': this.ITCode,
      'Type': 2
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.StackCardOpeningData = res;
        this.loading = false;
        let sno = 0;
        this.StackCardOpeningData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        })
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
    })
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.StackCardOpeningData = [];
  }

  exportAsXLSX(): void {
    var StackData = [];
    this.StackCardOpeningData.forEach(data => {
      StackData.push({
        SlNo: data.SlNo, Stackno: data.Stackno, StackBalanceBags: data.StackBalanceBags, Stackbalanceweight: data.Stackbalanceweight,
        Date: data.obstackdate, Formationyear: data.Formationyear, Status: data.Status
      })
    })
    this.excelService.exportAsExcelFile(StackData, 'STACK_CARD_OPENING_REPORT', this.StackCardOpeningCols);
  }

  onPrint() { }
}