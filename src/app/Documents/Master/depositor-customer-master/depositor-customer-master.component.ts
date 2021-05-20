import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { SelectItem } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-depositor-customer-master',
  templateUrl: './depositor-customer-master.component.html',
  styleUrls: ['./depositor-customer-master.component.css']
})
export class DepositorCustomerMasterComponent implements OnInit {
  DepositorCols: any;
  DepositorData: any;
  DepositorAllData: any = [];
  canShowMenu: boolean;
  filterArray: any;
  items: any;
  searchText: any;
  loading: boolean = false;
  DepositorType: any;
  depositorTypeOptions: SelectItem[];
  depositorTypeList: any = [];
  GCode: string;
  @ViewChild('depositor', { static: false }) depositorTypePanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private excelService: ExcelService, private authService: AuthService,
    private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.GCode = this.authService.getUserAccessible().rCode;
    this.onDepositor();
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
    const params = new HttpParams().set('TRCode', 'All').append('GCode', this.GCode);
    this.restApiService.getByParameters(PathConstants.DEPOSITOR, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(dt => {
          this.depositorTypeList.push({ label: dt.Tyname, value: dt.DepositorType });
        })
        this.depositorTypeOptions = this.depositorTypeList;
      }
    });
  }

  onSelect(type) {
    if (type === 'tab') {
      this.depositorTypePanel.overlayVisible = true;
    }
    let distinctValues = [];
    var name = Array.from(new Set(this.depositorTypeList.map((item: any) => item.label)));
    var code = Array.from(new Set(this.depositorTypeList.map((item: any) => item.value)));
    for (var index in name && code) {
      distinctValues.push({ 'label': name[index], 'value': code[index] });
    }
    this.depositorTypeOptions = distinctValues;
  }

  onDepositor() {
    this.loading = true;
    this.DepositorCols = this.tableConstants.SupplierData;
    this.restApiService.get(PathConstants.DEPOSITOR).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.DepositorData = res;
        this.DepositorAllData = res;
        this.filterArray = res;
        let sno = 0;
        this.DepositorData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
    });
  }

  filterDepositor(event) {
    if (event.value !== null && event.value !== undefined) {
      const matchingCode = event.value;
      let data = this.DepositorAllData.filter(x => {
        return x.DepositorType === matchingCode.value;
      });
      this.DepositorData = data;
    } else {
      this.DepositorData = this.DepositorAllData;
    }
  }

  onResetTable() {
    this.DepositorData = null;
    this.DepositorCols = null;
  }

  exportAsXLSX(): void {
    var DepositorMaster = [];
    if (this.DepositorData !== undefined && this.DepositorData !== null && this.DepositorData.length !== 0) {
      this.DepositorData.forEach(data => {
        DepositorMaster.push({ Depositor_Code: data.DepositorCode, Depositor_Name: data.DepositorName });
      });
      this.excelService.exportAsExcelFile(DepositorMaster, 'Depositor_Master', this.DepositorCols);
    }
  }

  onSearch(value) {
    this.DepositorData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.DepositorData = this.DepositorData.filter(item => {
        return item.DepositorName.toString().startsWith(value) || item.DepositorCode.toString().startsWith(value);
      });
    }
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    if (this.DepositorData !== undefined && this.DepositorData !== null && this.DepositorData.length !== 0) {
      var col = this.DepositorCols;
      var rows = [];
      this.DepositorData.forEach(element => {
        var temp = [element.SlNo, element.DepositorCode, element.DepositorName];
        rows.push(temp);
      });
      doc.autoTable(col, rows);
      doc.save('Depositor_Master.pdf');
    }
  }
}
