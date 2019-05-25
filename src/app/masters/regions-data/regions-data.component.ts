import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoginService } from 'src/app/login/login.service';
import { AuthService } from 'src/app/shared-services/auth.service';




@Component({
  selector: 'app-regions-data',
  templateUrl: './regions-data.component.html',
  styleUrls: ['./regions-data.component.css']
})
export class RegionsDataComponent implements OnInit {

  data: any;
  column?: any;
  errMessage: string;
  items: any;
  canShowMenu: boolean;
  searchText : string;
  filterArray: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private http: HttpClient, private loginService: LoginService, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.RegionData;
    this.restApiService.get(PathConstants.REGION).subscribe((response: any[]) => {
      if(response!==undefined){
        this.data = response;
        this.filterArray = response;
      }
      else 
      {
        return this.errMessage;
      }
        this.items = [
          {
            label: 'Excel', icon: 'fa fa-table', command: () => {
              this.exportAsXLSX();
          }},
          {
            label: 'PDF', icon: "fa fa-file-pdf-o" , command: () => {
              this.exportAsPDF();
            }
          }]
    });
  }
  onSearch(value) {
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
          return item.RGNAME.toString().startsWith(value);
      });
       } else {
         this.data = this.filterArray;
       }
  }
  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.data,'REGION_DATA');
}
exportAsPDF() {
  var doc = new jsPDF('p','pt','a4');
  doc.text("Tamil Nadu Civil Supplies Corporation - Head Office",100,30,);
  // var img ="assets\layout\images\dashboard\tncsc-logo.png";
  // doc.addImage(img, 'PNG', 150, 10, 40, 20);
  var col = this.column;
  var rows = [];
  this.data.forEach(element => {
     var temp = [element.SlNo,element.RGNAME];
        rows.push(temp);
        
  });
    doc.autoTable(col,rows);
    doc.save('REGION_DATA.pdf');
 }
 print(){
  window.print();
}
}
