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

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService,
    private excelService: ExcelService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.PDSLiftmentCols = this.tableConstants.PDSLiftmentColumns;
    this.frozenPDSLiftmentCols = this.tableConstants.FrozenPDSLiftmentColumns;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onView() {
    this.loading = true;
    const month = this.Date.getMonth() + 1;
    const params = {
      Date: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
      Month: (month <= 9) ? '0' + month : month,
      Year: this.Date.getFullYear(),
      DocType: 1
    };
    this.restAPIService.post(PathConstants.PDS_LIFTMENT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        let sno = 0;
        this.PDSLiftmentData = res;
        let j = 0;
        for(let i = 0; i <= res.length - 1; i++) {
          const allotQty: number = (res[i].AllotmentQty !== null) ? (res[i].AllotmentQty * 1) : 0;
          const rcode = res[i-1] !== undefined ? res[i-1].RCode : '';
          const rcode1 = (rcode !== '') ? res[i].RCode : '';
          const rcode2 = (res[i+1] !== undefined) ? res[i+1].RCode : '';
                if(res[i].RCode === rcode2 || rcode === rcode1) {
            this.PDSLiftmentData[j].RName = res[i].RName;
            this.PDSLiftmentData[j].slno = j+1;
               switch(res[i].allotmentgroup)
          {
          case 'PALMOIL':
            this.PDSLiftmentData[j].AllotmentOil = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedOil = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceOil = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableOil = res[i].ClosingBalance;
            const percentOil = isNaN((res[i].IssueQty * 1) / allotQty) ? 0 : ((res[i].IssueQty * 1) / allotQty) * 100;
            this.PDSLiftmentData[j].PercentOil = percentOil + '%';
            break;
          case 'RICE':
            this.PDSLiftmentData[j].AllotmentRice = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedRice = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceRice = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableRice = res[i].ClosingBalance;
            const percentRice = isNaN((res[i].IssueQty * 1) / allotQty) ? 0 : ((res[i].IssueQty * 1) / allotQty) * 100;
            this.PDSLiftmentData[j].PercentRice = percentRice + '%';
            break;
          case 'SUGAR':
            this.PDSLiftmentData[j].AllotmentSugar = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedSugar = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceSugar = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableSugar = res[i].ClosingBalance;
            const percentSugar = isNaN((res[i].IssueQty * 1) / allotQty) ? 0 :((res[i].IssueQty * 1) / allotQty) * 100;
            this.PDSLiftmentData[j].PercentSugar = percentSugar + '%';
            break;
          case 'WHEAT':
            this.PDSLiftmentData[j].AllotmentWheat = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedWheat = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceWheat = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableWheat = res[i].ClosingBalance;
            const percentWheat = isNaN((res[i].IssueQty * 1) / allotQty) ? 0 : ((res[i].IssueQty * 1) / allotQty) * 100;
            this.PDSLiftmentData[j].PercentWheat = percentWheat + '%';
            break;
          case 'TOORDHALL':
            this.PDSLiftmentData[j].AllotmentDhall = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedDhall = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceDhall = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableDhall = res[i].ClosingBalance;
            const percentDhall = isNaN((res[i].IssueQty * 1) / allotQty) ? 0 : ((res[i].IssueQty * 1) / allotQty) * 100;
            this.PDSLiftmentData[j].PercentDhall = percentDhall + '%';
            break;
        }
          } 
            if(res[i].RCode !== rcode2) {
            j += 1; 
            }
        }
        this.PDSLiftmentData = this.PDSLiftmentData.slice(0, j);
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

  onResetTable(item) {
    this.PDSLiftmentData = [];
    this.loading = false;
  }

  exportExcel() {
    let data = [];
    let cols = [];
      this.PDSLiftmentData.forEach(el => {
        data.push({
          RName: el.RName, AllotmentRice: el.AllotmentRice, LiftedRice: (el.LiftedRice * 1),
          BalanceRice: (el.BalanceRice * 1), AvailableRice: (el.AvailableRice * 1), PercentRice: (el.PercentRice * 1),
          AllotmentSugar: (el.AllotmentSugar * 1), LiftedSugar: (el.LiftedSugar * 1), BalanceSugar: (el.BalanceSugar * 1),
          AvailableSugar: (el.AvailableSugar * 1), PercentSugar: (el.PercentSugar * 1),
          AllotmentWheat: (el.AllotmentWheat * 1), LiftedWheat: (el.LiftedWheat * 1), BalanceWheat: (el.BalanceWheat * 1),
          AvailableWheat: (el.AvailableWheat * 1), PercentWheat: (el.PercentWheat * 1),
          AllotmentDhall: (el.AllotmentDhall * 1), LiftedDhall: (el.LiftedDhall * 1), BalanceDhall: (el.BalanceDhall * 1),
          AvailableDhall: (el.AvailableDhall * 1), PercentDhall: (el.PercentDhall * 1),
          AllotmentOil: (el.AllotmentOil * 1), LiftedOil: (el.LiftedOil * 1), BalanceOil: (el.BalanceOil * 1),
          AvailableOil: (el.AvailableOil * 1), PercentOil: (el.PercentOil * 1)
        });
      });
      cols = this.tableConstants.FrozenPDSLiftmentColumns + this.tableConstants.PDSLiftmentColumns;
      this.excelService.exportAsExcelFile(data, 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS', cols);
    }


}

