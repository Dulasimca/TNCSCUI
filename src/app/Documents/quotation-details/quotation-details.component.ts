import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Dropdown, SelectItem, MessageService } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit {
  data: any;
  maxDate: Date;
  rcode: any;
  gcode: any;
  pcode: any;
  canShowMenu: boolean;
  blockScreen: boolean;
  remarks: string;
  emailId: string;
  phoneNo: number;
  productNew: string;
  roleId: any;
  username: any;
  loggedInRCode: any;
  regions: any;
  products: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  productOptions: SelectItem[];
  isOtherProductSelected: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('product', { static: false }) productPanel: Dropdown;

  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private authService: AuthService, private messageService: MessageService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.products = this.roleBasedService.getProducts();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let productSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        break;
      case 'gd':
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.rcode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'pd':
        if (type === 'enter') { this.productPanel.overlayVisible = true; }
        this.products = this.roleBasedService.products;
        if (this.products !== undefined) {
          this.products.forEach(x => {
            productSelection.push({ 'label': x.PName, 'value': x.PCode });
          });
        }
        this.isOtherProductSelected = (this.pcode === 8) ? true : false;
        break;
      }
  }

  onResetField(type) {
    if (type === 'R') {
      this.gcode = null;
    }
  }

  onSave() {
    this.blockScreen = true;
    if(this.isOtherProductSelected) {}
    const params = {
      'RCode': this.rcode,
      'GCode': this.gcode,
      'ProductID': this.pcode,
      'Remarks': (this.remarks !== null && this.remarks.trim() !== '') ? this.remarks.trim() : '-',
      'EmailID': this.emailId,
      'PhoneNo': this.phoneNo,
      'UserID': this.username.user
    };
    this.restAPIService.post(PathConstants.QUOTATION_DETAILS_POST, params).subscribe(res => {
        if (res.Item1) {
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2
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
    });

  }

  onClear(form: NgForm) {
    form.reset();
  }

}
