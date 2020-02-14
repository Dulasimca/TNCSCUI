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
import { Observable } from 'rxjs';

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
  issueGatePassCols: any;
  issueGatePassData: any = [];
  viewDate: Date = new Date();
  viewPane: boolean;
  SelectedGatePassNo: any;
  gatePassNoList: SelectItem[];
  loading: boolean;

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
    if (this.SelectedLorryNo !== null && this.SelectedLorryNo !== undefined
      && this.SelectedLorryNo.value !== undefined && this.SelectedLorryNo.value !== null) {
      this.loading = true;
      const params = {
        'DocNumber': this.SelectedLorryNo.value,
        'GName': this.godownName,
        'RName': this.regionName,
        'GCode': this.GCode,
        'GatePassNo': this.SelectedLorryNo.gatePassID,
        'UserID': this.userId.user,
        'Type': 1
      };
      this.restAPIService.post(PathConstants.STOCK_ISSUE_GATEPASS_POST, params).subscribe((res: any) => {
        if (res.Item3.length !== 0 && res.Item3 !== null && res.Item3 !== undefined) {
          var data = JSON.parse(res.Item3);
          ///Distinct data from an array
          const obtainDistinctData = Array.from(new Set(data.map(x => x.SINo))).map(SINo => {
            return{
              SINo: SINo,
              SIDate: data.find(y => y.SINo === SINo).SIDate,
              LorryNo: data.find(y => y.SINo === SINo).LorryNo,
              ReceivorName: data.find(y => y.SINo === SINo).ReceivorName,
            }
          })
          this.issueMemoLorryAbstractData = obtainDistinctData;
          let sno = 1;
          this.issueMemoLorryAbstractData.forEach(x => {
            x.SlNo = sno;
            x.SIDate = this.datepipe.transform(x.SIDate, 'dd/MM/yyyy');
            sno += 1;
          })
          this.loading = false;
        } else {
          this.loading = false;
          this.issueMemoLorryAbstractData = [];
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        this.issueMemoLorryAbstractData = [];
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.message });
        }
      });
    } else {
      this.loading = false;
      this.issueMemoLorryAbstractData = [];
    }
  }

  onView() {
    this.viewPane = true;
    this.issueGatePassCols = this.tableConstants.IssueMemoLorryAbstractColumns;
    this.onDateChanges();
  }

  onDateChanges() {
    let issueGatePassSelection = [];
    let distinctArr = [];
    if (this.viewDate !== null && this.viewDate !== undefined && this.viewDate.toDateString() !== '') {
      const params = new HttpParams().set('GCode', this.GCode).append('DocDate', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy'));
      this.restAPIService.getByParameters(PathConstants.ISSUE_MEMO_GATE_PASS_GET, params).subscribe(res => {
        if (res.length !== 0 && res !== null && res !== undefined) {
          // construct object of unique values with keys
          let formObject = {};
          for (var i = 0; i < res.length; i++) {
            formObject[res[i].GatePassId] = 'GatePassId';
            formObject[res[i].DocumentNumber] = res[i].GatePassId;
          }
          let array = Object.keys(formObject).reduce((acc, k) => {
            let values = formObject[k];
            acc[values] = acc[values] || [];
            acc[values].push(k);
            return acc;
          }, {});
          //End
          res.forEach(x => {
            let value: string = '';
            if (array[x.GatePassId].length <= 1) {
              array[x.GatePassId].forEach(i => {
                value += i;
              })
            } else {
              array[x.GatePassId].forEach(i => {
                value += i + '~';
              })
              value = value.slice(0, value.length - 1);
            }
            distinctArr.push({ label: x.GatePassId, value: value })
          })
          //Get distinct values from an array
          var GatePassId = Array.from(new Set(distinctArr.map((item: any) => item.label)));
          var DocNo = Array.from(new Set(distinctArr.map((item: any) => item.value)));
          for (var index in GatePassId && DocNo) {
            issueGatePassSelection.push({ label: GatePassId[index], value: DocNo[index] });
          }
          //End
          this.gatePassNoList = issueGatePassSelection;
          this.gatePassNoList.unshift({ label: '-select-', value: null });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoGatePassFound });
        }
      }, (err: HttpErrorResponse) => {
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

  onChangeGatePassNo() {
    if (this.SelectedGatePassNo !== null && this.SelectedGatePassNo !== undefined
      && this.SelectedGatePassNo.value !== undefined && this.SelectedGatePassNo.value !== null) {
      this.loading = true;
      const params = {
        'DocNumber': this.SelectedGatePassNo.value,
        'GName': this.godownName,
        'RName': this.regionName,
        'GCode': this.GCode,
        'GatePassNo': this.SelectedGatePassNo.label,
        'UserID': this.userId.user,
        'Type': 2
      };
      this.restAPIService.post(PathConstants.STOCK_ISSUE_GATEPASS_POST, params).subscribe((res: any) => {
        if (res.Item3.length !== 0 && res.Item3 !== null && res.Item3 !== undefined) {
          var data: any = JSON.parse(res.Item3);
          ///Distinct data from an array
          const distinctArr = Array.from(new Set(data.map(x => x.SINo))).map(SINo => {
            return{
              SINo: SINo,
              SIDate: data.find(y => y.SINo === SINo).SIDate,
              LorryNo: data.find(y => y.SINo === SINo).LorryNo,
              ReceivorName: data.find(y => y.SINo === SINo).ReceivorName,
            }
          })
          this.issueGatePassData = distinctArr;
          let sno = 1;
          this.issueGatePassData.forEach(x => {
            x.SlNo = sno;
            x.SIDate = this.datepipe.transform(x.SIDate, 'dd/MM/yyyy');
            sno += 1;
          })
          this.loading = false;
        } else {
          this.loading = false;
          this.issueGatePassData = [];
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        this.issueGatePassData = [];
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.message });
        }
      });
    } else {
      this.loading = false;
      this.issueGatePassData = [];
    }
  }

  onPrintAbstract(type) {
    if (type === '1') {
      const params = {
        'GatePassNo': this.SelectedLorryNo.gatePassID,
        'GCode': this.GCode
      }
      const path = "../../assets/Reports/" + this.userId.user + "/";
      const filename = this.GCode + GolbalVariable.IssueMemoGatePass;
      let filepath = path + filename + ".txt";
      var w = window.open(filepath);
      w.print();
      this.restAPIService.put(PathConstants.STOCK_ISSUE_GATEPASS_PUT, params).subscribe();
    } else {
      const path = "../../assets/Reports/" + this.userId.user + "/";
      const filename = this.GCode + GolbalVariable.IssueMemoGatePass;
      let filepath = path + filename + ".txt";
      var w = window.open(filepath);
      w.print();
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
