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
  StockPurchase: any;

  constructor() {
    this.DailyStockStatement = [
      { "field": 'Name', "header": 'Commodity', "text-align": "left" },
      { "field": 'OpeningBalance', "header": 'OB' },
      { "field": 'TotalReceipt', "header": 'Receipt' },
      { "field": 'Receipt', "header": 'Total Receipt' },
      { "field": 'IssueSales', "header": 'Sales' },
      { "field": 'IssueOthers', "header": 'Other Issue' },
      { "field": 'TotalIssue', "header": 'Total Issue' },
      { "field": 'ClosingBalance', "header": 'Closing Balance' },
      { "field": 'CSBalance', "header": 'Cummilative Shortage' },
      { "field": 'Shortage', "header": 'Current CS' },
      { "field": 'PhycialBalance', "header": 'Physical Balance' },
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

    this.StockPurchase = [
      {
        "field": 'depositorName', "header": 'Depositor Name'
      },
      { "field": 'itemName', "header": 'Item Name' },
      { "field": 'qty', "header": 'Quantity' },
      { "field": 'orderNumber', "header": 'Order Number' },
      { "field": 'remarks', "header": 'Remarks' }]
  }
  }
