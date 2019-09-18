import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.css']
})
export class SchemesComponent implements OnInit {
  data: any;
  column?: any;
  errMessage: "Record Not Found";
  items: any;
  canShowMenu: boolean;
  filterArray: any;
  searchText: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.SchemeData;
    this.restApiService.get(PathConstants.SCHEMES).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.data = response;
        this.filterArray = response;
      }
      else {
        document.getElementById("errMessage").innerHTML = "Record Not Found!";
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
        return item.Name.toString().startsWith(value);
      });
    }
  }

  exportAsXLSX(): void {
    var SchemeData = [];
    this.data.forEach(value => {
      SchemeData.push({ SlNo: value.SlNo, Name: value.Name })
    })
    this.excelService.exportAsExcelFile(SchemeData, 'SCHEME_DATA', this.column);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.SlNo, element.Name];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('SCHEME_DATA.pdf');
  }

  print() {
    window.print();
  }
}
