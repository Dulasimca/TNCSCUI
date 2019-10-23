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
import { FormGroup, NgForm } from '@angular/forms';

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
  IssuerName: string;
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
  SocietyCode: any;
  isEdited: boolean;
  societySelection = [];
  @ViewChild('society') societyPanel: Dropdown;
  @ViewChild('f') form: NgForm;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private excelService: ExcelService, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.IssuerMasterCols = this.tableConstants.IssuerMaster;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.GName = this.authService.getUserAccessible().gName;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.RName = this.authService.getUserAccessible().rName;
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
      this.onLoadData();
    const params = new HttpParams().set('GCode', this.GCode);
    this.restApiService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        var uniqueArray = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
        for (var index in uniqueArray) {
          var code = uniqueArray[index];
          let i = res.findIndex(cd => cd.SocietyCode === code);
          this.societySelection.push({ 'label': res[i].SocietyName, 'value': code });
        }
        this.societyOptions = this.societySelection;
        this.societyOptions.unshift({ label: '-select', value: null });
      } else {
        this.societyOptions = this.societySelection;
      }
    });
  }

  onSelect(type) {
        if (type === 'enter') {
          this.societyPanel.overlayVisible = true;
        }
        this.societyOptions = this.societySelection;
  }

  onLoadData(){
    this.loading = true;
    const params = {
      'GCode': this.GCode,
      'Type': '2'
    };
    this.restApiService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.IssuerMasterData = res;
        this.loading = false;
        let sno = 0;
        this.IssuerMasterData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      } else{
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }


  onRowSelect(event, selectedRow) {
    this.isEdited = true;
    this.viewPane = true;
    this.IssuerCode = selectedRow.IssuerCode;
    this.IssuerName= selectedRow.Issuername.trim();
    this.ACSCode = selectedRow.ACSCode;
    this.Activeflag = selectedRow.Activeflag;
    this.SocietyCode = selectedRow.Societycode;
    if(selectedRow.Societycode !== null && selectedRow.Societycode !== '' && selectedRow.Societycode !== undefined) {
     this.societySelection.filter(x => {
         if(x.value === selectedRow.Societycode) { 
           this.Society = x.label; 
           this.societyOptions = [{ label: x.label, value: x.value }];
          }
      })
    } else { this.Society = null; this.societyOptions = [] }
  }

  onSave() {
    const params = {
      'IssuerCode': (this.IssuerCode !== undefined && this.IssuerCode !== null) ? this.IssuerCode : 0,
      'Activeflag': this.Activeflag,
      'ACSCode': (this.ACSCode !== undefined && this.ACSCode !== null) ? this.ACSCode : '',
      'GCode': this.GCode,
      'RCode': this.RCode,
      'IssuerName': this.IssuerName,
      'SocietyCode': (this.SocietyCode !== undefined && this.SocietyCode !== null) ? this.SocietyCode : this.Society.value
    };
    this.restApiService.post(PathConstants.ISSUER_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.viewPane = false;
        this.onLoadData();
        this.onClear();
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.viewPane = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    },(err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
  }

  onClear() {
    this.form.controls.Iss_Code.reset();
    this.form.controls.Iss_Code.reset();
    this.form.controls.Acs_Code.reset();
    this.form.controls.Iss_Name.reset();
    this.form.controls.Flag.reset();
    this.form.controls.Society_Type.reset();
    //this.form.form.markAsUntouched();
    // this.form.form.markAsPristine();
    this.isEdited = false;
  }

  onSearch(value) {
    this.IssuerMasterData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerMasterData = this.IssuerMasterData.filter(item => {
        return item.Issuername.toString().startsWith(value);
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
