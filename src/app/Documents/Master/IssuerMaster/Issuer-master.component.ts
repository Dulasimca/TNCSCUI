import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MessageService, SelectItem } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-Issuer-master',
  templateUrl: './Issuer-master.component.html',
  styleUrls: ['./Issuer-master.component.css']
})
export class IssuerMasterComponent implements OnInit {
  IssuerMasterCols: any;
  IssuerMasterData: any;
  IssuerMasterAlterData: any;
  societyOptions: SelectItem[];
  searchText: any;
  ACSCode: any;
  Activeflag: any;
  IssuerCode: any;
  IssuerName: any;
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  Society: any;
  GCode: any;
  GName: any;
  RCode: any;
  RName: any;
  selectedRow: any;
  loading: boolean = false;
  viewPane: boolean;
  isViewed: boolean = false;
  @ViewChild('society') societyPanel: Dropdown;
  @ViewChild('f') form: FormGroup;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private excelService: ExcelService, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.IssuerMasterCols = this.tableConstants.IssuerMaster;
    this.loading = true;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.GName = this.authService.getUserAccessible().gName;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.RName = this.authService.getUserAccessible().rName;
    {
      const params = {
        'GCode': this.GCode,
        'Type': '2'
      };
      this.restApiService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(value => {
        if (value) {
          this.IssuerMasterData = value;
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

  onSelect(type) {
    let societySelection = [];
        if (type === 'enter') {
          this.societyPanel.overlayVisible = true;
        }
          const params = new HttpParams().set('GCode', this.GCode);
          this.restApiService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
           res.forEach(value => {
             societySelection.push({ label: value.SocietyName,  value: value.SocietyCode });
           })
            this.societyOptions = societySelection;
          });
  }

  onRowSelect(event, data) {
    this.viewPane = true;
    this.IssuerCode = data.IssuerCode;
    this.IssuerName= data.Issuername;
    this.ACSCode = data.ACSCode;
    this.Activeflag = data.Activeflag;
  }

  addNew() {
    this.viewPane = true;
    this.form.controls.Iss_Code.reset();
    this.form.controls.Iss_Code.reset();
    this.form.controls.Acs_Code.reset();
    this.form.controls.Iss_Name.reset();
    this.form.controls.Flag.reset();
    this.form.controls.Society_Type.reset();
  }

  onSave() {
    const params = {
      'IssuerCode': this.selectedRow.IssuerCode,
      'Activeflag': (this.selectedRow.Activeflag == 'I') ? (this.selectedRow.ACSCode = "-", this.selectedRow.Activeflag = 'I') : this.selectedRow.Activeflag,
      'ACSCode': this.selectedRow.ACSCode,
      'Godcode': this.selectedRow.Godcode
    };
    this.restApiService.put(PathConstants.ISSUER_MASTER_PUT, params).subscribe(ress => {
      if (ress) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
  }

  onSearch(value) {
    this.IssuerMasterData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerMasterData = this.IssuerMasterData.filter(item => {
        return item.Issuername.toString().startsWith(value);
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

  print() { }
}