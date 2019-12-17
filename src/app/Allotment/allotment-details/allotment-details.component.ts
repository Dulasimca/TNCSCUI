import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Dropdown, SelectItem, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { saveAs } from 'file-saver';
import { TableConstants } from 'src/app/constants/tableconstants';
import * as _ from 'lodash';

@Component({
  selector: 'app-allotment-details',
  templateUrl: './allotment-details.component.html',
  styleUrls: ['./allotment-details.component.css']
})
export class AllotmentDetailsComponent implements OnInit {
  roleId: any;
  canShowMenu: boolean;
  month: any;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: any;
  username: any;
  curMonth: any;
  AllotmentCols: any = [];
  AllotmentData: any = [];
  totalRecords: number;
  allotmentCommodity = [];
  itemList = [];
  societyData: any;
  allotmentDetails: Array<Allotment> = [];
  regionName: string;
  godownName: string;
  GCode: string;
  RCode: string;
  errMsg: string;
  loading: boolean;
  disableSave: boolean;
  regions: any;
  data: any;
  regionOptions: SelectItem[];
  loggedInRCode: any;
  godownOptions: SelectItem[];
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('fileSelector') fileSelector: ElementRef;

  constructor(private authService: AuthService, private datepipe: DatePipe, private restAPIService: RestAPIService,
    private messageService: MessageService, private roleBasedService: RoleBasedService,
    private tableConstants: TableConstants) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = ((new Date().getMonth() + 1) <= 9) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.regions = this.roleBasedService.getRegions();
    this.data = this.roleBasedService.getInstance();
    this.restAPIService.get(PathConstants.ALLOTMENT_COMMODITY_MASTER).subscribe(data => {
      this.allotmentCommodity = data;
    })
  }

  onSelect(selectedItem, type) {
    let regionSelection = [];
    let godownSelection = [];
    let yearArr: any = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        if (type === 'enter') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
        case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if (x.RCode === this.loggedInRCode) {
                  regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
          break;
        case 'gd':
          if (type === 'enter') {
            this.godownPanel.overlayVisible = true;
          }
          if (this.data !== undefined) {
            this.data.forEach(x => {
              if (x.RCode === this.RCode) {
                godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
              }
            });
            this.godownOptions = godownSelection;
            if (this.GCode !== undefined && this.GCode !== null) {
              if (this.godownOptions.length <= 1 && this.AllotmentData.length === 0) {
                this.getAllotmentDetails();
              }
            }
          break;
    }
  }
  }

  getAllotmentDetails() {
    if(this.GCode !== undefined && this.GCode !== null && this.month !== null && this.month !== undefined
     && ((this.month.value !== undefined && this.month.value !== null) 
     || (this.curMonth !== undefined && this.curMonth !== null)) && this.year !== null 
     && this.year !== undefined && this.curMonth !== null && this.curMonth !== undefined) {
    const params = new HttpParams().set('GCode', this.GCode)
    .append('AMonth', (this.month.value !== undefined && this.month.value !== null) ? this.month.value : this.curMonth)
    .append('AYear', this.year);
    this.loading = true;
    this.AllotmentData = [];
    this.AllotmentCols = [];
    this.restAPIService.getByParameters(PathConstants.ALLOTMENT_BALANCE_GET, params).subscribe(res => {
      if(res.length !== 0 && res !== undefined && res !== null) {
        this.AllotmentCols = this.tableConstants.AllotmentDetailsCols;
        let sno = 1;
        res.forEach(x => {
          x.SlNo = sno;
          sno += 1;
        })
        this.AllotmentData = res;
        this.loading = false;
        this.disableSave = true;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      this.disableSave = false;
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
  }

  uploadData(event) {
    this.AllotmentCols.length = 0;
    this.allotmentDetails.length = 0;
    this.AllotmentData.length = 0;
    let filesData = event.target.files;
    if(this.GCode !== undefined && this.GCode !== null) {
      const params = { 'Type': 2, 'GCode': this.GCode }
      this.restAPIService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(data => {
        this.societyData = data.filter(x => {
          const acsCode: string = (x.ACSCode !== null) ? x.ACSCode : '';
          const flag: string = (x.Activeflag !== null) ? x.Activeflag : '';
          return (acsCode.trim() !== '' && x.Activeflag.trim() === 'A');
        });
        let sortedArray = _.sortBy(this.societyData, 'ACSCode');
        this.societyData = sortedArray;
        if (checkfile(filesData[0])) {
          this.parseExcel(filesData[0]);
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: this.errMsg });
        }
      })
    }
  }

  parseExcel(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let data = (<any>e.target).result;
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      let sheetName: any = workbook.SheetNames[0];
        let columns: Array<any> = [];
        let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        let headers = get_header_row(workbook.Sheets[sheetName]);
        let isValid = this.checkValidHeaders(headers);
        if(isValid.result) {
        headers.forEach(c => {
          this.AllotmentCols.push({ header: c, field: c, width: '100px !important' });
        })
        let object = Object.keys(XL_row_object).reduce((acc, k) => {
          let key = XL_row_object[k];
          acc[key] = acc[key] || [];
          acc[key].push(k);
          return acc;
        }, {});
        let json_object = JSON.stringify(XL_row_object);
        // bind the parse excel file data to Grid  
        let JSONdata = JSON.parse(json_object);
        if (JSONdata[1]['Godown Code'] === this.GCode) {
          this.loading = true;
          this.disableSave = false;
          this.totalRecords = JSONdata.length;
          this.AllotmentData = JSONdata;
          const objLen = this.AllotmentCols.length - 6;
          var tempArr = [];
          var k = 1;
          let missingSocietyCode: string = '';
          for (let obj of this.AllotmentData) {
            for (let key in obj) {
              if(obj['#'] !== 'Total') {
              obj['FPSName'] = obj['FPS Name'];
              if (key === 'FPS Code') {
                const acscode: string =  obj[key].trim();
                let matchCode = this.societyData.find(x => x.ACSCode.trim() === acscode);
                if(matchCode !== undefined && matchCode !== null) {
                  if(matchCode.Societycode !== null && matchCode.Societycode !== undefined) {
                  obj['Societycode'] = matchCode.Societycode;
                  } else {
                  tempArr.push(' ' + k + ') ' +  obj[key]);
                  k += 1;
                }
              }
                if(tempArr.length !== 0) {
                   const content = (tempArr.length === 1) ? ' is missing !' : ' are missing !';
                   missingSocietyCode = ' SocietyCode for the following FPS Code ' + tempArr + content;
                   this.onClear();
                   this.messageService.clear();
                   this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: missingSocietyCode });
                }
              } else if (key !== 'FPS Code' && key !== '#' && key !== 'Taluk' && key !== 'FPS Name'
                && key !== 'Godown Name' && key !== 'Godown Code') {
                let j = 0;
                this.allotmentCommodity.forEach(c => {
                  const len = key.length;
                  const trim: string = key.slice(len - 5, len);
                  const val: string = key.replace(trim, '').replace(/\s/g, '').toUpperCase();
                  const commodity: string = c.Acommname;
                  if (j < objLen) {
                    if (val === commodity.replace(/\s/g, '')) {
                      this.itemList.push({ ITCode: c.Acommcode, ITName: val, Quantity: obj[key] });
                    }
                    obj['ItemList'] = this.itemList; //adding new key value pair
                    j += 1;
                  } else {
                    this.itemList = [];
                  }
                })
              }
            }
            }
            this.itemList = [];
          }
          this.constructData(this.AllotmentData);
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.GodownCodeMismatch });
        }
        } else {
          let missingFields: string = '';
          if(isValid.res.length > 1) {
            isValid.res.forEach((x, index) => {
              missingFields += (index + 1) + '.' + x.toUpperCase() + ' ';
            })
            missingFields += ' columns are missing!';
          } else { missingFields = isValid.res[0].toUpperCase() + ' column is missing!'; }
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: missingFields });
        }
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };

  checkValidHeaders(headers): any {
    let result: boolean;
    let tempArr = ['Taluk', 'FPS Code', 'FPS Name', 'Godown Name', 'Godown Code'];
    if(headers !== undefined && headers !== null && headers.length !== 0) {
    let res =  tempArr.filter(f => !headers.includes(f));
      if(res.length !== 0) {
        result = false;
      } else {
        result = true;
      }
    return { result, res }
  }
}

  constructData(data) {
    let records = 1;
    data.forEach(i => {
      if (records < data.length) {
        this.allotmentDetails.push({
          Type: 2, FPSName: i['FPS Name'], FPSCode: i['FPS Code'],
          ItemList: i.ItemList, GCode: this.GCode, RCode: this.RCode, Taluk: i.Taluk, SocietyCode: i.Societycode,
          AllotmentMonth: (this.month.value !== undefined) ? this.month.value : this.curMonth, AllotmentYear: this.year
        });
        records += 1;
      }
    })
    this.loading = false;
  }

  onResetTable(item) {
    if(item === 'reg') { 
      this.GCode = null;
      this.getAllotmentDetails();
    } else {
      this.getAllotmentDetails();
    }
  }

  onSave() {
    this.disableSave = true;
    this.loading = true;
    const params = JSON.stringify(this.allotmentDetails);
    this.restAPIService.post(PathConstants.ALLOTMENT_QUANTITY_POST, this.allotmentDetails).subscribe((res: any) => {
      if (res.Item1) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.loading = false;
        this.disableSave = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.disableSave = false;
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.disableSave = false;
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }

  onClear() {
    this.AllotmentData = [];
    this.AllotmentCols.length = 0;
    this.totalRecords = 0;
    this.disableSave = false;
    this.RCode = null; this.GCode = null;
    this.curMonth = ((new Date().getMonth() + 1) <= 9) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.fileSelector.nativeElement.value = null;
  }

  downloadSample() {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=UTF-8';
    const path = "../../assets/Sample_Allotment/Sample_Excel.xlsx";
    const filename = 'Sample_Excel' + ".xlsx";
    saveAs(path , filename);
  }
}




function checkfile(sender) {
  var validExts = new Array(".xlsx", ".xls");
  var fileName: string = sender.name;
  var fileExt = fileName.substring(fileName.lastIndexOf('.'));
  if (validExts.indexOf(fileExt) < 0) {
    this.errMsg = "Invalid file selected, valid files are of " +
    validExts.toString() + " types.";
    return false;
  }
  else return true;
}

function get_header_row(sheet) {
  var headers = [];
  var range = XLSX.utils.decode_range(sheet['!ref']);
  var C, R = range.s.r; /* start in the first row */
  /* walk every column in the range */
  for (C = range.s.c; C <= range.e.c; ++C) {
    var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */

    var hdr = "HEADER " + C; // <-- replace with your desired default 
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

    headers.push(hdr);
  }
  return headers;
}

export interface Allotment {
  Type: number;
  FPSName: string;
  FPSCode: string;
  SocietyCode: string;
  GCode: string;
  RCode: string;
  Taluk: string;
  AllotmentMonth: any;
  AllotmentYear: any;
  ItemList: any[];
}

export interface ItemList {
  ITCode: any;
  ITName: any;
  Quantity: any;
}


