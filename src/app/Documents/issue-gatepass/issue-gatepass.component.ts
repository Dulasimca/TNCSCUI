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

@Component({
  selector: 'app-issue-gatepass',
  templateUrl: './issue-gatepass.component.html',
  styleUrls: ['./issue-gatepass.component.css']
})
export class IssueGatepassComponent implements OnInit {
  canShowMenu: boolean;
  DocNo: any;
  SelectedLorryNo: any;
  issueMemoLorryAbstractCols: any[];
  issueMemoLorryAbstractData: any[];
  issueLorryNoList: SelectItem[];

  constructor(private restAPIService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
   }

  ngOnInit() {
  }

  onAbstract() {
    let issueLorrySelection = [];
    let gropuingArr = [];
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, { Type: '3' }).subscribe((res: any) => {
      if (res.Table !== undefined && res.Table.length !== 0 && res.Table !== null) {
        this.issueMemoLorryAbstractCols = this.tableConstants.IssueMemoLorryAbstractColumns;
        // construct object of unique values with keys
        let formObject = {};
        for (var i = 0; i < res.Table.length; i++) {
          formObject[res.Table[i].LorryNo] = 'LorryNo';
          formObject[res.Table[i].DocNo] = res.Table[i].LorryNo;
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
          gropuingArr.push({ label: x.LorryNo, value: value })
        })
        //Get distinct values from an array
        var LorryNo = Array.from(new Set(gropuingArr.map((item: any) => item.label)));
        var DocNo = Array.from(new Set(gropuingArr.map((item: any) => item.value)));
        for (var index in LorryNo && DocNo) {
        issueLorrySelection.push({ label: LorryNo[index], value: DocNo[index] });
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
    const params = new HttpParams().set('value', this.SelectedLorryNo.value).append('Type', '4');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe(res => {
      if(res.Table.length !== 0 && res.Table !== null && res.Table !== undefined) {
        this.issueMemoLorryAbstractData = res.Table;
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

  onPrintAbstract() { }

}
