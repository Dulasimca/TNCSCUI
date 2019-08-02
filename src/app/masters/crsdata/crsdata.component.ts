import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoginService } from 'src/app/login/login.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-crsdata',
  templateUrl: './crsdata.component.html',
  styleUrls: ['./crsdata.component.css']
})
export class CRSDataComponent implements OnInit {

  data: any = [];
  column: any;
  errMessage: "Record Not Found";
  items: any;
  canShowMenu: boolean;
  filterArray: any;
  loading: boolean = false;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService, private loginService: LoginService, private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.loading = true;
    this.column = this.tableConstants.CrsData;
    this.restApiService.get(PathConstants.CRS).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.loading = false;
        this.data = response;
        this.filterArray = response;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
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
    });
  }
  onSearch(value) {
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
        return item.GodownName, item.RegionName.toString().startsWith(value);
      });
    }
  }
  exportAsXLSX(): void {
    var CrsData = [];
    this.data.forEach(value => {
      CrsData.push({ SlNo: value.SlNo, RegionName: value.RegionName, GodownName: value.GodownName, Issuername: value.Issuername, IssuerCode: value.IssuerCode, AcsCode: value.AcsCode })
    })
    this.excelService.exportAsExcelFile(CrsData, 'CRS DATA', this.column);
  }
  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.SlNo, element.RegionName, element.GodownName, element.Issuername, element.IssuerCode, element.AcsCode];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('CRS_DATA.pdf');
  }
  print() {
    window.print();
  }
}