import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gstcommoditymaster',
  templateUrl: './gstcommoditymaster.component.html',
  styleUrls: ['./gstcommoditymaster.component.css']
})
export class GstcommoditymasterComponent implements OnInit {
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  selectedRow: any;
  data?: any;
  roleId: any;
 
  regions: any;
  RCode: any;
  Region: any;
  formUser = [];
  userdata: any;
  maxDate: Date;
  loggedInRCode: any;
  GCode: any;
  loading: boolean = false;
  viewPane: boolean;
  isViewed: boolean = false;
 
  blockScreen: boolean;
  RName: any;
  isActive: any;
  Flag: any;
  CommodityCode: any;
  CommodityName: any;
  HSNcode: any;
  TaxPercentage: any;
  
  onDrop: boolean = false;
  
 

  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.userdata = this.fb.group({     
      'CommodityCode': new FormControl(''),
      'CommodityName': new FormControl(''),
      'HSNcode': new FormControl(''),
      'TaxPercentage': new FormControl(''),      
    });
  }

  // onSelect(item, type) {
  //   let regionSelection = [];
  //   let ActiveSelection = [];
  //   let GodownSelection = [];
  //   switch (item) {
  //     case 'reg':
  //       this.regions = this.roleBasedService.regionsData;
  //       if (type === 'enter') {
  //         this.regionPanel.overlayVisible = true;
  //       }
  //       if (this.roleId === 1) {
  //         if (this.regions !== undefined) {
  //           this.regions.forEach(x => {
  //             regionSelection.push({ label: x.RName, value: x.RCode });
  //           });
  //           this.regionOptions = regionSelection;
  //           if (this.roleId !== 3) {
  //             this.regionOptions.unshift({ label: 'All', value: 'All' });
  //           }
  //         }
  //       } else {
  //         if (this.regions !== undefined) {
  //           this.regions.forEach(x => {
  //             if (x.RCode === this.loggedInRCode) {
  //               regionSelection.push({ label: x.RName, value: x.RCode });
  //             }
  //           });
  //           this.regionOptions = regionSelection;
  //           if (this.roleId !== 3) {
  //             this.regionOptions.unshift({ label: 'All', value: 'All' });
  //           }
  //         }
  //       }
  //       break;
      
  //   }
  // }

 
  onLoad() {
    let value = [];
    if (this.CommodityName !== undefined) {
      
       
        this.onFormClear();
      
    }
  }

  onFormClear() {
    
    this.CommodityName = this.CommodityCode = this.TaxPercentage = this.HSNcode  = undefined;
  }

  onClear() {
    this.CommodityName = this.CommodityCode =  this.TaxPercentage = this.HSNcode  = undefined;
    
  }

  onSubmit(formUser) {
    
    this.messageService.clear();
    const params = {
      // 'LedgerID': (this.LedgerID !== undefined && this.LedgerID !== null) ? this.LedgerID : '',
      'CommodityID': (this.CommodityCode !== undefined && this.CommodityCode !== null) ? this.CommodityCode :  '',
      'CommodityName': this.CommodityName.toUpperCase(),
      'Hsncode': this.HSNcode,
      'TaxPercentage': this.TaxPercentage,      
    };
    this.restApiService.post(PathConstants.GST_COMMODITY_MASTER_POST, params).subscribe(value => {
      if (value) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
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
      }
    });
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}