import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-document-correction',
  templateUrl: './document-correction.component.html',
  styleUrls: ['./document-correction.component.css']
})
export class DocumentCorrectionComponent implements OnInit {
  data = [];
  canShowMenu: boolean;
  maxDate: Date = new Date();
  loggedInRCode: string;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  docTypeOptions: SelectItem[];
  docNumOptions: SelectItem[];
  docStatusOptions: SelectItem[];
  CorrectionSlipApproveStatusCols: any;
  CorrectionSlipApproveStatusData: any;
  CorrectionSlipApproveCols: any;
  CorrectionSlipApproveData: any;
  DocType: any;
  DocStatus: string = 'Pending';
  GCode: any;
  RCode: any;
  DocNo: any;
  Reason: any;
  roleId: number;
  regions: any;
  DocDate: any;
  viewPane: boolean;
  loading: boolean;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('docType') docTypePanel: Dropdown;
  @ViewChild('docNum') docNoPanel: Dropdown;
  @ViewChild('docStatus') docStatusPanel: Dropdown;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private datepipe: DatePipe, private roleBasedService: RoleBasedService, private tableConstants: TableConstants) { }

  ngOnInit() {
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.CorrectionSlipApproveStatusCols = this.tableConstants.DocumentCorrectionColumns;
    this.CorrectionSlipApproveCols = this.tableConstants.DocumentCorrectionApproveColumns;
    if(this.roleId === 1 || this.roleId === 2) {
    this.viewPendingApproveDocs();
    }
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let docNumSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          } else {
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
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
          this.godownPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'dt':
        if (type === 'enter') {
          this.docTypePanel.overlayVisible = true;
        }
        if (this.docTypeOptions === undefined) {
          this.docTypeOptions = [{ label: 'Receipt', value: '1' }, { label: 'Issue', value: '2' },
          { label: 'Truck', value: '3' }, { label: 'Delivery Order', value: '4' }];
        }
        break;
      case 'dn':
        if (type === 'enter') {
          this.docTypePanel.overlayVisible = true;
        }
        if (this.DocType !== null && this.DocType !== undefined) {
          if (this.DocType === '1') {
            const params = new HttpParams().set('sValue', this.datepipe.transform(this.DocDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
            this.restApiService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(x => {
                  docNumSelection.push({ label: x.SRNo, value: x.SRNo });
                })
              }
              this.docNumOptions = docNumSelection;
            });
          } else if (this.DocType === '2') {
            const params = new HttpParams().set('value', this.datepipe.transform(this.DocDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
            this.restApiService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
              if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
                res.Table.forEach(x => {
                  docNumSelection.push({ label: x.SINo, value: x.SINo });
                })
              }
              this.docNumOptions = docNumSelection;
            });
          } else if (this.DocType === '3') {
            const params = new HttpParams().set('sValue', this.datepipe.transform(this.DocDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
            this.restApiService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(x => {
                  docNumSelection.push({ label: x.STNo, value: x.STNo });
                })
              }
              this.docNumOptions = docNumSelection;
            });
          } else if (this.DocType === '4') {
            const params = new HttpParams().set('sValue', this.datepipe.transform(this.DocDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
            this.restApiService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_VIEW_DOCUMENT, params).subscribe((res: any) => {
              if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
                res.Table.forEach(x => {
                  docNumSelection.push({ label: x.DNo, value: x.DNo });
                })
              }
              this.docNumOptions = docNumSelection;
            });
          } else {
            this.docNumOptions = docNumSelection;
          }
        } else {
          this.docNumOptions = docNumSelection;
        }
        break;
        case 'ds':
            if (type === 'enter') {
              this.docStatusPanel.overlayVisible = true;
            }
            if(this.docStatusOptions === undefined) {
              this.docStatusOptions = [{label: 'Pending', value: '0'}, {label: 'Approved', value: '1'},
              {label: 'Rejected', value: '2'}];
            }
          break;
    }
  }

  onView() {
    if(this.GCode !== undefined && this.GCode !== null && this.RCode !== null && this.RCode !== undefined &&
      this.DocType !== null && this.DocType !== undefined && this.DocNo !== undefined && this.DocNo !== null
      && this.DocDate !== undefined && this.DocDate !== null) {
         const params = new HttpParams().set('DocNo', this.DocNo).append('Type', '1');
    this.restApiService.getByParameters(PathConstants.DOCUMENT_CORRECTION_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        let sno = 1;
        res.forEach( x => { x.SlNo = sno; sno += 1; })
        this.CorrectionSlipApproveStatusData = res;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }
  }

  viewPendingApproveDocs() {
    if(this.GCode !== undefined && this.GCode !== null && this.RCode !== null && this.RCode !== undefined &&
      this.DocType !== null && this.DocType !== undefined && this.DocNo !== undefined && this.DocNo !== null
      && this.DocDate !== undefined && this.DocDate !== null) {
        this.loading = true;
    const params = new HttpParams().set('DocNo', this.DocNo).append('Type', '1');
    this.restApiService.getByParameters(PathConstants.DOCUMENT_CORRECTION_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        let sno = 1;
        res.forEach( x => { x.SlNo = sno; sno += 1; })
        this.CorrectionSlipApproveStatusData = res;
        this.loading = false;
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
  }

  onResetFields(item) {
    if (item === 'reg') { this.GCode = null; }
    else if (item === 'dt') { this.DocNo = null; }
    else if (item === 'ddate') { this.DocNo = null; }
    this.CorrectionSlipApproveStatusData.length = 0;
  }

  onClear() {
    this.DocType = null; this.DocDate = new Date();
    this.DocNo = null; this.Reason = null;
  }

  onSave() {
    const params = {
      'Type': 1,
      'DocNo': this.DocNo,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'DocType': this.DocType,
      'RoleId': this.roleId,
      'Reason': (this.Reason !== null && this.Reason !== undefined) ? this.Reason : ''
    }
    this.restApiService.post(PathConstants.DOCUMENT_CORRECTION_POST, params).subscribe((res: any) => {
      if (res.Item1) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

}
