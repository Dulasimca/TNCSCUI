import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';

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
  RCode: any;
  GCode: any;
  roleId: number;
  regions: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('region') docTypePanel: Dropdown;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private datepipe: DatePipe, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
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
          } else {
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
        case 'gd':
          if (type === 'enter') {
            this.docTypePanel.overlayVisible = true;
          }
           break;
    }
  }
  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }
  checkValidDateSelection() {
   
  }
  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
   
  }

}
