import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from 'src/app/shared-services/excel.service';

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
  filterArray: any;
  items: any;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private excelService: ExcelService, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.exportAsXLSX();
        }
      },
      {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF();
        }
      }]
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
        this.filterArray = res;
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
        this.filterArray = res;
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

  exportAsXLSX(): void {
    var DepositorMaster = [];
    var KeroseneMaster = [];
    if (this.DepositorData || this.KeroseneSuppliersData) {
      if (this.DepositorData) {
        this.DepositorData.forEach(data => {
          DepositorMaster.push({ SlNo: data.SlNo, Depositor_Code: data.DepositorCode, Depositor_Name: data.DepositorName });
        });
        this.excelService.exportAsExcelFile(DepositorMaster, 'Depositor_Master', this.DepositorCols);
      } else if (this.KeroseneSuppliersData) {
        this.KeroseneSuppliersData.forEach(data => {
          KeroseneMaster.push({ SlNo: data.SlNo, Supplier_Code: data.SupplierCode, Supplier_Name: data.SupplierName });
        });
        this.excelService.exportAsExcelFile(KeroseneMaster, 'Kerosene_Suppliers_Master', this.KeroseneSuppliersCols);
      }
    }
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    if (this.KeroseneSuppliersData || this.DepositorData) {
      if (this.DepositorData) {
        var col = this.DepositorCols;
        var rows = [];
        this.DepositorData.forEach(element => {
          var temp = [element.SlNo, element.DepositorCode, element.DepositorName];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Depositor_Master.pdf');
      } else if (this.KeroseneSuppliersData) {
        var col = this.KeroseneSuppliersCols;
        var rows = [];
        this.KeroseneSuppliersData.forEach(element => {
          var temp = [element.SlNo, element.SupplierCode, element.SupplierName];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Kerosene_Master.pdf');
      }
    }
  }
}
