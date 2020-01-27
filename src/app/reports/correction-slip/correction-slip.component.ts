import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-correction-slip',
  templateUrl: './correction-slip.component.html',
  styleUrls: ['./correction-slip.component.css']
})
export class CorrectionSlipComponent implements OnInit {
  correctionSlipCols: any;
  correctionSlipData: any = [];
  canShowMenu: boolean;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  docTypeOptions: SelectItem[];
  DocType: string;
  GCode: any;
  loading: boolean;
  username: any;
  RCode: any;
  DocNo: any;
  data: any;
  roleId: any;
  loggedInRCode: any;
  regions: any;
  @ViewChild('gd', { static: false }) godownPanel: Dropdown;
  @ViewChild('reg', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) docTypePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.correctionSlipCols = this.tableConstants.CorrectionSlipReport;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.username = JSON.parse(this.authService.getCredentials());
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
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
                if(x.RCode === this.loggedInRCode) {
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
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
        case 'dt':
            if (type === 'enter') {
              this.docTypePanel.overlayVisible = true;
            }
            if (this.docTypeOptions === undefined) {
              this.docTypeOptions = [{label: 'Receipt', value: '1'}, {label: 'Issue', value: '2'},
            {label: 'Truck', value: '3'}];
            }
          break;
    }
  }

  onView() {
    this.onResetTable('');
    this.loading = true;
    const params = {
      'GCode': this.GCode.value,
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserID': this.username.user,
      'DocNo': this.DocNo,
      'Type': this.DocType
    };
    this.restApiService.post(PathConstants.CORRECTION_SLIP_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.correctionSlipData = res;
        this.loading = false;
        let sno = 0;
        this.correctionSlipData.forEach(data => {
          data.DocDate = this.datePipe.transform(data.DocDate, 'dd-MM-yyyy');
          data.Nkgs = (data.Nkgs * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        })
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

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    else if(item === 'dt') { this.DocNo = null; }
    this.correctionSlipData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode.value + GolbalVariable.CorrectionSlipFileName + ".txt";
    saveAs(path + filename, filename);
  }


}
