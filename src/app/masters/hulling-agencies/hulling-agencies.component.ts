import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hulling-agencies',
  templateUrl: './hulling-agencies.component.html',
  styleUrls: ['./hulling-agencies.component.css']
})
export class HullingAgenciesComponent implements OnInit {
  data: any;
  column?: any;
  items: any;
  canShowMenu: boolean;
  filterArray: any;
  loading: boolean = false;
  searchText: any;
  
  constructor(private restApiService: RestAPIService, private authService: AuthService,
    private tableConstants: TableConstants, private excelService: ExcelService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.HullingAgenciesData;
    this.loading = true;
    this.restApiService.get(PathConstants.HULLING_AGENCIES).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.data = response;
        this.loading = false;
        this.filterArray = response;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
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
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
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

  exportAsXLSX(): void {
    var HullingData = [];
    this.data.forEach(value => {
      HullingData.push({ SlNo: value.SlNo, DepositorName: value.DepositorName })
    })
    this.excelService.exportAsExcelFile(HullingData, 'HULLING_AGENCIES_DATA', this.column);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.SlNo, element.DepositorName];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('HULLING-AGENCIES_DATA.pdf');
  }

  print() {
    window.print();
  }
}