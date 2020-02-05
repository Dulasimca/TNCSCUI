import { Component, OnInit } from '@angular/core';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GolbalVariable } from 'src/app/common/globalvariable';

@Component({
  selector: 'app-issue-gatepass',
  templateUrl: './issue-gatepass.component.html',
  styleUrls: ['./issue-gatepass.component.css']
})
export class IssueGatepassComponent implements OnInit {
  canShowMenu: boolean;
  DocNo: any;
  SelectedLorryNo: any;
  issueMemoLorryAbstractCols: any;
  issueMemoLorryAbstractData: any = [];
  issueLorryNoList: SelectItem[];
  RCode: string;
  GCode: string;
  godownName: string;
  regionName: string;
  userId: any;

  constructor(private restAPIService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
   }

  ngOnInit() {
    this.issueMemoLorryAbstractCols = this.tableConstants.IssueMemoLorryAbstractColumns;
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.userId = JSON.parse(this.authService.getCredentials());
    this.onLoadIssueLorryDetails();
  }

  onLoadIssueLorryDetails() {
    this.issueMemoLorryAbstractData = [];
    let issueLorrySelection = [];
    let gropuingArr = [];
    const params = new HttpParams().set('value', this.GCode).append('Type', '3');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res.Table !== undefined && res.Table.length !== 0 && res.Table !== null) {
        // construct object of unique values with keys
        let formObject = {};
        for (var i = 0; i < res.Table.length; i++) {
          formObject[res.Table[i].LorryNo] = 'LorryNo';
          formObject[res.Table[i].DocNo] = res.Table[i].LorryNo;
          formObject[res.Table[i].GatePassId] = res.Table[i].DocNo;
        }
        let array = Object.keys(formObject).reduce((acc, k) => {
          let values = formObject[k];
          acc[values] = acc[values] || [];
          acc[values].push(k);
          return acc;
        }, {});
        //End
        res.Table.forEach(x => {
          let value: string = '';
          if (array[x.LorryNo].length <= 1) {
            array[x.LorryNo].forEach(i => {
              value += i;
            })
          } else {
            array[x.LorryNo].forEach(i => {
              value += i + '~';
            })
           value = value.slice(0, value.length - 1);
          }
          gropuingArr.push({ label: x.LorryNo, value: value, gatepassNo: x.GatePassId })
        })
        //Get distinct values from an array
        var LorryNo = Array.from(new Set(gropuingArr.map((item: any) => item.label)));
        var DocNo = Array.from(new Set(gropuingArr.map((item: any) => item.value)));
        var gId = Array.from(new Set(gropuingArr.map((item: any) => item.gatepassNo)));
        for (var index in LorryNo && DocNo) {
        issueLorrySelection.push({ label: LorryNo[index], value: DocNo[index], gatePassID: gId[index] });
        }
        //End
        this.issueLorryNoList = issueLorrySelection;
        this.issueLorryNoList.unshift({ label: '-select-', value: null });
      } else {
         this.issueLorryNoList = [];
         this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.issueLorryNoList = [];
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.message });
      }
    });
  }

  onChangeLorryNo() {
    if(this.SelectedLorryNo !== null && this.SelectedLorryNo !== undefined 
      && this.SelectedLorryNo.value !== undefined && this.SelectedLorryNo.value !== null)  {
    const params = {
      'DocNumber':this.SelectedLorryNo.value,
      'GName': this.godownName,
      'RName': this.regionName,
      'GCode': this.GCode,
      'GatePassNo': this.SelectedLorryNo.gatePassID,
      'UserID': this.userId.user
    };
    this.restAPIService.post(PathConstants.STOCK_ISSUE_GATEPASS_POST, params).subscribe((res: any) => {
      if(res.Item3.length !== 0 && res.Item3 !== null && res.Item3 !== undefined) {
        this.issueMemoLorryAbstractData = JSON.parse(res.Item3);
        let sno = 1;
        this.issueMemoLorryAbstractData.forEach(x => {
          x.SlNo = sno;
          x.SIDate = this.datepipe.transform(x.SIDate, 'dd/MM/yyyy');
          sno += 1;
        })
      } else {
        this.issueMemoLorryAbstractData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.issueMemoLorryAbstractData = [];
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.message });
      }
    });
  }
  }

  onView() { }

  onPrintAbstract() {
    const params = { 
      'GatePassNo': this.SelectedLorryNo.gatePassID,
      'GCode': this.GCode
    }
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode + GolbalVariable.IssueMemoGatePass;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
    this.restAPIService.put(PathConstants.STOCK_ISSUE_GATEPASS_PUT, params).subscribe(res => {
      
    })
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
