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

  public exportAsExcelFile(json: any[], excelFileName: string): void{
    const Worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const Workbook: XLSX.WorkBook = { Sheets: { 'data': Worksheet }, SheetNames:['data']};
    const excelBuffer: any = XLSX.write(Workbook, { bookType: 'xlsx', type: 'array'});
    // Worksheet.set_header("Tamil Nadu Civil Supplies Corporation");
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void{
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
   
   }
}
