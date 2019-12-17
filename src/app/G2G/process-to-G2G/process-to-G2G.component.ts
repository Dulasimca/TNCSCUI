import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-process-to-G2G',
    templateUrl: './process-to-G2G.component.html',
    styleUrls: ['./process-to-G2G.component.css']
})
export class ProcessToG2GComponent implements OnInit {
    canShowMenu: boolean;
    Date: Date;
    maxDate: Date = new Date();
    GCode: any;
    RCode: any;
    regionOptions: SelectItem[];
    godownOptions: SelectItem[];
    data = [];
    loading: boolean;
    loggedInRCode: string;
    regions: any;
    roleId: any;
    issueMemoDocCols: any;
    issueMemoDocData: any = [];
    processToG2GCols: any;
    processToG2GData: any = [];
    selectedData: any;
    issueList: any = [];
    blockScreen: boolean;
    showPane: boolean;
    @ViewChild('region') regionPanel: Dropdown;
    @ViewChild('godown') godownPanel: Dropdown;
    @ViewChild('dt') table: Table;

    constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
        private restAPIService: RestAPIService, private authService: AuthService,
        private messageService: MessageService, private datepipe: DatePipe) { }

    ngOnInit() {
        this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
        this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
        this.loggedInRCode = this.authService.getUserAccessible().rCode;
        this.data = this.roleBasedService.getInstance();
        this.regions = this.roleBasedService.getRegions();
        this.issueMemoDocCols = this.tableConstants.ProcessToG2GIssueCols;
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
                }
                break;
        }
    }

    onResetTable(item) {
        if (item === 'reg') { this.GCode = null; }
    }

    isRowSelected(rowData: any) {
        return (rowData.isSelected) ? "rowSelected" : "rowUnselected";
      }

      public getColor(data: any): string {
          console.log('d', data);
        return (data === 'Grand Total') ? "#53aae5" : "white";
      }

    onDateChange() {
        if (this.GCode !== undefined && this.GCode !== null && this.Date !== null && this.Date !== undefined) {
            this.loading = true;
            const params = new HttpParams().set('value', this.datepipe.transform(this.Date, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
            this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
                if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
                    this.loading = false;
                    let sno = 1;
                    let filteredArr = res.Table.filter(x => {
                        return (x.TyCode === 'TY002' || x.TyCode === 'TY003' || x.TyCode === 'TY004');
                    })
                    filteredArr.forEach(data => {
                        data.SlNo = sno;
                        sno += 1;
                    })
                    this.issueMemoDocData = filteredArr;
                } else {
                    this.issueMemoDocData = [];
                    this.loading = false;
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
                }
            }, (err: HttpErrorResponse) => {
                this.loading = false;
                if (err.status === 0 || err.status === 400) {
                    this.issueMemoDocData = [];
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
                }
            });
        }
    }

    onView() {
        this.processToG2GCols = this.tableConstants.ProcessToG2GCols;
        const params = new HttpParams().set('RCode', this.RCode).append('GCode', this.GCode).append('Date', this.datepipe.transform(this.Date, 'MM/dd/yyyy'));
        this.restAPIService.getByParameters(PathConstants.PROCESS_TO_G2G_GET, params).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
                this.showPane = true;
                let sno = 1;
                this.processToG2GData = res.filter(x => {
                    return (x.DocType === 2 && x.GToGStatus !== 4)
                });
                this.processToG2GData.forEach(data => {
                    data.SlNo = sno;
                    sno += 1;
                    data.GToGStartDate = this.datepipe.transform(data.GToGStartDate, 'dd/MM/yyyy');
                    data.GToGEndDate = this.datepipe.transform(data.GToGEndDate, 'dd/MM/yyyy');
                    
                    // if (data.Status === 4) {
                    //     this.processToG2GData.splice(index, 1);
                    // } else {
                        data.Status = this.getG2GStatus(data.GToGStatus);
                    // }
                })
               // this.processToG2GData = res;
            } else {
                this.processToG2GData = [];
                this.showPane = false;
                this.messageService.clear();
                this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
            }
        }, (err: HttpErrorResponse) => {
            this.loading = false;
            this.showPane = false;
            if (err.status === 0 || err.status === 400) {
                this.processToG2GData = [];
                this.messageService.clear();
                this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
            }
        });
    }

    getG2GStatus(value): string {
        let result;
        if (value !== null && value !== undefined) {
            switch (value) {
                case 0:
                    result = 'Pending';
                    break;
                case 1:
                    result = 'Processing';
                    break;
                case 2:
                    result = 'Transfered';
                    break;
                case 3:
                    result = 'Error';
                    break;
                case 4:
                    result = 'NotRequired to Transfer';
                    break;
                case 5:
                    result = 'Unable to Transfer';
                    break;
            }
            return result;
        }
    }

    onSave() {
        if (this.selectedData !== null && this.selectedData !== undefined) {
            this.blockScreen = true;
            this.selectedData.forEach(x => {
                this.issueList.push({
                    GCode: this.GCode,
                    RCode: this.RCode,
                    DocType: 2,
                    TripType: 2,
                    G2GStatus: 0,
                    GPSStatus: 4,
                    DocNumber: x.SINo
                });
            })
            this.restAPIService.post(PathConstants.PROCESS_TO_G2G_POST, this.issueList).subscribe(res => {
                if (res) {
                    this.onClear();
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
                } else {
                    this.blockScreen = false;
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
                }
            }, (err: HttpErrorResponse) => {
                this.blockScreen = false;
                if (err.status === 0 || err.status === 400) {
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
                } else {
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
                }
            });
        }
    }

    onClear() {
        this.RCode = null;
        this.GCode = null;
        this.Date = new Date();
        this.selectedData = null;
        this.blockScreen = false;
        this.issueList = [];
    }
}