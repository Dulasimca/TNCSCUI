import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-daily-document-issue',
  templateUrl: './daily-document-issue.component.html',
  styleUrls: ['./daily-document-issue.component.css']
})
export class DailyDocumentIssueComponent implements OnInit {
  DailyDocumentTotalCols: any;
  DailyDocumentTotalData: any;
  DailyDocumentIssueCols: any;
  DailyDocumentIssueData: any;
  g_cd: any;
  gCode: any;
  gdata: any;
  godownName: SelectItem[];
  disableOkButton: boolean = true;
  Docdate: Date;
  userid: any;
  remarks: any;
  Receipt: boolean;
  Issues: boolean;
  Transfer: boolean;
  CB: boolean;
  Transaction_Status: any;
  maxDate: Date;
  loading: boolean;
  viewPane: boolean;
  selectedRow: any;
  viewDate: Date = new Date();
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentIssueCols = this.tableConstants.DailyDocumentIssue;
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
  }


  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
       
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.Docdate;
  }

  showSelectedData() {
    this.viewPane = false;
    this.Docdate = this.selectedRow.DocdDate;
    this.Receipt = this.selectedRow.Receipt;
    this.Issues = this.selectedRow.Issues;
    this.Transfer = this.selectedRow.Transfer;
    this.CB = this.selectedRow.CB;
    this.remarks = this.selectedRow.remarks;
    this.userid = this.userid;
  }

  onView() {
    
  }

}
