import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PrintService } from 'src/app/print.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-regions-data',
  templateUrl: './regions-data.component.html',
  styleUrls: ['./regions-data.component.css']
})
export class RegionsDataComponent implements OnInit {
  data: any;
  column?: any;
  items: any;
  canShowMenu: boolean;
  searchText: string;
  filterArray: any;
  selectedrow: any;
  loading: boolean;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private printService: PrintService,
    private authService: AuthService, private tableConstants: TableConstants,
   private messageService: MessageService) {
    //  this.column = route.snapshot.params['data'].split('',);
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.RegionData;
    this.loading = true;
    this.restApiService.get(PathConstants.REGION).subscribe((response: any[]) => {
      if (response !== undefined && response !== null) {
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
            this.table.exportCSV();
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
    // this.data = this.column.map(id => this.print());Promise.all(this.data).then(() => this.printService.onDataReady());
  }

  onSearch(value) {
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
        return item.RGNAME.toString().startsWith(value);
      });
    }
  }
  
  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.SlNo, element.RGCODE, element.RGNAME];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('REGION_DATA.pdf');
  }

  print() {
    const column = this.column;
    this.printService.printDocument(this.data, column);
    window.print();
  }
}
