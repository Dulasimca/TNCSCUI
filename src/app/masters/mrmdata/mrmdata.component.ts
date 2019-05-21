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
  selector: 'app-mrmdata',
  templateUrl: './mrmdata.component.html',
  styleUrls: ['./mrmdata.component.css']
})
export class MRMDataComponent implements OnInit {
  data: any;
  column?: any;
  errMessage: string;
  items:any;
  canShowMenu: boolean;
  
    constructor(private restApiService: RestAPIService, private loginService: LoginService, private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }
  
    ngOnInit() {
      this.canShowMenu = (this.loginService.canShow() !== undefined) ? this.loginService.canShow() : false;
      this.column = this.tableConstants.MrmData;
      this.restApiService.get(PathConstants.MRN).subscribe((response: any[]) => {
        if(response!==undefined){
          this.data = response;
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
       // console.log('res', this.data);
        
      });
    }
    exportAsXLSX():void{
      this.restApiService.get(PathConstants.MRN).subscribe((res: any[]) => {
        this.data=res;
      this.excelService.exportAsExcelFile(this.data,'MRM_DATA');
      });
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
        doc.save('MRM_DATA.pdf');
      
    }
  }
