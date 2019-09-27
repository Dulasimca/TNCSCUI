import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ocr-report',
  templateUrl: './ocr-report.component.html',
  styleUrls: ['./ocr-report.component.css']
})
export class OCRReportComponent implements OnInit {
  cashReceiptRegCols: any;
  cashReceiptRegData: any = [];
  canShowMenu: boolean;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  GCode: any;
  maxDate: Date = new Date();
  loading: boolean;
  fromDate: any = new Date();
  toDate: any = new Date();
  username: any;
  RCode: any;
  data: any;
  roleId: any;
  loggedInRCode: any;
  regions: any;
  @ViewChild('gd') godownPanel: Dropdown;
  @ViewChild('reg') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.cashReceiptRegCols = this.tableConstants.StockStatementReport;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.username = JSON.parse(this.authService.getCredentials());
    this.username = JSON.parse(this.authService.getCredentials());
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
  }

  onView() {
    this.loading = true;
    const params = {
      GCode: this.GCode.value,
      GName: this.GCode.label,
      RName: this.RCode.label,
      UserName: this.username.user,
    };
    this.restApiService.post(PathConstants.OCR_REGISTER_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.cashReceiptRegData = res;
        this.loading = false;
      } else{
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

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StackCardRegisterReport + ".txt";
    saveAs(path + filename, filename);
  }
}
