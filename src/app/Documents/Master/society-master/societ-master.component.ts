import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-societ-master',
  templateUrl: './societ-master.component.html',
  styleUrls: ['./societ-master.component.css']
})
export class SocietMasterComponent implements OnInit {
  SocietyMasterCols: any;
  SocietyMasterData: any;
  data?: any;
  g_cd: any;
  t_cd: any;
  Type: any;
  gCode: any;
  godownOptions: SelectItem[];
  typeOptions: SelectItem[];
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private router: Router, private excelService: ExcelService, private messageService: MessageService, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance().gCode;
    this.gCode = this.authService.getUserAccessible().gCode;
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
  }

  // onSelect(item) {
  //   let godownSelection = [];
  //   let typeSelection = [];
  //   switch (item) {
  //     case 'gd':
  //       this.data = this.roleBasedService.instance;
  //       if (this.data !== undefined) {
  //         this.data.forEach(x => {
  //           godownSelection.push({ 'label': x.GName, 'value': x.GCode });
  //           this.godownOptions = godownSelection;
  //         });
  //       }
  //       break;
  //     case 'type':
  //       if (this.typeOptions === undefined) {
  //         const params = new HttpParams().set('GCode', this.g_cd.value);
  //         this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //           this.Type = res;
  //           if (this.Type !== undefined && this.Type !== 0) {

  //             this.Type = res.filter((value: { Tyname: any; }) => { return res.Tyname === this.typeOptions });
  //             // this.Type.forEach(y => {
  //             // typeSelection.push({ 'label': y.Tyname, 'value': y.SocietyType });

  //             this.typeOptions = typeSelection;
  //             // });
  //             this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COPERATIVES LEADING', 'value': this.typeOptions });

  //           }
  //         });
  //       }
  //       break;
  //   }
  // }


  // onView() {
  //   // this.onSelect('type');
  //   this.SocietyMasterCols = this.tableConstants.SocietyMaster;
  //   const params = new HttpParams().set('GCode', this.g_cd.value);
  //   this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //     if (this.SocietyMasterData === undefined) {
  //       // if (this.SocietyMasterData !== undefined && this.SocietyMasterData !== 0) {
  //         this.SocietyMasterData = res.filter((value: { Tyname: any; }) => { return res.Tyname === this.typeOptions });
  //         this.SocietyMasterData = res;
  //       // }
  //     }
  //     });
  // }


  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = options;
      });
    }
  }

  // onType() {
  //   let type = [];
  //   if (this.typeOptions === undefined) {

  //     const params = new HttpParams().set('GCode', this.g_cd.value);

  //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //       this.Type = res;
  //       type.push({ 'label': this.Type.Tyname, 'value': res.GowdonCode });
  //       this.typeOptions = type;
  //       this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COPERATIVE LEADING', 'value': this.typeOptions }, { 'label': 'COPERATIVE PRIMARY', 'value': this.typeOptions });
  //       // this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'value': type.values });
  //     });
  //   }
  // }

  onType() {
    let type = [];
    if (this.typeOptions === undefined) {
      const params = new HttpParams().set('GCode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
        this.Type = res;
        if (this.typeOptions === undefined) {
          // type = res.filter((value: { Tyname: any; }) => { return res[0].Tyname === res[0].SocietyName });
          // type.push({ 'label': res[0].Tyname, 'value': type[0].Tyname });
          this.typeOptions = type;
        }
        this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.typeOptions }, { 'label': 'COOPERATIVES LEADING', 'value': this.typeOptions }, { 'label': 'COOPERATIVES PRIMARY', 'value': this.typeOptions });
        // this.typeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'value': type.values });
      });
    }
  }

  onView() {
    this.onType();
    // this.loading = true;
    const params = new HttpParams().set('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
      this.SocietyMasterData = res;
      this.filterArray = res;
      this.SocietyMasterCols = this.tableConstants.SocietyMaster;
      if (this.SocietyMasterData !== undefined && this.SocietyMasterData !== 0) {
        this.SocietyMasterData = res.filter((value: { Tyname: any; }) => { return value.Tyname === this.t_cd.label });
        // if (value.Transfertype === this.tr_cd.label) {
        // this.SocietyMasterData.push(value);
        // this.totalRecords = this.SocietyMasterData.length;
        // }
        // })
      }
      let sno = 0;
      this.SocietyMasterData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
        // this.loading = false;
      });
      if (this.SocietyMasterData !== undefined && this.SocietyMasterData.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        // this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onResetTable() {
    this.SocietyMasterData = [];
    this.isActionDisabled = true;
  }

  onSearch(value) {
    this.SocietyMasterData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.SocietyMasterData = this.SocietyMasterData.filter(item => {
        // if (item.DepositorName.toString().startsWith(value)) {
        return item.Issuername.toString().startsWith(value);
        // }
      });
    }
  }

  exportAsXLSX(): void {
    var SocietyMaster = [];
    this.SocietyMasterData.forEach(data => {
      if (data.Tyname === "CRS" || data.Tyname === "COOPERATIVES LEADING" || data.Tyname === "COOPERATIVES PRIMARY") {
        SocietyMaster.push({ SlNo: data.SlNo, Godown_Name: data.GodownName, Type_Name: data.Tyname, Society_Name: data.SocietyName, Society_Type: data.SocietyType, Society_Code: data.SocietyCode, Issuer_Name: data.Issuername })
      }
    });
    this.excelService.exportAsExcelFile(SocietyMaster, 'SocietyMaster', this.SocietyMasterCols);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.SocietyMasterCols;
    var rows = [];
    this.SocietyMasterData.forEach(element => {
      var temp = [element.SlNo, element.GodownName, element.Tyname, element.SocietyName, element.SocietyType, element.SocietyCode, element.Issuername];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Society_Master.pdf');
  }
}
