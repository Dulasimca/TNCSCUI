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
    private messageService: MessageService, private excelService: ExcelService) { }

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
        this.PDSLiftmentData = res;
        let j = 0;
        for(let i = 0; i <= res.length - 1; i++) {
          let allotQty: any = (res[i].AllotmentQty !== null && res[i].AllotmentQty !== undefined) ? ((res[i].AllotmentQty * 1) / 1000).toFixed(3) : 0;
          allotQty = (allotQty * 1)
          let issueQty: any = (res[i].IssueQty !== null && res[i].IssueQty !== undefined) ? ((res[i].IssueQty * 1) / 1000).toFixed(3) : 0;
          issueQty = (issueQty * 1);
          const rcodePrev = res[i-1] !== undefined ? res[i-1].RCode : '';
          const rcode = (rcodePrev !== '') ? res[i].RCode : '';
          const rcodeNext = (res[i+1] !== undefined) ? res[i+1].RCode : '';
                if(res[i].RCode === rcodeNext || rcodePrev === rcode || rcodeNext === '') {
            this.PDSLiftmentData[j].RName = res[i].RName;
            this.PDSLiftmentData[j].slno = j+1;
               switch(res[i].allotmentgroup)
          {
          case 'PALMOIL':
            this.PDSLiftmentData[j].AllotmentOil = res[i].AllotmentQty;
            this.PDSLiftmentData[j].LiftedOil = res[i].IssueQty;
            this.PDSLiftmentData[j].BalanceOil = res[i].BalanceQty;
            this.PDSLiftmentData[j].AvailableOil = res[i].ClosingBalance;
            const percentOil = (allotQty === 0) ? 0 :(isNaN( issueQty/ allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentOil = percentOil.toFixed(0) + '%';
            break;
          case 'RICE':
            this.PDSLiftmentData[j].AllotmentRice = ((res[i].AllotmentQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].LiftedRice = ((res[i].IssueQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].BalanceRice = ((res[i].BalanceQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].AvailableRice = ((res[i].ClosingBalance * 1) / 1000).toFixed(3);
            const percentRice = (allotQty === 0) ? 0 :(isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentRice = percentRice.toFixed(0) + '%';
            break;
          case 'SUGAR':
            this.PDSLiftmentData[j].AllotmentSugar = ((res[i].AllotmentQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].LiftedSugar = ((res[i].IssueQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].BalanceSugar = ((res[i].BalanceQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].AvailableSugar = ((res[i].ClosingBalance * 1) / 1000).toFixed(3);
            const percentSugar = (allotQty === 0) ? 0 :(isNaN(issueQty / allotQty) ? 0 :(issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentSugar = percentSugar.toFixed(0) + '%';
            break;
          case 'WHEAT':
            this.PDSLiftmentData[j].AllotmentWheat = ((res[i].AllotmentQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].LiftedWheat = ((res[i].IssueQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].BalanceWheat = ((res[i].BalanceQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].AvailableWheat = ((res[i].ClosingBalance * 1) / 1000).toFixed(3);
            const percentWheat = (allotQty === 0) ? 0 :(isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentWheat = percentWheat.toFixed(0) + '%';
            break;
          case 'TOORDHALL':
            this.PDSLiftmentData[j].AllotmentDhall = ((res[i].AllotmentQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].LiftedDhall = ((res[i].IssueQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].BalanceDhall = ((res[i].BalanceQty * 1) / 1000).toFixed(3);
            this.PDSLiftmentData[j].AvailableDhall = ((res[i].ClosingBalance * 1) / 1000).toFixed(3);
            const percentDhall = (allotQty === 0) ? 0 :(isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentDhall = percentDhall.toFixed(0) + '%';
            break;
        }
          } 
            if(res[i].RCode !== rcodeNext) {
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
          RName: el.RName, AllotmentRice: el.AllotmentRice, RiceLiftedToShops: (el.LiftedRice * 1),
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
      cols = this.tableConstants.FrozenPDSLiftmentColumns + this.tableConstants.PDSLiftmentColumns;
      this.excelService.exportAsExcelFile(data, 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_REPORT', cols);
    }
    
    onClose() {
      this.messageService.clear('t-err');
    }


}

