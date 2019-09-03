import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-Issuer-master',
  templateUrl: './Issuer-master.component.html',
  styleUrls: ['./Issuer-master.component.css']
})
export class IssuerMasterComponent implements OnInit {
  IssuerMasterCols: any;
  IssuerMasterData: any;
  IssuerMasterAlterData: any;
  ACSCode: any;
  Activeflag: any;
  IssuerCode: any;
  Godcode: any;
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  gCode: any;
  I_cd: any;
  Type: any;
  IssuerOptions: SelectItem[];
  disableOkButton: boolean = true;
  selectedRow: any;
  loading: boolean = false;
  viewPane: boolean;
  isViewed: boolean = false;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private excelService: ExcelService, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.IssuerMasterCols = this.tableConstants.IssuerMaster;
    this.loading = true;
    this.gCode = this.authService.getUserAccessible().gCode;
    {
      const params = {
        'GCode': this.gCode,
        'Type': '2'
      };
      this.restApiService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(value => {
        if (value) {
          this.IssuerMasterData = value;
          this.Type = value;
          if (this.IssuerOptions !== undefined) {
            this.IssuerMasterData = value.filter((value: { Activeflag: any; }) => { return value.Activeflag === this.I_cd });
          }
          this.loading = false;
          this.filterArray = value;
          let sno = 0;
          this.IssuerMasterData.forEach(data => {
            sno += 1;
            data.SlNo = sno;
          });
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
          }];
      });
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    this.ACSCode = this.selectedRow.ACSCode;
    this.Activeflag = this.selectedRow.Activeflag;
    this.IssuerCode = this.selectedRow.IssuerCode;
    this.Godcode = this.selectedRow.Godcode;
  }

  onIssuer() {
    let type = [];
    let IssuerSelection = [];
    if (this.IssuerOptions === undefined) {
      this.IssuerOptions = IssuerSelection;
    }
    this.IssuerOptions.unshift({ 'label': 'A', 'value': this.IssuerOptions }, { 'label': 'I', 'value': this.IssuerOptions });
    this.IssuerMasterData;
  }

  onView() {
    this.IssuerMasterData = this.filterArray;
    if (this.I_cd !== undefined) {
      this.IssuerMasterData.forEach(s => {
        this.IssuerMasterData = this.Type.filter((value: { Activeflag: any; }) => { return value.Activeflag === this.I_cd.label });
      });
    }
  }

  onSave(selectedRow) {
    const params = {
      'IssuerCode': this.selectedRow.IssuerCode,
      'ACSCode': this.selectedRow.ACSCode,
      'Activeflag': this.selectedRow.Activeflag,
      'Godcode': this.selectedRow.Godcode
    };
    this.restApiService.put(PathConstants.ISSUER_MASTER_PUT, params).subscribe(ress => {
      if (ress) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
  }

  onSearch(value) {
    this.IssuerMasterData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerMasterData = this.IssuerMasterData.filter(item => {
        return item.IssuerCode.toString().startsWith(value);
        // }
      });
    }
  }

  exportAsXLSX(): void {
    var IssuerMaster = [];
    this.IssuerMasterData.forEach(data => {
      IssuerMaster.push({ SlNo: data.SlNo, Issuer_Code: data.IssuerCode, Issuer_Name: data.Issuername, Godown_Code: data.Godcode, ACSCode: data.ACSCode, Activeflag: data.Activeflag })
    });
    this.excelService.exportAsExcelFile(IssuerMaster, 'Issuer_Master', this.IssuerMasterCols);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.IssuerMasterCols;
    var rows = [];
    this.IssuerMasterData.forEach(element => {
      var temp = [element.SlNo, element.IssuerCode, element.Issuername, element.Godcode, element.ACSCode, element.Activeflag];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Issuer_Master_Report.pdf');
  }
}