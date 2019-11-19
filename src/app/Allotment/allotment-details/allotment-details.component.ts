import { Component, OnInit, ViewChild } from '@angular/core';
import { Dropdown, SelectItem, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

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
  societyData = [];
  allotmentDetails: Array<Allotment> = [];
  regionName: string;
  godownName: string;
  GCode: string;
  RCode: string;
  errMsg: string;
  loading: boolean;
  disableSave: boolean;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;



  constructor(private authService: AuthService, private datepipe: DatePipe, private restAPIService: RestAPIService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = ((new Date().getMonth() + 1) <= 9) ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.restAPIService.get(PathConstants.ALLOTMENT_COMMODITY_MASTER).subscribe(data => {
      this.allotmentCommodity = data;
    })
    const params = { 'Type': 2, 'GCode': this.GCode }
    this.restAPIService.getByParameters(PathConstants.ISSUER_MASTER_GET, params).subscribe(data => {
      this.societyData = data;
    })
  }

  onSelect(selectedItem, type) {
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
    }
  }

  uploadData(event) {
    this.AllotmentCols = [];
    this.allotmentDetails = [];
    this.AllotmentData = [];
    let filesData = event.target.files;
    if (checkfile(filesData[0])) {
      this.parseExcel(filesData[0]);
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: this.errMsg });
    }
  }

  parseExcel(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let data = (<any>e.target).result;
      let workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach((function (sheetName) {
        // convert execl data into JSON 
        let columns: Array<any> = [];
        let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        let headers = get_header_row(workbook.Sheets[sheetName]);
        //console.log('header', headers);
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
        let data = JSON.parse(json_object);
        if (data[1]['Godown Code'] === this.GCode) {
          this.loading = true;
          this.disableSave = false;
          this.totalRecords = data.length;
          this.AllotmentData = data;
          let i = 0;
          const objLen = this.AllotmentCols.length - 6;
          for (let obj of this.AllotmentData) {
            for (let key in obj) {
              obj['FPSName'] = obj['FPS Name'];
              if (key === 'FPS Code') {
                this.societyData.forEach(x => {
                  if (x.ACSCode !== null) {
                    const acscode: string = x.ACSCode;
                    if (obj[key] === acscode.trim() && i < this.AllotmentData.length) {
                      obj['Societycode'] = x.Societycode; //adding new key value pair
                      i += 1;
                    }
                  }
                })
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
            this.itemList = [];
          }
          this.constructData(this.AllotmentData);
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.GodownCodeMismatch });
        }
      }).bind(this), this);
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };

  constructData(data) {
    let records = 1;
    data.forEach(i => {
      if (records < data.length) {
        this.allotmentDetails.push({
          FPSName: i['FPS Name'], FPSCode: i['FPS Code'],
          ItemList: i.ItemList, GCode: this.GCode, RCode: this.RCode, Taluk: i.Taluk, SocietyCode: i.Societycode,
          AllotmentMonth: (this.month.value !== undefined) ? this.month.value : this.curMonth, AllotmentYear: this.year
        });
        records += 1;
      }
    })
    this.loading = false;
  }

  onSave() {
    this.disableSave = true;
    this.loading = true;
    const params = JSON.stringify(this.allotmentDetails);
    this.restAPIService.post(PathConstants.ALLOTMENT_QUANTITY_POST, this.allotmentDetails).subscribe((res: any) => {
      if (res) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item1 });
      } else {
       // this.disableSave = false;
        this.loading = false;
        this.disableSave = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.GodownCodeMismatch });
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
  // } else if (!fileName.startsWith('FPS_')) {
  //   this.errMsg = "Invalid file selected, please select a valid file";
  //   return false;
  // }
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


