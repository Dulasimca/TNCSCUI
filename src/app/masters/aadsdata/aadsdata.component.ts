import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-aadsdata',
  templateUrl: './aadsdata.component.html',
  styleUrls: ['./aadsdata.component.css']
})
export class AADSDataComponent implements OnInit {

  data: any;
  column: any;
  errMessage: 'Record Not Found';
  items: any;

  constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.column=this.tableConstants.AadsData;
    this.restApiService.get(PathConstants.AADS).subscribe((response: any[]) => {
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
      
       //console.log('res',this.data);
    })
  
  }
  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.data,'AADS DATA');
  }
  exportAsPDF(){

  }
}