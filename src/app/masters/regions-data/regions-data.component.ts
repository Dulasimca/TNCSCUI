import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import {SplitButtonModule} from 'primeng/splitbutton';
import { ExcelService } from 'src/app/shared-services/excel.service';
//var JSPDF = require('jspdf');
//require('jspdf-autotable');



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

  constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.column = this.tableConstants.RegionData;
    this.restApiService.get(PathConstants.REGION).subscribe((response: any[]) => {
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
      
      //console.log('res', this.data);
      
    });
  }
  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.data,'AADS DATA');
}

exportAsPDF() {
  // let doc = new JSPDF('p', 'pt', 'a4');
  //  doc.setFontSize(15);
  //  doc.autoTable('response');
  //  doc.save('RegionData.pdf');
  
}
}
