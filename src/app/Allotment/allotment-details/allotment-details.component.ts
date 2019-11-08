import { Component, OnInit, ViewChild } from '@angular/core';
import { Dropdown, SelectItem } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

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
  societyData = [];
  regionName: string;
  godownName: string;
  GCode: string;
  RCode: string;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;


  constructor(private authService: AuthService, private datepipe: DatePipe, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = "0" + (new Date().getMonth() + 1);
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
    const params = { 'Type': 2, 'GCode': this.GCode}
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
  this.AllotmentCols = []; this.AllotmentData = [];
  let filesData = event.target.files;
  this.parseExcel(filesData[0]);
}

parseExcel(file) {  
  let reader = new FileReader();  
  reader.onload = (e)=> {  
    let data = (<any>e.target).result;  
    let workbook = XLSX.read(data, {  
      type: 'binary'  
    });  
    workbook.SheetNames.forEach((function(sheetName) {  
      // convert execl data into JSON 
      let columns: Array<any> = [];
      let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);  
      let headers = get_header_row(workbook.Sheets[sheetName]);
      //console.log('header', headers);
      headers.forEach(c => {
        // c = c.replace(/\s/g, "");
       // console.log('tr', c);
        let val: string = c.toUpperCase();
        this.allotmentCommodity.forEach(y => {
          if(val.includes(y.Acommname)) {
         //   console.log('com',val, y);
          }
        })
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
      this.totalRecords = data.length; 
      this.AllotmentData = data;
      let i = 0;
      for (let obj of this.AllotmentData) {
        for (let key in obj) {
            if(key === 'FPS Code') {
              this.societyData.forEach(x => {
                if(obj[key] === x.ACSCode.trim() && i < this.AllotmentData.length) { 
                  obj['Societycode'] = x.Societycode; //adding new key value pair
                  i += 1; 
                 }
              })
            } else {
            let k = key.replace(/\s/g, "");
          //  console.log('tr', k);
        let val: string = k.toUpperCase();
        this.allotmentCommodity.forEach(y => {
          if(val.includes(y.Acommname)) {
            console.log('com',val, y);
          }
        })
      }
    }
  }
    // console.log('data', this.AllotmentData);
   
    }).bind(this), this);  
  };  

  reader.onerror = function(ex) {  
    console.log(ex);  
  };  
  reader.readAsBinaryString(file);  
};  
}

function get_header_row(sheet) {
  var headers = [];
  var range = XLSX.utils.decode_range(sheet['!ref']);
  var C, R = range.s.r; /* start in the first row */
  /* walk every column in the range */
  for(C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

      headers.push(hdr);
  }
  return headers;
}

export interface Allotment {
  FPSName: string;
  FPSCode: string;
  SocietyCode: string;
  ITCode: string;
  GCode: string;
  RCode: string;
  ITName: string;
  Quantity: any;
}


