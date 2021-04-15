import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-pds-liftment-report',
  templateUrl: './pds-liftment-report.component.html',
  styles: [`
  .loading-text {
      display: block;
      background-color: #f1f1f1;
      min-height: 19px;
      animation: pulse 1s infinite ease-in-out;
      text-indent: -99999px;
      overflow: hidden;
  }
`],
  styleUrls: ['./pds-liftment-report.component.css']
})
export class PdsLiftmentReportComponent implements OnInit {

  PDSLiftmentData: any = [];
  PDSLiftmentCols: any;
  frozenPDSLiftmentCols: any;
  Date: Date = new Date();
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  userId: any;
  yearRange: string;
  AllotmentPeriod: Date;
  viewPane: boolean;
  frozenPDSLiftmentGodownCols: any;
  GodownPDSDetailData: any = [];

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService,
    private messageService: MessageService, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.PDSLiftmentCols = this.tableConstants.PDSLiftmentColumns;
    this.frozenPDSLiftmentCols = this.tableConstants.FrozenPDSLiftmentColumns;
    this.frozenPDSLiftmentGodownCols = this.tableConstants.FrozenPDSLiftmentGodownColumns;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 10) + ':' + this.maxDate.getFullYear();
    this.AllotmentPeriod = new Date();
  }

  onView() {
    this.loading = true;
    const month = this.AllotmentPeriod.getMonth() + 1;
    const params = {
      Date: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
      Month: (month <= 9) ? '0' + month : month,
      Year: this.AllotmentPeriod.getFullYear(),
      DocType: 1
    };
    this.restAPIService.post(PathConstants.PDS_LIFTMENT_POST, params).subscribe(res => {
      let tempData = [];
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(x => {
          if (x.RCode !== null && x.RCode !== undefined) {
            tempData.push(x);
          }
        })
        this.PDSLiftmentData = tempData;
        let j = 0;
        for (let i = 0; i <= tempData.length - 1; i++) {
          let allotQty: any = (tempData[i].AllotmentQty !== null && tempData[i].AllotmentQty !== undefined) ? ((tempData[i].AllotmentQty * 1) / 1000).toFixed(3) : 0;
          allotQty = (allotQty * 1)
          let issueQty: any = (tempData[i].IssueQty !== null && tempData[i].IssueQty !== undefined) ? ((tempData[i].IssueQty * 1) / 1000).toFixed(3) : 0;
          issueQty = (issueQty * 1);
          const rcodePrev = tempData[i - 1] !== undefined ? tempData[i - 1].RCode : '';
          const rcode = (rcodePrev !== '') ? tempData[i].RCode : '';
          const rcodeNext = (tempData[i + 1] !== undefined) ? tempData[i + 1].RCode : '';
          if (tempData[i].RCode === rcodeNext || rcodePrev === rcode || rcodeNext === '') {
            this.PDSLiftmentData[j].Name = tempData[i].RName;
            this.PDSLiftmentData[j].RCode = tempData[i].RCode;
            this.PDSLiftmentData[j].slno = j + 1;
            switch (tempData[i].allotmentgroup) {
              case 'PALMOIL':
                this.PDSLiftmentData[j].AllotmentOil = (tempData[i].AllotmentQty !== undefined && tempData[i].AllotmentQty !== null)
                  ? (tempData[i].AllotmentQty * 1) : 0;
                this.PDSLiftmentData[j].LiftedOil = (tempData[i].IssueQty !== undefined && tempData[i].IssueQty !== null)
                  ? (tempData[i].IssueQty * 1) : 0;
                this.PDSLiftmentData[j].BalanceOil = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null) ?
                  tempData[i].BalanceQty : 0;
                this.PDSLiftmentData[j].AvailableOil = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null) ?
                  tempData[i].ClosingBalance : 0;
                const percentOil = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.PDSLiftmentData[j].PercentNoOil = percentOil.toFixed(0);
                this.PDSLiftmentData[j].PercentOil = percentOil.toFixed(0) + '%';
                break;
              case 'RICE':
                this.PDSLiftmentData[j].AllotmentRice = allotQty;
                this.PDSLiftmentData[j].LiftedRice = issueQty;
                this.PDSLiftmentData[j].BalanceRice = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.PDSLiftmentData[j].AvailableRice = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentRice = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.PDSLiftmentData[j].PercentNoRice = percentRice.toFixed(0);
                this.PDSLiftmentData[j].PercentRice = percentRice.toFixed(0) + '%';
                break;
              case 'SUGAR':
                this.PDSLiftmentData[j].AllotmentSugar = allotQty
                this.PDSLiftmentData[j].LiftedSugar = issueQty
                this.PDSLiftmentData[j].BalanceSugar = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.PDSLiftmentData[j].AvailableSugar = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentSugar = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.PDSLiftmentData[j].PercentNoSugar = percentSugar.toFixed(0);
                this.PDSLiftmentData[j].PercentSugar = percentSugar.toFixed(0) + '%';
                break;
              case 'WHEAT':
                this.PDSLiftmentData[j].AllotmentWheat = allotQty
                this.PDSLiftmentData[j].LiftedWheat = issueQty
                this.PDSLiftmentData[j].BalanceWheat = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.PDSLiftmentData[j].AvailableWheat = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentWheat = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.PDSLiftmentData[j].PercentNoWheat = percentWheat.toFixed(0);
                this.PDSLiftmentData[j].PercentWheat = percentWheat.toFixed(0) + '%';
                break;
              case 'TOORDHALL':
                this.PDSLiftmentData[j].AllotmentDhall = allotQty
                this.PDSLiftmentData[j].LiftedDhall = issueQty
                this.PDSLiftmentData[j].BalanceDhall = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.PDSLiftmentData[j].AvailableDhall = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentDhall = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.PDSLiftmentData[j].PercentNoDhall = percentDhall.toFixed(0);
                this.PDSLiftmentData[j].PercentDhall = percentDhall.toFixed(0) + '%';
                break;
            }
          }
          if (tempData[i].RCode !== rcodeNext) {
            j += 1;
          }
        }
        this.PDSLiftmentData = this.PDSLiftmentData.slice(0, j);
        this.PDSLiftmentData = this.calculateTotal(this.PDSLiftmentData);
        this.loading = false;
      } else {
        this.loading = false;
        this.PDSLiftmentData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.PDSLiftmentData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  viewGodownBreakdown(data) {
    this.GodownPDSDetailData.length = 0;
    this.viewPane = true;
    this.loading = true;
    const month = this.AllotmentPeriod.getMonth() + 1;
    const params = {
      Date: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
      Month: (month <= 9) ? '0' + month : month,
      Year: this.AllotmentPeriod.getFullYear(),
      RCode: data.RCode
    };
    this.restAPIService.getByParameters(PathConstants.PDS_LIFTMENT_GET, params).subscribe(res => {
      let tempData = [];
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(x => {
          if (x.GCode !== null && x.GCode !== undefined) {
            tempData.push(x);
          }
        })
        this.GodownPDSDetailData = tempData;
        let j = 0;
        for (let i = 0; i <= tempData.length - 1; i++) {
          let allotQty: any = (tempData[i].AllotmentQty !== null && tempData[i].AllotmentQty !== undefined) ? ((tempData[i].AllotmentQty * 1) / 1000).toFixed(3) : 0;
          allotQty = (allotQty * 1)
          let issueQty: any = (tempData[i].IssueQty !== null && tempData[i].IssueQty !== undefined) ? ((tempData[i].IssueQty * 1) / 1000).toFixed(3) : 0;
          issueQty = (issueQty * 1);
          const gcodePrev = tempData[i - 1] !== undefined ? tempData[i - 1].GCode : '';
          const gcode = (gcodePrev !== '') ? tempData[i].GCode : '';
          const gcodeNext = (tempData[i + 1] !== undefined) ? tempData[i + 1].GCode : '';
          if (tempData[i].GCode === gcodeNext || gcodePrev === gcode || gcodeNext === '') {
            this.GodownPDSDetailData[j].Name = tempData[i].GName1;
            this.GodownPDSDetailData[j].GCode = tempData[i].GCode;
            this.GodownPDSDetailData[j].slno = j + 1;
            switch (tempData[i].allotmentgroup) {
              case 'PALMOIL':
                this.PDSLiftmentData[j].AllotmentOil = (tempData[i].AllotmentQty !== undefined && tempData[i].AllotmentQty !== null)
                  ? (tempData[i].AllotmentQty * 1) : 0;
                this.PDSLiftmentData[j].LiftedOil = (tempData[i].IssueQty !== undefined && tempData[i].IssueQty !== null)
                  ? (tempData[i].IssueQty * 1) : 0;
                this.GodownPDSDetailData[j].BalanceOil = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? (tempData[i].BalanceQty * 1) : 0;
                this.GodownPDSDetailData[j].AvailableOil = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? (tempData[i].ClosingBalance * 1) : 0;
                const percentOil = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.GodownPDSDetailData[j].PercentNoOil = percentOil.toFixed(0);
                this.GodownPDSDetailData[j].PercentOil = percentOil.toFixed(0) + '%';
                break;
              case 'RICE':
                this.GodownPDSDetailData[j].AllotmentRice = allotQty;
                this.GodownPDSDetailData[j].LiftedRice = issueQty;
                this.GodownPDSDetailData[j].BalanceRice = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.GodownPDSDetailData[j].AvailableRice = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentRice = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.GodownPDSDetailData[j].PercentNoRice = percentRice.toFixed(0);
                this.GodownPDSDetailData[j].PercentRice = percentRice.toFixed(0) + '%';
                break;
              case 'SUGAR':
                this.GodownPDSDetailData[j].AllotmentSugar = allotQty;
                this.GodownPDSDetailData[j].LiftedSugar = issueQty;
                this.GodownPDSDetailData[j].BalanceSugar = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.GodownPDSDetailData[j].AvailableSugar = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentSugar = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.GodownPDSDetailData[j].PercentNoSugar = percentSugar.toFixed(0);
                this.GodownPDSDetailData[j].PercentSugar = percentSugar.toFixed(0) + '%';
                break;
              case 'WHEAT':
                this.GodownPDSDetailData[j].AllotmentWheat = allotQty;
                this.GodownPDSDetailData[j].LiftedWheat = issueQty;
                this.GodownPDSDetailData[j].BalanceWheat = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.GodownPDSDetailData[j].AvailableWheat = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentWheat = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.GodownPDSDetailData[j].PercentNoWheat = percentWheat.toFixed(0);
                this.GodownPDSDetailData[j].PercentWheat = percentWheat.toFixed(0) + '%';
                break;
              case 'TOORDHALL':
                this.GodownPDSDetailData[j].AllotmentDhall = allotQty;
                this.GodownPDSDetailData[j].LiftedDhall = issueQty;
                this.GodownPDSDetailData[j].BalanceDhall = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                  ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                this.GodownPDSDetailData[j].AvailableDhall = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                  ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                const percentDhall = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                this.GodownPDSDetailData[j].PercentNoDhall = percentDhall.toFixed(0);
                this.GodownPDSDetailData[j].PercentDhall = percentDhall.toFixed(0) + '%';
                break;
            }
          }
          if (tempData[i].GCode !== gcodeNext) {
            j += 1;
          }
        }
        this.GodownPDSDetailData = this.GodownPDSDetailData.slice(0, j);
        this.GodownPDSDetailData = this.calculateTotal(this.GodownPDSDetailData);
        this.loading = false;
      } else {
        this.loading = false;
        this.GodownPDSDetailData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.GodownPDSDetailData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    })
  }

  calculateTotal(data) {
    ///Grand Total
    let TotalAllotmentRice = 0;
    let TotalLiftedRice = 0;
    let TotalBalanceRice = 0;
    let TotalAvailableRice = 0;
    let TotalPercentRice = 0;
    let TotalAllotmentSugar = 0;
    let TotalLiftedSugar = 0;
    let TotalBalanceSugar = 0;
    let TotalAvailableSugar = 0;
    let TotalPercentSugar = 0;
    let TotalAllotmentWheat = 0;
    let TotalLiftedWheat = 0;
    let TotalBalanceWheat = 0;
    let TotalAvailableWheat = 0;
    let TotalPercentWheat = 0;
    let TotalAllotmentOil = 0;
    let TotalLiftedOil = 0;
    let TotalBalanceOil = 0;
    let TotalAvailableOil = 0;
    let TotalPercentOil = 0;
    let TotalAllotmentDhall = 0;
    let TotalLiftedDhall = 0;
    let TotalBalanceDhall = 0;
    let TotalAvailableDhall = 0;
    let TotalPercentDhall = 0;
    data.forEach(i => {
      TotalAllotmentRice += (i.AllotmentRice !== undefined && i.AllotmentRice !== null) ? (i.AllotmentRice * 1) : 0;
      TotalLiftedRice += (i.LiftedRice !== undefined && i.LiftedRice !== null) ? (i.LiftedRice * 1) : 0;
      TotalBalanceRice += (i.BalanceRice !== undefined && i.BalanceRice !== null) ? (i.BalanceRice * 1) : 0;
      TotalAvailableRice += (i.AvailableRice !== undefined && i.AvailableRice !== null) ? (i.AvailableRice * 1) : 0;
      TotalPercentRice += (i.PercentNoRice !== undefined && i.PercentNoRice !== null) ? (i.PercentNoRice * 1) : 0;
      TotalAllotmentSugar += (i.AllotmentSugar !== undefined && i.AllotmentSugar !== null) ? (i.AllotmentSugar * 1) : 0;
      TotalLiftedSugar += (i.LiftedSugar !== undefined && i.LiftedSugar !== null) ? (i.LiftedSugar * 1) : 0;
      TotalBalanceSugar += (i.BalanceSugar !== undefined && i.BalanceSugar !== null) ? (i.BalanceSugar * 1) : 0;
      TotalAvailableSugar += (i.AvailableSugar !== undefined && i.AvailableSugar !== null) ? (i.AvailableSugar * 1) : 0;
      TotalPercentSugar += (i.PercentNoSugar !== undefined && i.PercentNoSugar !== null) ? (i.PercentNoSugar * 1) : 0;
      TotalAllotmentWheat += (i.AllotmentWheat !== undefined && i.AllotmentWheat !== null) ? (i.AllotmentWheat * 1) : 0;
      TotalLiftedWheat += (i.LiftedWheat !== undefined && i.LiftedWheat !== null) ? (i.LiftedWheat * 1) : 0;
      TotalBalanceWheat += (i.BalanceWheat !== undefined && i.BalanceWheat !== null) ? (i.BalanceWheat * 1) : 0;
      TotalAvailableWheat += (i.AvailableWheat !== undefined && i.AvailableWheat !== null) ? (i.AvailableWheat * 1) : 0;
      TotalPercentWheat += (i.PercentNoWheat !== undefined && i.PercentNoWheat !== null) ? (i.PercentNoWheat * 1) : 0;
      TotalAllotmentDhall += (i.AllotmentDhall !== undefined && i.AllotmentDhallv !== null) ? (i.AllotmentDhall * 1) : 0;
      TotalLiftedDhall += (i.LiftedDhall !== undefined && i.LiftedDhall !== null) ? (i.LiftedDhall * 1) : 0;
      TotalBalanceDhall += (i.BalanceDhall !== undefined && i.BalanceDhall !== null) ? (i.BalanceDhall * 1) : 0;
      TotalAvailableDhall += (i.AvailableDhall !== undefined && i.AvailableDhall !== null) ? (i.AvailableDhall * 1) : 0;
      TotalPercentDhall += (i.PercentNoDhall !== undefined && i.PercentNoDhall !== null) ? (i.PercentNoDhall * 1) : 0;
      TotalAllotmentOil += (i.AllotmentOil !== undefined && i.AllotmentOil !== null) ? (i.AllotmentOil * 1) : 0;
      TotalLiftedOil += (i.LiftedOil !== undefined && i.LiftedOil !== null) ? (i.LiftedOil * 1) : 0;
      TotalBalanceOil += (i.BalanceOil !== undefined && i.BalanceOil !== null) ? (i.BalanceOil * 1) : 0;
      TotalAvailableOil += (i.AvailableOil !== undefined && i.AvailableOil !== null) ? (i.AvailableOil * 1) : 0;
      TotalPercentOil += (i.PercentNoOil !== undefined && i.PercentNoOil !== null) ? (i.PercentNoOil * 1) : 0;
    })
    data.push({
      Name: 'Grand Total', AllotmentDhall: TotalAllotmentDhall.toFixed(3),
      AllotmentOil: TotalAllotmentOil, AllotmentWheat: TotalAllotmentWheat.toFixed(3),
      AllotmentSugar: TotalAllotmentSugar.toFixed(3), AllotmentRice: TotalAllotmentRice.toFixed(3),
      BalanceRice: TotalBalanceRice.toFixed(3), BalanceSugar: TotalBalanceSugar.toFixed(3),
      BalanceWheat: TotalBalanceWheat.toFixed(3), BalanceDhall: TotalBalanceDhall.toFixed(3),
      BalanceOil: TotalBalanceOil, AvailableRice: TotalAvailableRice.toFixed(3),
      AvailableSugar: TotalAvailableSugar.toFixed(3), AvailableWheat: TotalAvailableWheat.toFixed(3),
      AvailableDhall: TotalAvailableDhall.toFixed(3), AvailableOil: TotalAvailableOil,
      LiftedRice: TotalLiftedRice.toFixed(3), LiftedSugar: TotalLiftedSugar.toFixed(3),
      LiftedWheat: TotalLiftedWheat.toFixed(3), LiftedDhall: TotalLiftedDhall.toFixed(3),
      LiftedOil: TotalLiftedOil, PercentDhall: TotalPercentDhall + '%',
      PercentOil: TotalPercentOil + '%', PercentRice: TotalPercentRice + '%',
      PercentSugar: TotalPercentSugar + '%', PercentWheat: TotalPercentWheat + '%'
    })
    return data;
  }

  onResetTable(item) {
    this.PDSLiftmentData = [];
    this.loading = false;
  }

  exportExcel(value) {
    let data = [];
    let cols = [];
    const LiftmentData = (value === 1) ? this.PDSLiftmentData : this.GodownPDSDetailData;
    const frozenCols = (value === 1) ? this.tableConstants.FrozenPDSLiftmentColumns : this.tableConstants.FrozenPDSLiftmentGodownColumns;
    LiftmentData.forEach(el => {
      data.push({
        Name: el.Name, AllotmentRice: el.AllotmentRice, RiceLiftedToShops: (el.LiftedRice * 1),
        RiceBalanceToBeLifted: (el.BalanceRice * 1), AvailableRiceInTNCSCGodown: (el.AvailableRice * 1),
        PercentageOfRiceLiftment: el.PercentRice, AllotmentSugar: (el.AllotmentSugar * 1),
        SugarLiftedToShops: (el.LiftedSugar * 1), SugarBalanceToBeLifted: (el.BalanceSugar * 1),
        AvailableSugarInTNCSCGodown: (el.AvailableSugar * 1), PercentageOfSugarLiftment: el.PercentSugar,
        AllotmentWheat: (el.AllotmentWheat * 1), WheatLiftedToShops: (el.LiftedWheat * 1), WheatBalanceToBeLifted: (el.BalanceWheat * 1),
        AvailableWheatInTNCSCGodown: (el.AvailableWheat * 1), PercentageOfWheatLiftment: el.PercentWheat,
        AllotmentDhall: (el.AllotmentDhall * 1), DhallLiftedToShops: (el.LiftedDhall * 1), DhallBalanceToBeLifted: (el.BalanceDhall * 1),
        AvailableDhallInTNCSCGodown: (el.AvailableDhall * 1), PercentageOfDhallLiftment: el.PercentDhall,
        AllotmentOil: (el.AllotmentOil * 1), PalmoilLiftedToShops: (el.LiftedOil * 1), PalmoilBalanceToBeLifted: (el.BalanceOil * 1),
        AvailablePalmoilInTNCSCGodown: (el.AvailableOil * 1), PercentageOfPalmoilLiftment: el.PercentOil
      });
    });
    cols = frozenCols + this.tableConstants.PDSLiftmentColumns;
    const FileName = (value === 1) ? 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_REGION_WISE_REPORT' : 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_GODOWN_WISE_REPORT';
    this.excelService.exportAsExcelFile(data, FileName, cols);
  }

  onClose() {
    this.messageService.clear('t-err');
  }


}

