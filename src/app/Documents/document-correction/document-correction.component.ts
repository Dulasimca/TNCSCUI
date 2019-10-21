import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService, ConfirmationService } from 'primeng/primeng';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';

@Component({
  selector: 'app-document-correction',
  templateUrl: './document-correction.component.html',
  styleUrls: ['./document-correction.component.css']
})
export class DocumentCorrectionComponent implements OnInit {
  data = [];
  canShowMenu: boolean;
  maxDate: Date = new Date();
  docTypeOptions: SelectItem[];
  docNumOptions: SelectItem[];
  docStatusOptions: SelectItem[];
  regionOptions: SelectItem[];
  CorrectionSlipApproveStatusCols: any;
  CorrectionSlipApproveStatusData: any = [];
  CorrectionSlipApproveCols: any;
  CorrectionSlipApproveData: any = [];
  DocType: any;
  DocStatus: string = 'Pending';
  status: string = '0';
  GCode: any;
  RCode: any;
  RegionName: any;
  GodownName: any;
  DocNo: any;
  Reason: any;
  ApproverReason: any;
  roleId: number;
  regions: any;
  DocDate: any;
  viewPane: boolean;
  loading: boolean;
  regionData: any;
  ApprovalStatus: number;
  Id: any;
  fromDate: Date =  new Date();
  toDate: Date =  new Date();
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('docType') docTypePanel: Dropdown;
  @ViewChild('docNum') docNoPanel: Dropdown;
  @ViewChild('docStatus') docStatusPanel: Dropdown;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private datepipe: DatePipe, private tableConstants: TableConstants, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.RCode = this.authService.getUserAccessible().rCode;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RegionName = this.authService.getUserAccessible().rName;
    this.GodownName = this.authService.getUserAccessible().gName;
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.regionData = this.roleBasedService.getRegions();
    this.CorrectionSlipApproveStatusCols = this.tableConstants.DocumentCorrectionColumns;
    this.CorrectionSlipApproveCols = this.tableConstants.DocumentCorrectionApproveColumns;
    if (this.roleId === 2) {
      this.viewPendingApproveDocs();
    }
    this.docStatusOptions = [{ label: 'Pending', value: '0' }, { label: 'Approved', value: '1' },
    { label: 'Rejected', value: '2' }];
  }

  onSelect(item, type) {
    let docNumSelection = [];
    let regionSelection = [];
     switch (item) {
      case 'reg':
          this.regionData = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
            if (this.regionData !== undefined) {
              this.regionData.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
        break;
        case 'dt':
        if (type === 'enter') {
          this.docTypePanel.overlayVisible = true;
        }
        if (this.docTypeOptions === undefined) {
          this.docTypeOptions = [{ label: 'Receipt', value: '1' }, { label: 'Issue', value: '2' },
          { label: 'Truck', value: '3' }];
          //, { label: 'Delivery Order', value: '4' }
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
                  docNumSelection.push({ label: x.Dono, value: x.Dono });
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
        break;
    }
  }

  onView() {
    if (this.fromDate !== undefined && this.fromDate !== null && this.toDate !== undefined && this.toDate !== null) {
      this.loading = true;
      const params = new HttpParams().set('Code', this.GCode).append('Value', this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'))
      .append('ToDate', this.datepipe.transform(this.toDate, 'MM/dd/yyyy')).append('Type', '1');
      this.restApiService.getByParameters(PathConstants.DOCUMENT_CORRECTION_GET, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          let sno = 1;
          res.forEach(x => { x.SlNo = sno; sno += 1; })
          this.CorrectionSlipApproveStatusData = res;
          this.loading = false;
        } else {
          this.CorrectionSlipApproveStatusData.length = 0;
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

  viewPendingApproveDocs() {
    if(this.RCode !== null && this.RCode !== undefined && this.DocStatus !== null && this.DocStatus !== undefined) {
      this.loading = true;
      let status = (this.DocStatus === 'Pending') ? this.status : this.DocStatus;
      const params = new HttpParams().set('Code', this.RCode).append('Value', status)
      .append('ToDate', this.datepipe.transform(this.toDate, 'MM/dd/yyyy')).append('Type', '2');
      this.restApiService.getByParameters(PathConstants.DOCUMENT_CORRECTION_GET, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          let sno = 1;
          res.forEach(x => { x.SlNo = sno; sno += 1; })
          this.CorrectionSlipApproveData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this.CorrectionSlipApproveData.length = 0;
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

  onLoadData() {
    if(this.fromDate !== null && this.fromDate !== undefined && this.toDate !== null && this.toDate !== undefined) {
      this.loading = true;
      const params = new HttpParams().set('Code', this.RCode).append('Value', this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'))
      .append('ToDate', this.datepipe.transform(this.toDate, 'MM/dd/yyyy')).append('Type', '3');
      this.restApiService.getByParameters(PathConstants.DOCUMENT_CORRECTION_GET, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          let sno = 1;
          res.forEach(x => { x.SlNo = sno; sno += 1; })
          this.CorrectionSlipApproveData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this.CorrectionSlipApproveData.length = 0;
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
     if (item === 'dt') { this.DocNo = null; }
    else if (item === 'ddate') { this.DocNo = null; }
    this.CorrectionSlipApproveStatusData.length = 0;
  }

  onClear() {
    this.DocType = null; this.DocDate = new Date();
    this.DocNo = null; this.Reason = null;
    this.fromDate = new Date(); this.toDate = new Date();
    this.DocStatus = 'Pending'; this.status = '0';
  }

  onRowSelect(event, data) {
    this.Id = data.Id;
    this.viewPane = (data.ApprovalStatus === 'Approved') ? false : true;
    this.ApproverReason = data.ApproverReason;
  }

  accept() {
    this.ApprovalStatus = 1;
    this.onUpdate();
  }

  reject() {
    this.ApprovalStatus = 2;
    this.onUpdate();
  }

  onUpdate() {
    const params = {
      'Type': 2,
      'Id': this.Id,
      'ApprovalStatus': this.ApprovalStatus,
      'ApproverRoleID': this.roleId,
      'ApproverReason': (this.ApproverReason !== null && this.ApproverReason !== undefined) ? this.ApproverReason : ''
    }
    this.restApiService.post(PathConstants.DOCUMENT_CORRECTION_POST, params).subscribe((res: any) => {
      if (res.Item1) {
        this.viewPane = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-msg', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
        this.viewPendingApproveDocs();
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
        this.onClear();
        this.messageService.clear();
        this.messageService.add({ key: 't-msg', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
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
