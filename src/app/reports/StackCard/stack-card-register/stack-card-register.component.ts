import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stack-card-register',
  templateUrl: './stack-card-register.component.html',
  styleUrls: ['./stack-card-register.component.css']
})
export class StackCardRegisterComponent implements OnInit {
  StackCardRegisterCols: any;
  StackCardRegisterData: any = [];
  data: any;
  GCode: any;
  ITCode: any;
  RCode: any;
  StackYear: any;
  StackStatus: any;
  regions: any;
  roleId: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  statusOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loggedInRCode: any;
  loading: boolean;
  Username: any;
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') CommodityPanel: Dropdown;
  @ViewChild('stackYear') StackYearPanel: Dropdown;
  @ViewChild('stackCardStatus') StackStatusPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, 
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.StackCardRegisterCols = this.tableConstants.StackCardRegisterReport;
    this.data = this.roleBasedService.getInstance();
    this.Username = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let YearSelection = [];
    let regionSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.RegionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ label: x.RName, value: x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if(x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
        break;
      case 'gd':
        if (type === 'enter') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ label: x.GName, value: x.GCode, rcode: x.RCode, rname: x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'st_yr':
        if (type === 'enter') {
          this.StackYearPanel.overlayVisible = true;
        }
        if (this.YearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ label: y.ShortYear, value: y.ShortYear });
              });
              this.YearOptions = YearSelection;
            }
          })
        }
        break;
      case 'cd':
        if (type === 'enter') {
          this.CommodityPanel.overlayVisible = true;
        }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ label: y.ITDescription, value: y.ITCode });
              });
              this.commodityOptions = commoditySelection;
            }
          });
        }
        break;
        case 'status':
            if (type === 'enter') {
              this.StackStatusPanel.overlayVisible = true;
            }
         this.statusOptions = [{ label: 'R', value: 'R' }, { label: 'C', value: 'C' }];
          break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      GCode: this.GCode.value,
      GName: this.GCode.label,
      RName: this.RCode.label,
      StackDate: this.StackYear,
      ICode: this.ITCode.value,
      ITName: this.ITCode.label,
      StackStatus: this.StackStatus,
      UserName: this.Username.user,
      Type: 5
    };
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.StackCardRegisterData = res;
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
    const path = "../../assets/Reports/" + this.Username.user + "/";
    const filename = this.GCode + GolbalVariable.StackCardRegisterReport + ".txt";
    saveAs(path + filename, filename);
  }
  
}
