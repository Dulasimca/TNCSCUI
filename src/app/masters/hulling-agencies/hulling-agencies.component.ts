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

@Component({
  selector: 'app-hulling-agencies',
  templateUrl: './hulling-agencies.component.html',
  styleUrls: ['./hulling-agencies.component.css']
})
export class HullingAgenciesComponent implements OnInit {
  data: any;
  column?: any;
  errMessage: string;
  items: any;
  canShowMenu: boolean;
  filterArray: any;
  loading: boolean = false;
  
  constructor(private restApiService: RestAPIService, private authService: AuthService, private loginService: LoginService, private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }
  
  ngOnInit() 
   {
      this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
      this.column = this.tableConstants.HullingAgenciesData;
      this.restApiService.get(PathConstants.HULLING_AGENCIES).subscribe((response: any[]) => {
        if(response!==undefined){
          this.loading = true;
          this.data = response;
          this.filterArray = response;
        }else 
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
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
       value = value.toString().toUpperCase();
            this.data = this.data.filter(item => {
                return item.DepositorName.toString().startsWith(value);
            });
         }
      }
        exportAsXLSX():void{
      this.excelService.exportAsExcelFile(this.data, 'HULLING-AGENCIES_DATA', this.column);
        }
  exportAsPDF() {
      var doc = new jsPDF('p','pt','a4');
      doc.text("Tamil Nadu Civil Supplies Corporation - Head Office",100,30,);
      // var img ="assets\layout\images\dashboard\tncsc-logo.png";
      // doc.addImage(img, 'PNG', 150, 10, 40, 20);
          var col = this.column;
          var rows = [];
          this.data.forEach(element => {
             var temp = [element.SlNo,element.DepositorName];
                rows.push(temp);
      });
            doc.autoTable(col,rows);
            doc.save('HULLING-AGENCIES_DATA.pdf');
    }
  print(){
    window.print();
  }
}