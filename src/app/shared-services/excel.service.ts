import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(data: any, excelFileName: string): void{
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, excelFileName + EXCEL_EXTENSION);

  }

  // private saveAsExcelFile(buffer: any, fileName: string): void{
  //   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
  //   FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
   
  //  }
}
