import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-depositor-customer-master',
  templateUrl: './depositor-customer-master.component.html',
  styleUrls: ['./depositor-customer-master.component.css']
})
export class DepositorCustomerMasterComponent implements OnInit {
  DepositorCols: any;
  DepositorData: any;
  CustomerCols: any;
  CustomerData: any;
  KeroseneSuppliersCols: any;
  KeroseneSuppliersData: any;
  KeroseneRegionalSuppliersCols: any;
  KeroseneRegionalSuppliersData: any;
  canShowMenu: boolean;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    // this.DepositorCols = this.tableConstants.DepositorMaster;

  }

  onKeroseneSuppliers() {
    this.KeroseneSuppliersCols = this.tableConstants.KeroseneSuppliers;
    this.restApiService.get(PathConstants.KEROSENE_SUPPLIERS).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.KeroseneSuppliersData = res;
        let sno = 0;
        this.KeroseneSuppliersData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
    });
  }

  onKeroseneRegionalSuppliers() {
    this.KeroseneRegionalSuppliersCols = this.tableConstants.KeroseneRegionalSuppliers;
    this.restApiService.get(PathConstants.KEROSENE_REGIONAL_SUPPLIERS).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.KeroseneRegionalSuppliersData = res;
      }
    });
  }

  onCustomer() {
    this.CustomerCols = this.tableConstants.CustomerMaster;
    this.restApiService.get(PathConstants.CUSTOMER_MASTER).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.CustomerData = res;
      }
    });
  }

  onDepositor() {
    this.DepositorCols = this.tableConstants.DepositorMaster;
    this.restApiService.get(PathConstants.DEPOSITOR_MASTER).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.DepositorData = res;
      }
    });
  }

  onResetTable() { }

  exportAsXLSX() { }

}
