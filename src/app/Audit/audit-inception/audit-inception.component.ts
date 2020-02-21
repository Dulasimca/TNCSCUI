import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-audit-inception',
  templateUrl: './audit-inception.component.html',
  styleUrls: ['./audit-inception.component.css']
})
export class AuditInceptionComponent implements OnInit {
  canShowMenu: boolean;
  maxDate: Date;
  IDate: Date;
  Name: string;
  ITeam: any;
  inceptionTeamOptions: SelectItem[];
  Remarks: string;
  totalRecords: number;
  inceptionData: any = [];
  inceptionCols: any;
  loading: boolean;
  IQuantity: any;
  typeOptions: SelectItem[];
  Report: AnalyserOptions;
  GCode: string;
  RCode: string;
  commoditySelection: any = [];
  commodityOptions: SelectItem[];
  TStockNo: any;
  stackNoOptions: SelectItem[];
  ITCode: any;

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restApiService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.IDate = this.maxDate;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(y => {
          this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode, 'group': y.GRName });
        });
        this.commodityOptions = this.commoditySelection;
        this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
      }
    })
   }

  onSelect(id, type) {
    switch(id) {
      case 'it':
        this.inceptionTeamOptions = [{ label: '-select', value: null, disabled: true},
        { label: 'Vigilance', value: 'Vigilance' }, { label: 'Audit', value: 'Audit' },
        { label: 'SRM/RM/DM', value: 'Manager' }, { label: 'Other Teams', value: 'Others' }];
        break;
      case 'ty':
        this.typeOptions = [{ label: '-select', value: null, disabled: true},
          { label: 'Excess', value: 0}, { label: 'Shortage', value: 1}];
        break;
    }
  }

  onSave() { }

  onClear() {
    this.messageService.clear();
    this.totalRecords = 0;
    this.IDate = this.maxDate;
    this.Name = null;
    this.ITeam = null; this.inceptionTeamOptions = [];
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}