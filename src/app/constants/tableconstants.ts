export class TableConstants {
  DailyStockStatement: any;
  GodownMasterData: any;
  CrsData: any;
  MrmData: any;
  HullingAgenciesData: any;
  FciData: any;
  RegionData: any;
  SupplierData: any;
  AadsData: any;
  Notification: any;
  SchemeData: any;
  StockPurchase: any;
  CBStatementColumns: any;
  DeliveryDocumentcolumns: any;
  DeliveryItemColumns: any;
  DeliveryItemSchemeColumns: any;
  DeliveryPaymentcolumns: any;
  DeliveryPaymentBalanceCols: any;
  StockReceiptRegisterReport: any;
  StockIssueRegisterReport: any;
  TruckMemoRegisterReport: any;
  DeliveryMemoRegisterReport: any;
  CommodityReceiptReport: any;
  SchemeReceiptReport: any;
  TransactionReceiptReport: any;
  CommodityIssueMemoReport: any;
  SchemeIssueMemoReport: any;
  WriteoffReport: any;
  HullingDetailsReport: any;
  TruckToRegionReport: any;
  TruckFromRegionReport: any;

  constructor() {
    this.DailyStockStatement = [
      { "field": "serialNo", "header": "S.No", "width": "40px" },
      { "field": 'Name', "header": 'Commodity' },
      { "field": 'OpeningBalance', "header": 'OB', "text-align": "right" },
      { "field": 'Receipt', "header": 'Receipt' },
      { "field": 'Total', "header": 'Total Receipt' },
      { "field": 'IssueSales', "header": 'Sales' },
      { "field": 'IssueOthers', "header": 'Other Issue' },
      { "field": 'TotalIssue', "header": 'Total Issue' },
      { "field": 'ClosingBalance', "header": 'Closing Balance' },
      { "field": 'CSBalance', "header": 'Cummilative Shortage' },
      { "field": 'Shortage', "header": 'Current CS' },
      { "field": 'PhycialBalance', "header": 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { "field": "serialNo", "header": "S.No" },
      { "field": 'Name', "header": 'Region Name' },
      { "field": 'Capacity', "header": 'Capacity' },
      { "field": 'Carpet', "header": 'Carpet' }
    ]
    this.CrsData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RegionName', "header": 'Region' },
      { "field": 'GodownName', "header": 'Godown Name' },
      { "field": 'Issuername', "header": 'Shop Name' },
      { "field": '', "header": 'Shop Code (TNCSC)' },
      //{ "field": '', "header": 'Shop Code (CCS)'}
    ]
    this.MrmData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.HullingAgenciesData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.FciData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.SupplierData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'DepositorName', "header": 'Depositor Name' }
    ]
    this.RegionData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RGCODE', "header": 'Region Code' },
      { "field": 'RGNAME', "header": 'Region Name' }
    ]
    this.AadsData = [
      { "field": 'SlNo', "header": 'S.No' },
      { "field": 'RegionName', "header": 'Region' },
      { "field": 'AADSType', "header": 'AADS Code' },
      { "field": 'Name', "header": 'AADS Name' },
    ]
    this.SchemeData = [
      { "field": "SlNo", "header": "S.No" },
      { "field": "Name", "header": "Name" }
    ]
    this.Notification = [
      { "field": 'SlNo', "header": 'S.No' },
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

    this.CBStatementColumns = [
      // { "field": 'serialNo', "header": 'SI.NO' },
      { "field": 'TNCSName', "header": 'Region Name' },
      { "field": 'TNCSCapacity', "header": 'Capacity' },
      { "field": 'boiledRice', "header": 'Boiled Rice' },
      { "field": 'rawRice', "header": 'Raw Rice' },
      { "field": 'totalRice', "header": 'Rice Total' },
      { "field": 'SUGAR', "header": 'SUGAR' },
      { "field": 'WHEAT', "header": 'WHEAT' },
      { "field": 'toorDhall', "header": 'TOOR DHALL' },
      { "field": 'kanadaToorDhall', "header": 'Kanada TOOR Dhall' },
      { "field": 'totalDhall', "header": 'Dhall Total' },
      { "field": 'uridDhall', "header": 'URID Dhall' },
      { "field": 'palmoil', "header": 'PALMOLIEN OIL' },
      { "field": 'cement', "header": 'CEMENT' }
    ]

    this.DeliveryDocumentcolumns = [
      { "field": 'deliveryOrder', "header": 'Delivery Order' },
      { "field": 'transCode', "header": 'Transaction Code' },

    ]

    this.DeliveryItemColumns = [
      { "field": 'itemDesc', "header": 'Item Desc' },
      { "field": 'netWeight', "header": 'Net Weight' },
      { "field": 'unitMeasure', "header": 'Unit Measure' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'rate', "header": 'Rate' },
      { "field": 'total', "header": 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { "field": 'schemeName', "header": 'Scheme Name' },
      { "field": 'itemName', "header": 'Item Name' },
      { "field": 'netWeight', "header": 'Net Weight' },
      { "field": 'rateInTerms', "header": 'Rate In Terms' },
      { "field": 'marginRate', "header": 'Margin Rate' },
      { "field": 'marginAmount', "header": 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { "field": 'paymentMode', "header": 'Payment Mode' },
      { "field": 'payOrderNumber', "header": 'CH/DD/PayOrder No' },
      { "field": 'payOrderDate', "header": 'CH/DD/PayOrder Date' },
      { "field": 'paymentAmount', "header": 'Payment Amount' },
      { "field": 'bank', "header": 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { "field": 'prevDeliveryOrder', "header": 'Previous Delivery Order' },
      { "field": 'deliveryOrderDate', "header": 'Delivery Order Date' },
      { "field": 'adjAmt', "header": 'Adjustment Amount' },
      { "field": 'adjType', "header": 'Adjustment Type' },
      { "field": 'amtNowAdjusted', "header": 'Amount Now Adjusted' },
      { "field": 'balance', "header": 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { "field": 'Ackno', "header": 'ACK.No' },
      { "field": 'TruckMemoNo', "header": 'Truck Memo No' },
      { "field": 'Lorryno', "header": 'Lorry No' },
      { "field": 'From_Whom_Received', "header": 'From Whom Received' },
      { "field": 'Stackno', "header": 'Satck No' },
      { "field": 'Scheme', "header": 'Scheme' },
      { "field": 'NoPacking', "header": 'No Packing' },
      { "field": 'Commodity', "header": 'Commodity' },
      { "field": 'NetWt', "header": 'Net Wt' },
    ];

    this.StockIssueRegisterReport = [
      { "field": 'issueMemoNo', "header": 'Issue Memo No' },
      { "field": 'doNo', "header": 'Do No' },
      { "field": 'date', "header": 'Date' },
      { "field": 'lorryNo', "header": 'Lorry No' },
      { "field": 'toWhomIssued', "header": 'To Whom Issued' },
      { "field": 'stackNo', "header": 'Stack No' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'noPacking', "header": 'No Packing' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'netWt', "header": 'Net Wt' },
    ];

    this.TruckMemoRegisterReport = [
      { "field": 'Truck_Memono', "header": 'Truck Memo No' },
      { "field": 'MoNo', "header": 'Mo.No' },
      { "field": 'Issue_Date', "header": 'Date' },
      { "field": 'RoNo', "header": 'Ro.No' },
      { "field": 'To_Whom_Issued', "header": 'To Whom Issued' },
      { "field": 'StackNo', "header": 'Stack No' },
      { "field": 'Scheme', "header": 'Scheme' },
      { "field": 'NoPacking', "header": 'No Packing' },
      { "field": 'Commodity', "header": 'Commodity' },
      { "field": 'NetWt', "header": 'Net Wt' },
    ];

    this.DeliveryMemoRegisterReport = [
      { "field": 'SlNo', "header": 'S.No'},
      { "field": 'deliveryOrderNo', "header": 'Delivery Order No'},
      { "field": 'date', "header": 'Date' },
      { "field": 'grandTotal', "header": 'Grand Total (Rs)'},
      { "field": 'toWhomIssued', "header": 'To Whom Issued' },
      { "field": 'cheque/ddNo', "header": 'Cheque/DD No'},
      { "field": 'amount(Rs)', "header": 'Amount (Rs)' },
      { "field": 'scheme', "header": 'Scheme' },
      { "field": 'commodity', "header": 'Commodity' },
      { "field": 'quantity', "header": 'Quantity(Kgs)' },
      { "field": 'rate', "header": 'Rate' },
      { "field": 'amount', "header": 'Amount' },
      { "field": 'prevBalance', "header": 'Prev.Balance' },
      { "field": 'otherAmount', "header": 'Other Amount' },
      { "field": 'balance', "header": 'Balance' },
      { "field": 'margin', "header": 'Margin' }
    ];

    this.CommodityReceiptReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'scheme', "header": 'SCHEME'},
      { "field": 'AckNo', "header": 'Ack. No'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": '', "header": 'BAGS/NOS'},
      { "field": 'quantity', "header": 'QUANTITY'},
      { "field": 'recdFrom', "header": 'RECD FROM'},
      { "field": 'lorryNo', "header": 'LORRY NO'},
      { "field": 'tMemoMC', "header": 'T.MEMO.MC'},
      { "field": 'tMemoDt', "header": 'T.MEMO.DT'},
      { "field": 'orderNo', "header": 'Order.No'}
    ];

    this.SchemeReceiptReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'scheme', "header": 'SCHEME'},
      { "field": 'AckNo', "header": 'Ack. No'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": 'quantity', "header": 'QUANTITY'},
      { "field": 'recdFrom', "header": 'RECD FROM'},
      { "field": 'tMemoNo', "header": 'T.MEMO.NO'},
      { "field": 'lorryNo', "header": 'LORRY NO'}
    ];

    this.TransactionReceiptReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'transaction', "header": 'TRANSACTION'},
      { "field": 'quantity', "header": 'QUANTITY'}
    ];

    this.CommodityIssueMemoReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'scheme', "header": 'SCHEME'},
      { "field": 'AckNo', "header": 'I.MEMO NO'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": 'quantity', "header": 'QUANTITY'},
      { "field": 'ISSUEDtO', "header": 'ISSUED TO'},
      { "field": 'lorryNo', "header": 'LORRY NO'},
      { "field": 'lorryNo', "header": 'Stack No'}
    ];

    this.SchemeIssueMemoReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'scheme', "header": 'SCHEME'},
      { "field": 'AckNo', "header": 'I.MEMO NO'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": 'quantity', "header": 'QUANTITY'},
      { "field": 'ISSUEDtO', "header": 'ISSUED TO'}
    ];

    this.WriteoffReport = [
      { "field": 'godown', "header": 'GODOWN'},
      { "field": 'date', "header": 'DATE'},
      { "field": 'issueNo', "header": 'ISSUE NO'},
      { "field": 'commodity', "header": 'COMMODITY'},
      { "field": 'quantity', "header": 'QUANTITY'},
      { "field": 'stackNo', "header": 'Stack No'},
      { "field": 'remarks', "header": 'REMARKS'}
    ];

    this.HullingDetailsReport = [
      { "field": 'AckNo', "header": 'Ack. No'},
      { "field": 'date', "header": 'Date'},
      { "field": 'commodity', "header": 'Commodity'},
      { "field": 'depositor', "header": 'Depositor'},
      { "field": 'bags', "header": 'Bags'},
      { "field": 'quantity', "header": 'Quantity'}
    ];

    this.TruckToRegionReport = [
      { "field": 'truckMemo', "header": 'Truck Memo'},
      { "field": 'date', "header": 'Date'},
      { "field": 'godown', "header": 'Godown'},
      { "field": 'region', "header": 'Region'},
      { "field": 'commodity', "header": 'Commodity'},
      { "field": 'scheme', "header": 'Scheme'},
      { "field": 'bags', "header": 'Bags'},
      { "field": 'quantity', "header": 'Quantity'},
      { "field": 'docnoL', "header": 'Docno./L'}
    ];

    this.TruckFromRegionReport = [
      { "field": 'AckNo', "header": 'Ack. No'},
      { "field": 'date', "header": 'Date'},
      { "field": 'type', "header": 'Type'},
      { "field": 'depositor', "header": 'Depositor'},
      { "field": 'commodity', "header": 'Commodity'},
      { "field": 'bags', "header": 'Bags'},
      { "field": 'quantity', "header": 'Quantity'}
    ]
  }
}