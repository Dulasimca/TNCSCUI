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

  public exportAsExcelFile(json: any[], excelFileName: string, headers: any[]): void{
    const Worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // let headerRow = Worksheet.addRow();
    // // Cell Style : Fill and Border
    // headerRow.eachCell((cell, number) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'FFFFFF00' },
    //     bgColor: { argb: 'FF0000FF' }
    //   }
    //   cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    // })
    var range = XLSX.utils.decode_range(Worksheet['!ref']);
    for (var C = range.s.r; C <= range.e.r; ++C){
      var keys = XLSX.utils.encode_col(C) + "1";
      if (!Worksheet[keys]) continue;
      let key = Worksheet[keys].v;
      for (let i = 0; i < headers.length; i++) {
        if (Worksheet[keys].v === headers[i].field) {
          Worksheet[keys].v = headers[i].header;
        }
      }
    }
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
