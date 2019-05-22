import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-fcidata',
  templateUrl: './fcidata.component.html',
  styleUrls: ['./fcidata.component.css']
})
export class FCIDataComponent implements OnInit {
  data: any;
  column?: any;
  errMessage: string;
  items: any;
  canShowMenu: boolean;
  searchText: string;
  filterArray: any;
  
    constructor(private restApiService: RestAPIService, private http: HttpClient, private loginService: LoginService, private tableConstants: TableConstants, private excelService: ExcelService) { }
  
    ngOnInit() {
      this.canShowMenu = (this.loginService.canShow() !== undefined) ? this.loginService.canShow() : false;
      this.column = this.tableConstants.FciData;
      this.restApiService.get(PathConstants.FCI).subscribe((response: any[]) => {
        if(response!==undefined){
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
         //console.log('res', this.data);
        
      });
        
    }
    onSearch(value) {
      if (value !== undefined && value !== '') {
        value = value.toString().toUpperCase();
        this.data = this.data.filter(item => {
            return item.DepositorName.toString().startsWith(value);
        });
         } else {
           this.data = this.filterArray;
         }
    }
    exportAsXLSX():void{
      this.excelService.exportAsExcelFile(this.data,'FCI_DATA');
    }
    exportAsPDF() {
      var doc = new jsPDF();
      var col = this.column;
      var rows = [];
      this.data.forEach(element => {
         var temp = [element.SlNo,element.DepositorName];
            rows.push(temp);
            
      });
        doc.autoTable(col,rows);
        doc.save('FCI_DATA.pdf');
      
    }
}