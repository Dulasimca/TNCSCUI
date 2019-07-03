import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  GunnyReport: any;
  StackCardOpeningEntryReport: any;
  StackWiseBreakupDetails: any;
  SchemeWiseBreakupDetails: any;
  TruckTransit: any;
  StockReceiptItemColumns: any;
  StockIssueMemoIssueDetailsColumns: any;
  StockIssueMemoItemDetailsColumns: any;
  DoAllScheme: any;
  DoSPLPDS: any;
  DoOAP: any;
  DoAAN: any;
  DoOtherScheme: any;
  DoSocietyAbstract: any;
  ReceiptROPurchaseReport: any;
  ReceiptHOPurchaseReport: any;
  ReceiptRONOPurchaseReport: any;
  DoDemandDraft: any;
  DoMarginAmount: any;
  SchemeAbstractReceipt: any;
  SchemeAbstractIssueAll: any;
  SchemeAbstractIssueCRS: any;
  SchemeAbstractIssueCoOp: any;
  SchemeAbstractTruck: any;
  QtyReceiptIssueCommodity: any;

  constructor() {
    this.DailyStockStatement = [
      { field: 'serialNo', header: 'S.No', width: '40px' },
      { field: 'Name', header: 'Commodity' },
      { field: 'OpeningBalance', header: 'OB', align: 'right' },
      { field: 'Receipt', header: 'Receipt' },
      { field: 'Total', header: 'Total Receipt' },
      { field: 'IssueSales', header: 'Sales' },
      { field: 'IssueOthers', header: 'Other Issue' },
      { field: 'TotalIssue', header: 'Total Issue' },
      { field: 'ClosingBalance', header: 'Closing Balance' },
      { field: 'CSBalance', header: 'Cummilative Shortage' },
      { field: 'Shortage', header: 'Current CS' },
      { field: 'PhycialBalance', header: 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { field: 'serialNo', header: 'S.No' },
      { field: 'Name', header: 'Region Name' },
      { field: 'Capacity', header: 'Capacity' },
      { field: 'Carpet', header: 'Carpet' }
    ]
    this.CrsData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RegionName', header: 'Region' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Issuername', header: 'Shop Name' },
      { field: 'IssuerCode', header: 'Shop Code (TNCSC)' },
      { field: 'AcsCode', header: 'AcsCode'}
    ]
    this.MrmData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.HullingAgenciesData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.FciData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.SupplierData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DepositorName', header: 'Depositor Name' }
    ]
    this.RegionData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RGCODE', header: 'Region Code' },
      { field: 'RGNAME', header: 'Region Name' }
    ]
    this.AadsData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RegionName', header: 'Region' },
      { field: 'AADSType', header: 'AADS Code' },
      { field: 'Name', header: 'AADS Name' },
    ]
    this.SchemeData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Name', header: 'Name' }
    ]
    this.Notification = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Notes', header: 'Description' }
    ]

    this.StockPurchase = [
      {
        field: 'depositorName', header: 'Depositor Name'
      },
      { field: 'itemName', header: 'Item Name' },
      { field: 'qty', header: 'Quantity' },
      { field: 'orderNumber', header: 'Order Number' },
      { field: 'remarks', header: 'Remarks' }]

    this.CBStatementColumns = [
      // { field: 'serialNo', header: 'SI.NO' },
      { field: 'TNCSName', header: 'Region Name' },
      { field: 'TNCSCapacity', header: 'Capacity' },
      { field: 'boiledRice', header: 'Boiled Rice' },
      { field: 'rawRice', header: 'Raw Rice' },
      { field: 'totalRice', header: 'Rice Total' },
      { field: 'SUGAR', header: 'SUGAR' },
      { field: 'WHEAT', header: 'WHEAT' },
      { field: 'toorDhall', header: 'TOOR DHALL' },
      { field: 'kanadaToorDhall', header: 'Kanada TOOR Dhall' },
      { field: 'totalDhall', header: 'Dhall Total' },
      { field: 'uridDhall', header: 'URID Dhall' },
      { field: 'palmoil', header: 'PALMOLIEN OIL' },
      { field: 'cement', header: 'CEMENT' }
    ]

    this.DeliveryDocumentcolumns = [
      { field: 'deliveryOrder', header: 'Delivery Order' },
      { field: 'transCode', header: 'Transaction Code' },

    ]

    this.DeliveryItemColumns = [
      { field: 'itemDesc', header: 'Item Desc' },
      { field: 'netWeight', header: 'Net Weight' },
      { field: 'unitMeasure', header: 'Unit Measure' },
      { field: 'scheme', header: 'Scheme' },
      { field: 'rate', header: 'Rate' },
      { field: 'total', header: 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { field: 'schemeName', header: 'Scheme Name' },
      { field: 'itemName', header: 'Item Name' },
      { field: 'netWeight', header: 'Net Weight' },
      { field: 'rateInTerms', header: 'Rate In Terms' },
      { field: 'marginRate', header: 'Margin Rate' },
      { field: 'marginAmount', header: 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { field: 'paymentMode', header: 'Payment Mode' },
      { field: 'payOrderNumber', header: 'CH/DD/PayOrder No' },
      { field: 'payOrderDate', header: 'CH/DD/PayOrder Date' },
      { field: 'paymentAmount', header: 'Payment Amount' },
      { field: 'bank', header: 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { field: 'prevDeliveryOrder', header: 'Previous Delivery Order' },
      { field: 'deliveryOrderDate', header: 'Delivery Order Date' },
      { field: 'adjAmt', header: 'Adjustment Amount' },
      { field: 'adjType', header: 'Adjustment Type' },
      { field: 'amtNowAdjusted', header: 'Amount Now Adjusted' },
      { field: 'balance', header: 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.No' },
      { field: 'TruckMemoNo', header: 'Truck Memo No' },
      { field: 'Lorryno', header: 'Lorry No' },
      { field: 'From_Whom_Received', header: 'From Whom Received' },
      { field: 'Stackno', header: 'Satck No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoPacking', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.StockIssueRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Issue_Memono', header: 'Issue Memo No' },
      { field: 'DNo', header: 'Do No' },
      { field: 'Issue_Date', header: 'Date' },
      { field: 'Lorryno', header: 'Lorry No' },
      { field: 'To_Whom_Issued', header: 'To Whom Issued' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoPacking', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.TruckMemoRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Truck_Memono', header: 'Truck Memo No' },
      { field: 'Mono', header: 'Mo.No' },
      { field: 'Issue_Date', header: 'Date' },
      { field: 'RoNo', header: 'Ro.No' },
      { field: 'To_Whom_Issued', header: 'To Whom Issued' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'NoBags', header: 'No Packing' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'NetWt', header: 'Net Wt' },
    ];

    this.DeliveryMemoRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Dono', header: 'Delivery Order No' },
      { field: 'DeliveryOrderDate', header: 'Date' },
      { field: 'Totals', header: 'Total (Rs)' },
      { field: 'To_Whom_Issued', header: 'Issuer Name' },
      { field: 'Cheque_DD', header: 'Cheque/DD' },
      { field: 'PaymentAmount', header: 'Payment Amount (Rs)' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Netwt_Kgs', header: 'Net.Wt(Kgs)' },
      { field: 'Rate_Rs', header: 'Rate(Rs)' },
      { field: 'Itemamount', header: 'Item Amount' },
      { field: 'PreviousAmount ', header: 'Previous Balance' },
      { field: 'Adjusted', header: 'Other Amount' },
      { field: 'Balance', header: 'Current Balance' },
      { field: 'MarginAmount', header: 'Margin Amount' }
    ];

    this.CommodityReceiptReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Ackno', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags_No', header: 'BAGS/NOS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'RecdFrom', header: 'RECD FROM' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'TruckMemoNo', header: 'T.MEMO.MC' },
      { field: 'Truckmemodate', header: 'T.MEMO.DT' },
      { field: 'Orderno', header: 'Order.No' }
    ];

    this.SchemeReceiptReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'AckNo', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'RecdFrom', header: 'RECD FROM' },
      { field: 'TruckMemoNo', header: 'T.MEMO.NO' },
      { field: 'Lorryno', header: 'LORRY NO' }
    ];

    this.TransactionReceiptReport = [
      { field: 'SlNo', header: 'S.No', width: '20px !important' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Date', header: 'DATE' },
      { field: 'Trans_action', header: 'TRANSACTION' },
      { field: 'Quantity', header: 'QUANTITY', type: 'number : 1.2', align: 'right' }
    ];

    this.CommodityIssueMemoReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Issue_Memono', header: 'I.MEMO NO' },
      { field: 'Issue_Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Stackno', header: 'Stack No' }
    ];

    this.SchemeIssueMemoReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: 'Issue_Memono', header: 'I.MEMO NO' },
      { field: 'Issuedto', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' }
    ];

    this.WriteoffReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Date', header: 'DATE' },
      { field: 'Issue_Memono', header: 'ISSUE NO' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'Remarks', header: 'REMARKS' }
    ];

    this.HullingDetailsReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'SRNo', header: 'Ack. No' },
      { field: 'SRDate', header: 'Date' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'DepositorName', header: 'Depositor' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' }
    ];

    this.TruckToRegionReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'STNo', header: 'Truck Memo' },
      { field: 'STDate', header: 'Date' },
      { field: 'DepositorName', header: 'Godown' },
      { field: 'RGNAME', header: 'Region' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'SCName', header: 'Scheme' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' },
      { field: 'LNo', header: 'Docno./L' }
    ];

    this.TruckFromRegionReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'SRNo', header: 'Ack. No' },
      { field: 'SRDate', header: 'Date' },
      { field: 'Tyname', header: 'Type' },
      { field: 'TNCSName', header: 'Depositor' },
      { field: 'ITDescription', header: 'Commodity' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' }
    ];

    this.GunnyReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK. NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'stackno', header: 'STACK NO' },
      { field: 'Year', header: 'S.YEAR' }
    ];


    this.StackCardOpeningEntryReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Opening_Bags', header: 'Ope.Bags' },
      { field: 'Opening_Quantity', header: 'Ope.Quantity' },
      { field: 'FromDate', header: 'From_dt' },
      { field: 'FormationYear', header: 'Formation Year' },
      { field: 'Status', header: 'Status' },
    ];

    

    this.StackWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No'},
      { field: 'bags', header: 'Bags'},
      { field: 'Weight', header: 'Weight'}
    ];

    this.SchemeWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No'},
      { field: 'bags', header: 'Bags'},
      { field: 'Weight', header: 'Weight'},
      { field: 'Scheme', header: 'Scheme'}
    ];

    this.TruckTransit = [
      { field: 'SlNo', header: 'S.No'},
      {field: 'STNo', header: 'Truck Memo No'},
      {field: 'STDate', header: 'Sender Date'},
      {field: 'Region', header: 'Region'},
      {field: 'TNCSName', header: 'Godown Name'},
      {field: 'LNo', header: 'Lorry No'},
      {field: 'NoPacking', header: 'Bags'},
      {field: 'Nkgs', header: 'Quantity'},
      {field: 'STNo', header: 'AckNo'},
      {field: 'STDate', header: 'Receiver Date'},
      {field: 'Region', header: 'Receiver Region'},
      {field: 'TNCSName', header: 'Receiver Godown'},
      {field: 'NoPacking', header: 'Bags Received'},
      {field: 'Nkgs', header: 'Received Quantity'},
      // {field: 'Transfertype', header: 'INTERNAL/'}
    ];

    this.StockReceiptItemColumns = [
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'ICode', header: 'Item Description' },
      { field: 'IPCode', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'WTCode', header: 'Wmt Type' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'NKgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'icon', header: 'Action'}
    ];

    this.StockIssueMemoIssueDetailsColumns = [ 
    {field: 'Issue Memo No', header: 'SINo' },
    { field: 'Issue Memo Date', header: 'SIDate' },
    { field: 'Delivery Order No', header: 'DeliveryOrderNo' },
    { field: 'Delivery Order', header: 'DeliveryOrderDate' }];

    this.StockIssueMemoItemDetailsColumns = [
      { field: 'TStockNo', header:'Stack No.' },
      { field: 'ICode', header:'Item Description' },
      { field: 'IPCode', header:'Packing Type' },
      { field: 'NoPacking', header:'No. of packing' },
      { field: 'WTCode', header:'Wmt Type' },
      { field: 'GKgs', header:'Gross Wt' },
      { field: 'NKgs', header:'Net WT' },
      { field: 'Moisture', header:'Moisture' },
      { field: 'Scheme', header:'Scheme' },
    ];

    this.DoAllScheme = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoSPLPDS = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];
    
    this.DoOAP = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoAAN = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoOtherScheme = [
      { field: '', header: 'Do.No' },
      { field: '', header: 'Date' },
      { field: '', header: 'Type' },
      { field: '', header: 'Co_op' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Scheme' },
      { field: '', header: 'Quantity' },
      { field: '', header: 'Rate' },
      { field: '', header: 'Amount' },
      { field: '', header: 'C/NC' }
    ];

    this.DoSocietyAbstract = [
      { field: '', header: 'DO.NO' },
      { field: '', header: 'SOCIETY' },
      { field: '', header: 'TODATE' },
      { field: '', header: 'DUE' },
      { field: '', header: 'PAID' },
      { field: '', header: 'AdvanceCollection' },
      { field: '', header: 'DEBIT' }
    ];

    this.ReceiptROPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'Order.No' },
      { field: 'Lorryno', header: 'LORRY NO' },
    ];

    this.ReceiptHOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'Ack. No' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Bags', header: 'Bags' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'TruckMen', header: 'Truckmen' },
      { field: 'Orderno', header: 'Order No' },
      { field: 'Lorryno', header: 'Lorry No' },
    ];
    
    this.ReceiptRONOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE '},
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'Order.No' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.DoDemandDraft = [
      { field: '', header: 'SOCIETY'},
      { field: '', header: 'DONO'},
      { field: '', header: 'DO DATE'},
      { field: '', header: 'DD.NO'},
      { field: '', header: 'DD DATE'},
      { field: '', header: 'BANK'},
      { field: '', header: 'AMOUNT'},
      { field: '', header: 'CEREAL'},
      { field: '', header: 'NON-CEREAL'}
    ];

    this.DoMarginAmount = [
      { field: '', header: 'SOCIETY'},
      { field: '', header: 'DONO'},
      { field: '', header: 'DO DATE'},
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Scheme', header: 'SCHEME' },
      { field: '', header: 'NET WEIGHT'},
      { field: '', header: 'RATE'},
      { field: '', header: 'AMOUNT'}
    ];

    this.SchemeAbstractReceipt = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'BULK'},
      { field: '', header: 'EXCESS'},
      { field: '', header: 'HULLING'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'}
    ];

    this.SchemeAbstractIssueCRS = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'},
      { field: '', header: 'SPL PDS'},
      { field: '', header: 'TOTAL'}
    ];

    this.SchemeAbstractIssueAll = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'BULK'},
      { field: '', header: 'OAP'},
      { field: '', header: 'OTHERS'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'}
    ];

    this.SchemeAbstractIssueCoOp = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'AAY'},
      { field: '', header: 'OAP'},
      { field: '', header: 'PDS'},
      { field: '', header: 'POLICE'},
      { field: '', header: 'SPL PDS'},
      { field: '', header: 'TOTAL'}
    ];

    this.SchemeAbstractTruck = [
      { field: 'Commodity', header: 'COMMODITY' },
      { field: '', header: 'GODOWN'},
      { field: '', header: 'PType'},
      { field: '', header: 'INTERNAL TRANSFER'},
      { field: '', header: 'TRANSFER'},
      { field: '', header: 'TOTAL'}
    ];

    this.QtyReceiptIssueCommodity = [];
  }
}