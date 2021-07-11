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
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-Issuer-master',
  templateUrl: './Issuer-master.component.html',
  styleUrls: ['./Issuer-master.component.css']
})
export class IssuerMasterComponent implements OnInit {
  IssuerMasterCols: any;
  IssuerMasterData: any = [];
  PristineData: any = [];
  societyOptions: SelectItem[];
  issuerTypeOptions: SelectItem[];
  categoryOptions: SelectItem[];
  searchText: any;
  searchAcs: any;
  CategoryType: any;
  ACSCode: string;
  Activeflag: any;
  IssuerNo: any;
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
  IssuerType: any;
  selectedRow: any;
  loading: boolean = false;
  viewPane: boolean;
  SocietyCode: any;
  isEdited: boolean;
  CategoryId: any;
  Tycode: any;
  Beneficiaries: any;
  enableSociety: boolean = true;
  enableACS: boolean = true;
  GSTNumber: string;
  @ViewChild('society', { static: false }) societyPanel: Dropdown;
  @ViewChild('category', { static: false }) categoryPanel: Dropdown;
  @ViewChild('issuer', { static: false }) issuerPanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;


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
  }

  onSelect(type, id) {
    let issueTypeSelection = [];
    let societySelection = [];
    let categorySelection = [];
    switch (id) {
      case 'soc':
        if (type === 'tab') {
          this.societyPanel.overlayVisible = true;
        }
        if (this.GCode !== undefined && this.GCode !== null) {
          const params = new HttpParams().set('GCode', this.GCode);
          this.restApiService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
            if (res !== undefined && res !== null && res.length !== 0) {
              var uniqueArray = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
              for (var index in uniqueArray) {
                var code = uniqueArray[index];
                let i = res.findIndex(cd => cd.SocietyCode === code);
                societySelection.push({ label: res[i].SocietyName, value: code });
              }
              this.societyOptions = societySelection;
              this.societyOptions.unshift({ label: '-select', value: null });
            } else {
              this.societyOptions = societySelection;
            }
          });
        }
        break;
      case 'iss':
        if (type === 'tab') {
          this.issuerPanel.overlayVisible = true;
        }
        const params = new HttpParams().set('TRCode', 'All').append('GCode', this.GCode);
        this.restApiService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((values: any) => {
          if (values !== null && values !== undefined && values.length !== 0) {
            values.forEach(rt => {
              issueTypeSelection.push({ label: rt.Tyname, value: rt.Tycode });
            });
            this.issuerTypeOptions = issueTypeSelection;
            this.issuerTypeOptions.unshift({ label: '-select-', value: null, disabled: true });
          } else {
            this.issuerTypeOptions = issueTypeSelection;
          }
        });
        break;
      case 'cat':
        if (type === 'tab') {
          this.categoryPanel.overlayVisible = true;
        }
        if (this.IssuerType !== undefined && this.IssuerType !== null) {
          if ((this.IssuerType.value !== null && this.IssuerType.value !== undefined) ||
            (this.Tycode !== null && this.Tycode !== undefined)) {
            let tyCode = (this.IssuerType.value !== null && this.IssuerType.value !== undefined) ? this.IssuerType.value
              : (this.Tycode !== undefined && this.Tycode !== null) ? this.Tycode : 0;
            const params = new HttpParams().set('Tycode', tyCode);
            this.restApiService.getByParameters(PathConstants.TYPE_CATEGORY_GET, params).subscribe((values: any) => {
              if (values !== null && values !== undefined && values.length !== 0) {
                values.forEach(c => {
                  categorySelection.push({ label: c.Name, value: c.CategoryId });
                });
                this.categoryOptions = categorySelection;
                this.categoryOptions.unshift({ label: '-select-', value: null, disabled: true });
              } else {
                this.categoryOptions = categorySelection;
              }
            });
          }
        }
        break;
    }
  }

  onLoadData() {
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
        this.PristineData = this.IssuerMasterData;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });
  }

  onChange() {
    this.CategoryType = null;
    this.CategoryId = null;
    if (this.IssuerType !== undefined && this.IssuerType !== null) {
      if ((this.IssuerType.value !== undefined && this.IssuerType.value !== null) ||
        (this.Tycode !== null && this.Tycode !== undefined)) {
        let tycode = (this.IssuerType.value !== undefined && this.IssuerType.value !== null) ? this.IssuerType.value : this.Tycode;
        if (tycode === 'TY002' || tycode === 'TY003' || tycode === 'TY004') {
          this.enableSociety = false;
          this.enableACS = false;
        } else {
          this.enableSociety = true;
          this.enableACS = true;
          this.Society = null;
          // this.societyOptions = [];
          this.SocietyCode = null;
        }
      }
    }
  }

  onRowSelect(event, selectedRow) {
    this.isEdited = true;
    this.viewPane = true;
    this.IssuerNo = selectedRow.IssuerNo;
    this.IssuerCode = selectedRow.IssuerCode;
    this.IssuerName = selectedRow.Issuername.trim();
    this.ACSCode = selectedRow.ACSCode;
    this.Activeflag = selectedRow.Activeflag;
    this.SocietyCode = selectedRow.Societycode;
    this.Society = selectedRow.SocietyName;
    this.societyOptions = [{ label: selectedRow.SocietyName, value: selectedRow.Societycode }];
    this.CategoryType = selectedRow.CategoryName;
    this.CategoryId = selectedRow.CategoryId;
    this.Beneficiaries = selectedRow.Beneficiaries;
    this.categoryOptions = [{ label: selectedRow.CategoryName, value: selectedRow.CategoryId }];
    this.IssuerType = selectedRow.Tyname;
    this.Tycode = selectedRow.IssuerType;
    this.issuerTypeOptions = [{ label: selectedRow.Tyname, value: selectedRow.IssuerType }];
    this.GSTNumber = selectedRow.GSTNumber.toUpperCase().trim();
    this.onChange();
  }

  onSave() {
    const params = {
      'IssuerNo': (this.IssuerNo !== undefined && this.IssuerNo !== null) ? this.IssuerNo : 0,
      'IssuerCode': (this.IssuerCode !== undefined && this.IssuerCode !== null) ? this.IssuerCode : 0,
      'Activeflag': this.Activeflag,
      'ACSCode': (this.ACSCode !== undefined && this.ACSCode !== null) ? this.ACSCode.trim().toUpperCase() : '',
      'GCode': this.GCode,
      'RCode': this.RCode,
      'IssuerName': this.IssuerName,
      'SocietyCode': (this.Society !== undefined && this.Society !== null && this.Society.value !== undefined && this.Society.value !== null)
        ? this.Society.value : (this.SocietyCode !== undefined && this.SocietyCode !== null) ? this.SocietyCode : '-',
      'Tycode': (this.IssuerType !== undefined && this.IssuerType !== null && this.IssuerType.value !== undefined
        && this.IssuerType.value !== null) ? this.IssuerType.value : (this.Tycode !== undefined && this.Tycode !== null) ? this.Tycode : '-',
      'CategoryId': (this.CategoryType !== undefined && this.CategoryType !== null &&
        this.CategoryType.value !== undefined && this.CategoryType.value !== null) ? this.CategoryType.value
        : (this.CategoryId !== undefined && this.CategoryId !== null) ? this.CategoryId : 0,
      'NoOfBeneficiaries': (this.Beneficiaries !== undefined && this.Beneficiaries !== null) ? this.Beneficiaries : 0,
      'GSTNumber': (this.GSTNumber !== null && this.GSTNumber !== undefined) ?
        ((this.GSTNumber.trim() !== '') ? this.GSTNumber.trim().toUpperCase() : '') : ''

    };
    this.restApiService.post(PathConstants.ISSUER_MASTER_POST, params).subscribe(res => {
      if (res.Item1) {
        this.viewPane = false;
        this.onLoadData();
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });

      } else {
        this.viewPane = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: 'ACSCode - ' + this.ACSCode.trim().toUpperCase() +
            ' is active in ' + res.Item2.Table[0].TNCSName + ' godown. Permission denied!'
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onClear() {
    this.form.controls.Iss_Code.reset();
    this.form.controls.Iss_Code.reset();
    this.form.controls.Acs_Code.reset();
    this.form.controls.Iss_Name.reset();
    // this.form.controls.Flag.reset();
    this.form.controls.Society_Type.reset();
    this.form.controls.Category_Type.reset();
    this.form.controls.Issuer_Type.reset();
    this.form.controls.No_of_beneficaries.reset();
    this.form.controls.GST_No.reset();
    this.SocietyCode = null; this.Tycode = null; this.CategoryId = null;
    this.IssuerCode = null; this.IssuerType = null; this.Society = null;
    this.ACSCode = null; this.IssuerName = null; this.Activeflag = null;
    this.CategoryType = null; this.Beneficiaries = null;
    this.issuerTypeOptions = []; this.societyOptions = []; this.categoryOptions = [];
    this.isEdited = false; this.Activeflag = 'A';
    this.GSTNumber = null;
  }

  onSearch(value) {
    this.IssuerMasterData = this.PristineData;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerMasterData = this.PristineData.filter(item => {
        return item.Issuername.toString().toUpperCase().startsWith(value);
      });
    } else {
      this.IssuerMasterData = this.PristineData;
    }
  }

  onIssuer(value) {
    this.IssuerMasterData = this.PristineData;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.IssuerMasterData = this.PristineData.filter(item => {
        return item.ACSCode.toString().toUpperCase().startsWith(value);
      });
    } else {
      this.IssuerMasterData = this.PristineData;
    }
  }

  exportAsXLSX(): void {
    var IssuerMaster = [];
    this.IssuerMasterData.forEach(data => {
      IssuerMaster.push({
        SlNo: data.SlNo, Issuer_Code: data.IssuerCode, Issuer_Name: data.Issuername, Godown_Code: data.Godcode,
        ACSCode: data.ACSCode, Activeflag: data.Activeflag
      })
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
