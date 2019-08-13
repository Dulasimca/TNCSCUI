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

  //   onSelect(item) {
  //     let KeroseneSuppliersOption = [];
  //     let DepositorDataOption = [];
  //     switch (item) {
  //       case 'Kerosene':
  //         if(this.KeroseneSuppliersData !== undefined) {
  //         this.KeroseneSuppliersCols = this.tableConstants.KeroseneSuppliers;
  //         this.restApiService.get(PathConstants.KEROSENE_SUPPLIERS).subscribe(res => {
  //           if (res !== undefined) {
  //             this.loading = false;
  //             this.KeroseneSuppliersData = res;
  //             let sno = 0;
  //             this.KeroseneSuppliersData.forEach(data => {
  //               sno += 1;
  //               data.SlNo = sno;
  //               this.KeroseneSuppliersData = KeroseneSuppliersOption;
  //             });
  //           }
  //         });
  //       }
  //         break;
  //       case 'Depositor':
  //         if(this.DepositorData !== undefined) {
  //         this.DepositorCols = this.tableConstants.SupplierData;
  //         this.restApiService.get(PathConstants.DEPOSITOR).subscribe(res => {
  //           if (res !== undefined) {
  //             this.loading = false;
  //             this.DepositorData = res;
  //             let sno = 0;
  //             this.DepositorData.forEach(data => {
  //               sno += 1;
  //               data.SlNo = sno;
  //               this.DepositorData = DepositorDataOption;
  //             });
  //           }
  //         });
  //         break;
  //     }
  //   }
  // }

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

  onDepositor() {
    this.DepositorCols = this.tableConstants.SupplierData;
    this.restApiService.get(PathConstants.DEPOSITOR).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.DepositorData = res;
        let sno = 0;
        this.DepositorData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
    });
  }

  onResetTable() {
    this.DepositorData = this.KeroseneSuppliersData = this.KeroseneSuppliersCols = this.DepositorCols = null;
  }

  exportAsXLSX() { }

}
