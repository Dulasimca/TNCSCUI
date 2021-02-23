import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ConfirmationService, Dropdown, MessageService } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-do-approval-docs',
  templateUrl: './do-approval-docs.component.html',
  styleUrls: ['./do-approval-docs.component.css']
})
export class DoApprovalDocsComponent implements OnInit {
  canShowMenu: boolean;
  data: any;
  roleId: any;
  regions: any;
  maxDate: Date;
  regionOptions: SelectItem[];
  RCode: any;
  GCode: any;
  godownOptions: SelectItem[];
  loggedInRCode: string;
  DODocsData: any = [];
  DODocsCols: any;
  loading: boolean;
  fromDate: any = new Date();
  toDate: any = new Date();
  blockScreen: boolean;
  username: any;
  DocNo: string;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private tableConstants: TableConstants, private messageService: MessageService,
    private datepipe: DatePipe, private restApiService: RestAPIService, 
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.DODocsCols = this.tableConstants.DOApprovalReport;
    this.username = JSON.parse(this.authService.getCredentials()); 
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
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
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      }
    }

    onView(type) {
      this.loading = true;
      const params = {
        'RCode' : this.RCode,
        'fromDate':  this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
        'toDate':  this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
        'BillNo':  this.DocNo,
        'SPType': (this.DocNo !== undefined) ? 2 : 1,
        'type': 1,
        
      };
      this.restApiService.getByParameters(PathConstants.DO_TO_SALESTAX, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.DODocsData = res;
          let sno = 0;
          this.DODocsData.forEach(d => {
            sno += 1;
            d.SlNo = sno;
            // d.icon = 'pi pi-lock';
          });
          this.loading = false;
        } else {
          this.loading = false;
          this.onResetTable('');
          this.messageService.clear();
          if(type === 1) {
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
          }
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      });
    }

    onSendForApproval(data) {
      this.confirmationService.confirm({
        message: 'Do you want to send this ' + data.BillNo + ' for approval ?',
        header: 'Confirmation',
        icon:   'pi pi-exclamation-triangle',
        accept: () => {
          this.blockScreen = true;
          const params = {
            'BillNo': data.BillNo,
            'BillDate': data.BillDate,
            'RCode': data.RCode,
            'GCode': data.GCode
          }
          this.restApiService.post(PathConstants.GST_SALES_TAX_UPDATE, params).subscribe(res => {
            if(res.Item1) {
              this.blockScreen = false;
              this.messageService.clear();
              this.messageService.add({
                key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
                summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.DOAprrovalMessage + data.BillNo
              });
              this.onView(2);
            }
            else {
              this.blockScreen = false;
              this.messageService.clear();
              this.messageService.add({
                key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
                summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
              });
            }
          }, (err: HttpErrorResponse) => {
            this.blockScreen = false;
            if (err.status === 0 || err.status === 400) {
              this.messageService.clear();
              this.messageService.add({
                key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
                summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
              });
            } else {
              this.messageService.clear();
              this.messageService.add({
                key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
                summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
              });
            }
          })
        },
        reject: () => {
          this.messageService.clear();
         }
      });
    }

    onDateSelect() {
      this.checkValidDateSelection();
      this.onResetTable('');
    }
  
    checkValidDateSelection() {
      if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
        let selectedFromDate = this.fromDate.getDate();
        let selectedToDate = this.toDate.getDate();
        let selectedFromMonth = this.fromDate.getMonth();
        let selectedToMonth = this.toDate.getMonth();
        let selectedFromYear = this.fromDate.getFullYear();
        let selectedToYear = this.toDate.getFullYear();
        if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
          (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
          (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
            , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
          });
          this.fromDate = this.toDate = '';
        }
        return this.fromDate, this.toDate;
      }
    }

    onResetTable(item) {
      if(item === 'R') {
        this.GCode = null;
      }
      this.DODocsData = [];
     }
     onClose() {
       this.messageService.clear('t-err');
     }
}
