export class TableConstants {
  DailyStockStatement: any;
  GodownMasterData: any;
  CrsData: any;
  MrmData: any;
  HullingAgenciesData:any;
  FciData: any;
  RegionData: any;
  SupplierData:any;
  AadsData: any;
  Notification: any;
  SchemeData: any;

  constructor() {
    this.DailyStockStatement = [
      {
        "field": 'commodity', "header": 'Commodity'
      },
      { "field": 'openingBalance', "header": 'Opening Balance' },
      { "field": 'totalReceipt', "header": 'Total Receipt' },
      { "field": 'grandTotalIssue', "header": 'Grand Total Issue' },
      { "field": 'saleIssue', "header": 'Sale Issue' },
      { "field": 'totalIssue', "header": 'Total Issue' },
      { "field": 'otherISsue', "header": 'Other Issue' },
      { "field": 'bookBalance', "header": 'Book Balance' },
      { "field": 'woff', "header": 'Cs0104+CU.YrCS-WOFF' },
      { "field": 'physicalBalance', "header": 'Physical Balance' }

    ]
    this.GodownMasterData = [
      { "field": 'Name', "header": 'Region Name' },
      { "field": 'Capacity', "header": 'Capacity' },
      { "field": 'Carpet', "header": 'Carpet' }
    ]
    this.CrsData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'Issuername', "header": 'Issuer Name' },
      { "field": 'RegionName', "header": 'Region Name' },
      { "field": 'SocietyName', "header": 'Society Name' },
      { "field": 'GodownName', "header": 'Godown Name' }
    ]
    this.MrmData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.HullingAgenciesData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.FciData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.SupplierData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.RegionData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'RGNAME', "header": 'Register Name' }
    ]
    this.AadsData = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'DepositorName', "header": 'Depositor Name' },
      { "field": 'RegionName', "header": 'Region Name' },
      { "field": 'GodownName', "header": 'Godown Name' }
    ]
    this.SchemeData = []
    this.Notification = [
      { "field": 'SlNo', "header": 'SlNo' },
      { "field": 'Notes', "header": 'Description' }
    ]
  }
}
