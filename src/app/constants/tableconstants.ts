
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
  TenderDetailsCols: any;
  CBStatementColumns: any;
  DeliveryDocumentcolumns: any;
  DeliveryDocumentViewCols: any;
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
  StackCardClosingEntryReport: any;
  DDChequeEntryCols: any;
  StackWiseBreakupDetails: any;
  SchemeWiseBreakupDetails: any;
  TruckTransit: any;
  StockReceiptItemColumns: any;
  StockIssueMemoIssueDetailsColumns: any;
  StockIssueMemoItemDetailsColumns: any;
  DoAllScheme: any;
  DoSPLPDS: any;
  DoOAP: any;
  DoAnnaPoorna: any;
  DoOtherScheme: any;
  DoSocietyAbstract: any;
  ReceiptROPurchaseReport: any;
  ReceiptHOPurchaseReport: any;
  ReceiptRONOPurchaseReport: any;
  StockReceiptDocumentViewCols: any;
  DoDemandDraft: any;
  DoMarginAmount: any;
  SocietyMaster: any;
  ShopWiseAllotmentMaster: any;
  TruckMemoItemDetails: any;
  SocietyMasterEntry: any;
  ItemMasterModification: any;
  GodownCustomerList: any;
  OpeningBalanceMasterEntry: any;
  StockStatementReport: any;
  TransactionStatus: any;
  OpeningBalanceCurYearEntry: any;
  DailyDocumentTotalReport: any;
  DailyDocumentReceiptReport: any;
  DetailDailyDocumentReceiptReport: any;
  DailyDocumentIssueReport: any;
  DetailDailyDocumentIssueReport: any;
  StockIssueMemoViewBySINOCols: any;
  StackCardOpening: any;
  StackCard: any;
  PackingMaster: any;
  CommodityMaster: any;
  OtherMaster: any;
  CncCorrection: any;
  TruckMemoViewDocumentCols: any;
  godownProfile: any;
  KeroseneSuppliers: any;
  KeroseneRegionalSuppliers: any;
  DepositorMaster: any;
  CustomerMaster: any;
  SchemeCommodity: any;
  EmployeeMaster: any;
  SocietyMasterNewEntry: any;
  IssuerMaster: any;
  ChequeReceiptNoCols: any;
  CashReceiptRegister: any;
  IssueMemoCustomerDetail: any;
  IssueMemoAbstract: any;
  DemandDraftDetailsReportCols: any;
  StackCardRegister: any;
  QuantityACReceiptDetailsCommodity: any;
  StackCardRegisterReport: any;
  CashReceiptRegCols: any;
  CorrectionSlipReport: any;
  OWSReport: any;
  DocumentCorrectionColumns: any;
  DocumentCorrectionApproveColumns: any;
  OBStackDetails: any;
  StackCardClosing: any;
  PartyLedgerMaster: any;
  PurchaseTaxEntry: any;
  SalesTaxEntry: any;
  TenderAllotmentDetailsCols: any[];
  TenderAllotmentToRegionCols: any[];
  TenderQuantityCols: any[];
  ServiceProviderEntry: any;
  TenderAllotmentToGodownCols: any[];
  AllotmentIssueQuantity: any;
  ProcessToG2GIssueCols: any[];
  ProcessToG2GCols: any[];
  QuantityACIssueDetailsCommodity: any[];
  PartyName: any;
  StackCardDocDetailsCols: any[];
  IssuerPartyCols: any;

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
      { field: 'CSBalance', header: 'Cumulative Shortage' },
      { field: 'Shortage', header: 'Current CS' },
      { field: 'PhycialBalance', header: 'Physical Balance' },
    ]

    this.GodownMasterData = [
      { field: 'serialNo', header: 'S.No' },
      { field: 'Name', header: 'Region Name' },
      { field: 'Code', header: 'Code' },
      { field: 'Capacity', header: 'Capacity' },
      { field: 'Carpet', header: 'Carpet' }
    ]
    this.CrsData = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'RegionName', header: 'Region' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Issuername', header: 'Shop Name' },
      { field: 'IssuerCode', header: 'Shop Code (TNCSC)' },
      { field: 'AcsCode', header: 'AcsCode' }
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
      { field: 'DepositorCode', header: 'Depositor Code' },
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

    this.TenderDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'TenderId', header: 'Tender ID' },
      { field: 'TenderDate', header: 'Tender Date' },
      { field: 'CompletedDate', header: 'Completed Date' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'OrderDate', header: 'Order Date' },
      { field: 'ITName', header: 'Commodity' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'AdditionalQty', header: 'Additional Quantity' },
      { field: 'Remarks', header: 'Remarks' }];

    this.TenderAllotmentDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'OrderNumber', header: 'Order Number' },
      //  { field: 'OrderDate', header: 'Order Date' },
      { field: 'PartyRegion', header: 'Party Region' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'SpellName', header: 'Spell' },
      { field: 'TargetDate', header: 'Target Date' },
      { field: 'TotalDays', header: 'Total Days' },
      { field: 'AssignedQty', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Remarks', header: 'Remarks' }];

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
      { field: 'kanadaToorDhall', header: 'CYL TOOR Dhall' },
      { field: 'totalDhall', header: 'Dhall Total' },
      { field: 'uridDhall', header: 'URID Dhall' },
      { field: 'palmoil', header: 'PALMOLIEN OIL' },
      { field: 'cement', header: 'CEMENT' }
    ]

    this.DeliveryDocumentcolumns = [
      { field: 'Dono', header: 'Delivery Order' },
      { field: 'DoDate', header: 'Delivery Date' },
      { field: 'Issuername', header: 'Society' },
      { field: 'GrandTotal', header: 'Due' },
      { field: 'PaymentAmount', header: 'Paid' },
      { field: 'AdvCollection', header: 'Advance Collection' },
      { field: 'Debit', header: 'Debit' },
    ]

    this.DeliveryItemColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'ITDescription', header: 'IT Description' },
      { field: 'NetWeight', header: 'Net Weight' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'Wtype', header: 'Unit Measure' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Total', header: 'Total' },
    ]

    this.DeliveryItemSchemeColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SchemeName', header: 'Scheme Name' },
      { field: 'ITDescription', header: 'Item Name' },
      { field: 'MarginNkgs', header: 'Net Weight' },
      { field: 'MarginWtype', header: 'Rate In Terms' },
      { field: 'MarginRate', header: 'Margin Rate' },
      { field: 'MarginAmount', header: 'Margin Amount' },
    ];

    this.DeliveryPaymentcolumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'PaymentMode', header: 'Payment Mode' },
      { field: 'ChequeNo', header: 'CH/DD/PO No' },
      { field: 'ChequeDate', header: 'CH/DD/PO Date' },
      { field: 'PaymentAmount', header: 'Payment Amt' },
      { field: 'payableat', header: 'Payable At' },
      { field: 'bank', header: 'Bank' },
    ]

    this.DeliveryPaymentBalanceCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'AdjustedDoNo', header: 'Previous DO' },
      { field: 'AdjustedDate', header: 'DO Date' },
      { field: 'Amount', header: 'Adj. Amt' },
      { field: 'AdjustmentType', header: 'Adj. Type' },
      { field: 'AmountNowAdjusted', header: 'Amt. Now Adj' },
      { field: 'Balance', header: 'Balance' }
    ];

    this.StockReceiptRegisterReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.No' },
      { field: 'Godownname', header: 'Godown Name'},
      { field: 'Date', header: 'Date' },
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
      { field: 'Godownname', header: 'Godown Name'},
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
      { field: 'Godownname', header: 'Godown Name'},
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
      { field: 'Godown', header: 'Godown Name'},
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
      { field: 'PreviousAmount', header: 'Previous Balance' },
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
      { field: 'Ackno', header: 'Ack. No' },
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
      { field: 'Issue_Date', header: 'DATE' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'Issuedto', header: 'ISSUED TO' }
    ];

    this.WriteoffReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Godownname', header: 'GODOWN' },
      { field: 'Issue_Date', header: 'DATE' },
      { field: 'Issueno', header: 'ISSUE NO' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'NetWt', header: 'QUANTITY' },
      { field: 'Stackno', header: 'STACK NO' },
      { field: 'remarks', header: 'REMARKS' }
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
      { field: 'CommodityName', header: 'Commodity' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'StackBalanceWeight', header: 'Weight' },
      { field: 'ObStackDate', header: 'From Date' },
      { field: 'clstackdate', header: 'To Date' },
      { field: 'CurYear', header: 'Formation Year' },
      { field: 'Flag1', header: 'Status' },
    ];

    this.StackWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No' },
      { field: 'bags', header: 'Bags' },
      { field: 'Weight', header: 'Weight' }
    ];

    this.SchemeWiseBreakupDetails = [
      { field: 'Stackno', header: 'Stack No' },
      { field: 'bags', header: 'Bags' },
      { field: 'Weight', header: 'Weight' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.TruckTransit = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'STNo', header: 'Truck Memo No' },
      { field: 'STDate', header: 'Sender Date' },
      { field: 'Region', header: 'Region' },
      { field: 'TNCSName', header: 'Sender Godown' },
      { field: 'ITDescription', header: 'Issuer Commodity' },
      { field: 'LNo', header: 'Lorry No' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Quantity' },
      { field: 'ACKNO', header: 'AckNo' },
      { field: 'STDate', header: 'Receiver Date' },
      { field: 'DepositorName', header: 'Receiver Godown' },
      { field: 'ITDescription', header: 'Receiver Commodity' },
      { field: 'NoPacking', header: 'Bags Received' },
      { field: 'Nkgs', header: 'Received Quantity' },
      { field: 'Transfertype', header: 'Transfer Type' }
    ];

    this.StockReceiptItemColumns = [
      { field: 'sno', header: 'SI.No.' },
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'CommodityName', header: 'Item Description' },
      { field: 'PackingName', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'Nkgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'WmtType', header: 'Wmt Type' },
      // { field: 'icon', header: 'Action'}
    ];

    this.StockIssueMemoViewBySINOCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SINo', header: 'Issue Memo No' },
      { field: 'SIDate', header: 'Issue Memo Date' },
      { field: 'DNo', header: 'Delivery Order No' },
      { field: 'DDate', header: 'Delivery Order' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'ReceivorName', header: 'Receivor Name' },
    ];

    this.StockIssueMemoIssueDetailsColumns = [
      { field: 'DNo', header: 'Do No.' },
      { field: 'DeliveryOrderDate', header: 'Do Date' },
      { field: 'SINo', header: 'SI No.' },
      { field: 'IssueMemoDate', header: 'SI Date' }];

    this.StockIssueMemoItemDetailsColumns = [
      { field: 'sno', header: 'S.No:' },
      { field: 'TStockNo', header: 'Stack No.' },
      { field: 'SchemeName', header: 'Scheme' },
      { field: 'CommodityName', header: 'Item Description' },
      { field: 'PackingName', header: 'Packing Type' },
      { field: 'NoPacking', header: 'No. of packing' },
      { field: 'GKgs', header: 'Gross Wt' },
      { field: 'Nkgs', header: 'Net WT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'WmtType', header: 'Wmt Type' },
    ];

    this.DoAllScheme = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoSPLPDS = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoOAP = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoAnnaPoorna = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoOtherScheme = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'Do.No' },
      { field: 'Dodate', header: 'Date' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'C_Nc', header: 'C/NC' }
    ];

    this.DoSocietyAbstract = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Dono', header: 'DO.NO' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'issuername', header: 'SOCIETY' },
      { field: 'DoDate', header: 'TODATE' },
      { field: 'Due', header: 'DUE' },
      { field: 'Paid', header: 'PAID' },
      // { field: 'Pending', header: 'PENDING' },
      { field: 'AdvanceCollection', header: 'AdvanceCollection' },
      { field: 'Debit', header: 'DEBIT' }
    ];

    this.ReceiptROPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'ACK.NO' },
      { field: 'Godownname', header: 'Godown Name'},
      { field: 'Date', header: 'DATE' },
      { field: 'Type', header: 'TYPE ' },
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'Quantity', header: 'QUANTITY' },
      { field: 'TruckMen', header: 'TRUCKMEN' },
      { field: 'Orderno', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
    ];

    this.ReceiptHOPurchaseReport = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Ackno', header: 'Ack No' },
      { field: 'Godownname', header: 'Godown Name'},
      { field: 'Date', header: 'Date' },
      { field: 'Type', header: 'Type' },
      { field: 'Depositor', header: 'Depositor' },
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
      { field: 'Godownname', header: 'Godown Name'},
      { field: 'Date', header: 'DATE' },
      { field: 'Tyname', header: 'TYPE ' },
      { field: 'Depositor', header: 'DEPOSITOR' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'Bags', header: 'BAGS' },
      { field: 'NetWeight', header: 'QUANTITY' },
      { field: 'TruckMemoNo', header: 'TRUCKMEN' },
      { field: 'OrderNo', header: 'ORDER NO' },
      { field: 'Lorryno', header: 'LORRY NO' },
      { field: 'Scheme', header: 'Scheme' }
    ];

    this.DoDemandDraft = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Society', header: 'SOCIETY' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Dono', header: 'DONO' },
      { field: 'Dodate', header: 'DO DATE' },
      { field: 'Chequeno', header: 'DD.NO' },
      { field: 'Chequedate', header: 'DD DATE' },
      { field: 'Bank', header: 'BANK' },
      { field: 'PaymentAmount', header: 'AMOUNT' },
      { field: 'Cereal', header: 'CEREAL' },
      { field: 'NonCereal', header: 'NON-CEREAL' }
    ];

    this.DoMarginAmount = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'Coop', header: 'Society' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Dono', header: 'DONO' },
      { field: 'Dodate', header: 'DO DATE' },
      { field: 'Comodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Net Wt' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' }
    ];

    this.StockReceiptDocumentViewCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'SRNo', header: 'SR No.' },
      { field: 'SRDate', header: 'SR Date' },
      { field: 'OrderNo', header: 'Order No.' },
      { field: 'OrderDate', header: 'Order Date' },
      { field: 'TNCSName', header: 'TNCSName' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'CreatedDate', header: 'Created Date' }
    ];

    this.SocietyMaster = [
      { field: 'SlNo', header: 'S.No', width: '40px' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'SocietyType', header: 'Society Type' },
      { field: 'SocietyCode', header: 'Society Code' },
      { field: 'Issuername', header: 'Issuer Name' },
    ];

    this.ShopWiseAllotmentMaster = [
      { field: '', header: 'Name of the Institution' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Quantity Alloted' },
      { field: '', header: 'Month' },
      { field: '', header: 'Year' },
      { field: '', header: 'Item Code' },
    ];

    this.SocietyMasterEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'Societyname', header: 'Society Name' },
      { field: 'Issuername', header: 'Issuer Name' },
    ];

    this.SocietyMasterNewEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Societyname', header: 'Society Name' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'Eflag', header: 'EFlag' },
    ];

    this.ItemMasterModification = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITCode', header: 'CODE' },
      { field: 'ITDescription', header: 'ITEM NAME' },
      // { field: 'GRName', header: 'GROUP' },
      { field: 'ItemType', header: 'ACTIVE' },

    ];

    this.OpeningBalanceMasterEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION' },
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS' },
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT' },
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS' },
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT' },
      { field: 'CumulitiveShortage', header: 'CUMULATIVE SHORTAGE' },
      { field: 'ObDate', header: 'OB Date' }
    ];

    this.OpeningBalanceCurYearEntry = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ITDescription', header: 'ITEM DESCRIPTION' },
      { field: 'BookBalanceBags', header: 'BOOK BALANCE BAGS' },
      { field: 'BookBalanceWeight', header: 'BOOK BALANCE WEIGHT' },
      { field: 'PhysicalBalanceBags', header: 'PHYSICAL BALANCE BAGS' },
      { field: 'PhysicalBalanceWeight', header: 'PHYSICAL BALANCE WEIGHT' },
      { field: 'CumulativeShortage', header: 'CUMULATIVE SHORTAGE' },
      { field: 'CurYear', header: 'CURRENT YEAR Pv SHORTAGE' }
    ]

    this.GodownCustomerList = [];

    this.StackCardClosingEntryReport = [];

    this.DDChequeEntryCols = [
      { field: 'SNo', header: 'S.No.' },
      { field: 'Payment', header: 'CHE/DD' },
      { field: 'ChequeNo', header: 'CHE/DD No' },
      { field: 'ChDate', header: 'Date' },
      { field: 'Amount', header: 'AMOUNT' },
      { field: 'Bank', header: 'BANK' },
      { field: 'ReceivedFrom', header: 'TO WHOM' },
    ];

    this.ChequeReceiptNoCols = [
      { field: 'SNo', header: 'SI.No.' },
      { field: 'receiptNo', header: 'Receipt No' },
      { field: 'receivedFrom', header: 'Whom Received' },
    ];

    this.TruckMemoItemDetails = [
      { field: 'sno', header: 'SI.No.' },
      { header: 'Stack No.', field: 'TStockNo' },
      { header: 'Scheme', field: 'SchemeName' },
      { header: 'Item Description', field: 'ITDescription' },
      { header: 'Packing Type', field: 'PackingType' },
      { header: 'No. of packing', field: 'NoPacking' },
      { header: 'Gross Wt', field: 'GKgs' },
      { header: 'Net Wt', field: 'Nkgs' },
      { header: 'Moisture', field: 'Moisture' },
      { header: 'Wmt Type', field: 'WmtType' },
    ];

    this.TruckMemoViewDocumentCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'STNo', header: 'Truck Memo No' },
      { field: 'STDate', header: 'Truck Memo Date' },
      { field: 'MNo', header: 'Movement Order No' },
      { field: 'RNo', header: 'Release Order No' },
      { field: 'ReceivorName', header: 'Receivor Name' }
    ];

    this.StockStatementReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { header: 'Commodity', field: 'ITDescription' },
      { header: 'OB', field: 'OpeningBalance', align: 'right' },
      { header: 'Receipt', field: 'Receipt' },
      { header: 'Total (OB + Receipt)', field: 'TotalReceipt' },
      // --Future purpose--
      // { header: 'Sales', field: 'IssueSales', },
      // { header: 'Other Issue', field: 'IssueOthers' },
      { header: 'Total Issue', field: 'TotalIssue' },
      { header: 'Closing Balance', field: 'ClosingBalance' },
      { header: 'Cumulative Shortage', field: 'CSBalance' },
      { header: 'Current CS', field: 'Shortage' },
      { header: 'Physical Balance', field: 'PhycialBalance' },
    ];

    this.TransactionStatus = [
      // { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'GodownName', header: 'Godown Name' },
      { field: 'TransactionDate', header: 'Document Date' },
      { field: 'Receipt', header: 'Receipt' },
      { field: 'Issues', header: 'Issues' },
      { field: 'Transfer', header: 'Transfer' },
      { field: 'ClosingBalance', header: 'CB' },
      { field: 'ApprovalDate', header: 'Approved Date' },
      // { field: 'lastupdated', header: 'Last Updated'},
      { field: 'Status', header: 'Regional Status' },
      { field: 'UserId', header: 'Username' },
    ];

    this.DailyDocumentTotalReport = [
      { field: 'NoDocument', header: 'No of Documents' },
      { field: 'RCode', header: 'Region Code' },
      { field: 'RName', header: 'Region Name' },
      { field: 'GCode', header: 'Godown Code' },
      { field: 'GName', header: 'Godown Name' }
    ];

    this.DailyDocumentReceiptReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc_Date' },
      { field: 'Transactiontype', header: 'Transaction Type' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'SRTime', header: 'Created Date' }
    ];

    this.DetailDailyDocumentReceiptReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc_Date' },
      { field: 'Transactiontype', header: 'Transaction Type' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'PackingType', header: 'Packing type' },
      { field: 'NOOfPACKING', header: 'No Of Packing' },
      { field: 'GROSSWT', header: 'Gross Wt' },
      { field: 'NETWT', header: 'Net Wt' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'SCHEME', header: 'Scheme' },
      { field: 'PERIODALLOT', header: 'Period Allotment' },
      { field: 'OrderNo', header: 'Order No' },
      { field: 'ORDERDate', header: 'Order Date' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'TruckMemoNo', header: 'Truck Memo No' },
      { field: 'TRUCKDate', header: 'Truck Date' },
      { field: 'SRTime', header: 'Created Date' }
    ];


    this.DailyDocumentIssueReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc Date' },
      { field: 'TransactionType', header: 'Transaction Type' },
      { field: 'ReceivedFrom', header: 'Issued To' },
      { field: 'SITime', header: 'Created Date' }
    ];

    this.DetailDailyDocumentIssueReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'DocNo', header: 'Doc No' },
      { field: 'DocDate', header: 'Doc Date' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'TransactionType', header: 'Transaction Type' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'PackingType', header: 'Packing type' },
      { field: 'NOOfPACKING', header: 'No of Packing/Bags' },
      { field: 'GROSSWT', header: 'Gross Wt' },
      { field: 'NETWT', header: 'Net Wt' },
      { field: 'SCHEME', header: 'Scheme' },
      { field: 'ReceivedFrom', header: 'Issued To' },
      { field: 'SITime', header: 'Created Date' }
    ];

    this.StackCardOpening = [
      { field: 'SlNo', header: 'SlNo' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'Bags' },
      { field: 'Stackbalanceweight', header: 'Quantity' },
      { field: 'obstackdate', header: 'From Date' },
      { field: 'Formationyear', header: 'Formation Year' },
      { field: 'Status', header: 'Status' },
    ];

    this.StackCard = [
      { field: 'SlNo', header: 'SlNo' },
      { field: 'AckDate', header: 'Date' },
      { field: 'ReceiptBags', header: 'Bags' },
      { field: 'ReceiptQuantity', header: 'Quantity' },
      { field: 'IssuesBags', header: 'Bags' },
      { field: 'IssuesQuantity', header: 'Quantity' },
      { field: 'ClosingBalance', header: 'Closing Balance' },
    ];

    this.PackingMaster = [
      { field: '', header: 'Packing Name' },
      { field: '', header: 'Net Weight' },
      { field: '', header: 'Unit of Measure' }
    ];

    this.CommodityMaster = [
      { field: '', header: 'Commodity Name' },
      { field: '', header: 'Unit of Measure' },
      { field: '', header: 'Tax' },
      { field: '', header: 'Major Commodity Name' },
    ];

    this.OtherMaster = [];

    this.CncCorrection = [
      { field: '', header: 'Code' },
      { field: '', header: 'Item Name' },
      { field: '', header: 'Group' },
      { field: '', header: 'CER.N/CER' }
    ];

    this.DeliveryDocumentViewCols = [
      { field: 'sno', header: 'S.No:' },
      { field: 'Dono', header: 'Delivery Order No' },
      { field: 'DoDate', header: 'Delivery Order Date' },
      { field: 'TRName', header: 'Transaction Name' },
      { field: 'Tyname', header: 'Receivor Type' },
      { field: 'ReceivorName', header: 'Party Name' }
    ];

    this.godownProfile = [
      { field: 'GNAME', header: 'Incharge Name' },
      { field: 'GodownCode', header: 'Godown Code' },
      { field: 'DESIG', header: 'Designation' },
      { field: 'ADD1', header: 'Address1' },
      { field: 'ADD2', header: 'Address2' },
      { field: 'ADD3', header: 'Address3' },
      { field: 'TELNO', header: 'Telephone No' },
      { field: 'MOBNO', header: 'Mobile No' },
      { field: 'FAXNO', header: 'Fax No' },
    ];

    this.KeroseneSuppliers = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'SupplierCode', header: 'Supplier Code' },
      { field: 'SupplierName', header: 'Supplier Name' },
    ];

    this.KeroseneRegionalSuppliers = [];

    this.DepositorMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'DEPOSITOR NAME' },
      { field: '', header: 'DEPOSITOR Type' },
      { field: '', header: 'STATUS' },
    ];

    this.SchemeCommodity = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'SchemeName', header: 'Scheme Name' },
      { field: 'CommodityName', header: 'Commodity Name' },
    ];

    this.EmployeeMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Empname', header: 'Employee Name' },
      { field: 'Empno', header: 'Employee No' },
      { field: 'DesignationName', header: 'Designation' },
      { field: 'Jrtype', header: 'Join Type' },
      { field: 'Jrdate', header: 'Join Date' },
      { field: 'Refno', header: 'Reference No' },
      { field: 'Refdate', header: 'Reference Date' }
    ];

    this.IssuerMaster = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'IssuerCode', header: 'Issuer Code' },
      { field: 'Tyname', header: 'Type Name' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'Issuername', header: 'Issuer Name' },
      { field: 'CategoryName', header: 'OWS - Category' },
      { field: 'Beneficiaries', header: 'No.of Beneficiary' },
      { field: 'ACSCode', header: 'Acs Code' },
      { field: 'Activeflag', header: 'Active' },
      // { header: 'Save'}
    ];

    this.CashReceiptRegister = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'REC. No' },
      { field: '', header: 'Date' },
      { field: '', header: 'From Whom Received' },
      { field: '', header: 'DD/CH' },
      { field: '', header: 'DD Date' },
      { field: '', header: 'DD Amount' },
      { field: '', header: 'Bank' },
    ];

    this.IssueMemoCustomerDetail = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Ackno', header: 'Iss. No' },
      { field: 'Date', header: 'Date' },
      { field: 'tyname', header: 'Type' },
      { field: 'Coop', header: 'Co_op' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Society', header: 'Society' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Value', header: 'Value' },
    ];

    this.IssueMemoAbstract = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Society', header: 'Society' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Value', header: 'Value' }
    ];

    this.DemandDraftDetailsReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Society', header: 'Society' },
      { field: 'DONO', header: 'DONO' },
      { field: 'DDNo', header: 'DD.NO.' },
      { field: 'DDate', header: 'DD Date' },
      { field: 'Bank', header: 'Bank' },
      { field: 'Amount', header: 'Amount' },
    ];

    this.StackCardRegister = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Stackno', header: 'Stackno' },
      { field: 'Fdate', header: 'From Date' },
      { field: 'Tdate', header: 'To Date' },
      { field: 'OBags', header: 'Opening Bags' },
      { field: 'Quantity', header: 'Balance Quantity' },
      { field: 'Bags', header: 'Receipt Bags' },
      { field: 'Fdate', header: 'GU' },
      { field: 'Tdate', header: 'Receipt Quantity' },
      { field: 'OBags', header: 'Issue Bags' },
      { field: 'Bank', header: 'GR' },
      { field: 'Amount', header: 'Issue Quantity' },
      { field: 'Bank', header: 'Balance Bags' },
      { field: 'Bank', header: 'Balance Quantity' },
      { field: 'Bank', header: 'Stack Status' },
      { field: 'Bank', header: 'W/OFF Quantity' }
    ];

    this.QuantityACReceiptDetailsCommodity = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'Commodity', header: 'COMMODITY' },
      { field: 'OpeningBalance', header: 'Opening Balance' },
      { field: 'Pds', header: 'PDS/Purchase' },
      { field: 'Priority', header: 'Priority' },
      { field: 'TideOver', header: 'Tide Over' },
      { field: 'AAY', header: 'AAY' },
      { field: 'MMS2GEN', header: 'MMS2GEN' },
      { field: 'MMS2SC', header: 'MMS2SC' },
      { field: 'MMS2ST', header: 'MMS2ST' },
      { field: 'SplPds', header: 'SplPds Purchase' },
      { field: 'Cement', header: 'Cement' },
      { field: 'HO', header: 'HO' },
      { field: 'Seizur', header: 'Seizur' },
      { field: 'TotalPurchase', header: 'Total Purchase' },
      { field: 'PTMGRNMF', header: 'PTMGRNMF' },
      { field: 'SGRY', header: 'SGRY' },
      { field: 'Annapoorna', header: 'Annapoorna' },
      { field: 'TotalFreeRice', header: 'Total Free Rice' },
      { field: 'ReceiptFrom', header: 'Receipt From' },
      { field: 'TransferWith', header: 'Transfer Within Region' },
      { field: 'TransferOthers', header: 'Transfer Other Region' },
      { field: 'Excess', header: 'Excess' },
      { field: '', header: 'Cl/Pac/Bulk' },
      { field: '', header: 'Vc/Bt/Blg/Flood' },
      { field: 'SalesReturn', header: 'Sales Return' },
      { field: 'TotalReceipt', header: 'Total Receipt' },
      { field: 'GrandTotal', header: 'Grand Total' },
    ];

    this.StackCardRegisterReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'FromDate', header: 'From Date' },
      { field: 'ToDate', header: 'To Date' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'StackCard', header: 'Stack Card' },
      { field: 'OpeningBag', header: 'OPE_BAL.' },
      { field: 'OpeningQty', header: 'Quantity' },
      { field: 'ReceiptBag', header: 'REC_BAGS' },
      { field: 'GU', header: 'GU' },
      { field: 'ReceiptQty', header: 'Quantity' },
      { field: 'IssuesBag', header: 'ISS_BAGS' },
      { field: 'GR', header: 'GR' },
      { field: 'IssuesQty', header: 'Quantity' },
      { field: 'BalanceBag', header: 'BAL_BAGS.' },
      { field: 'BalanceQty', header: 'BAL_QUANTITY' },
      { field: 'StackStatus', header: 'Stack Status' },
      { field: 'WriteOff', header: 'W/OFF QTY.' }
    ];

    this.CashReceiptRegCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'ReceivedFrom', header: 'Received From' },
      { field: 'ReceiptNo', header: 'REC.No' },
      { field: 'Date', header: 'Date' },
      { field: 'PaymentType', header: 'DD/CH/OCR' },
      { field: 'DDNo', header: 'DD No' },
      { field: 'DDDate', header: 'DD Date' },
      { field: 'Amount', header: 'DD AMOUNT' },
      { field: 'Bank', header: 'Bank' },
    ];

    this.CorrectionSlipReport = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'DocNo', header: 'Doc.No.' },
      { field: 'DocDate', header: 'Doc.Date' },
      { field: 'ShopName', header: 'Receiver Name' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'TStockNo', header: 'Stack Card' },
      { field: 'NoPacking', header: 'Bags' },
      { field: 'Nkgs', header: 'Net Wt' },
      { field: 'LorryNo', header: 'Lorry No.' },
      { field: 'RowId', header: 'Row Id' },
      { field: 'CreatedDate', header: 'Created Date' },
    ];

    this.OWSReport = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: '', header: 'No. of Institute' },
      { field: '', header: 'No. of Beneficiery' },
      { field: '', header: 'No. of Transaction' },
      { field: '', header: 'Distribution' },
      { field: '', header: 'Commodity' },
      { field: '', header: 'Quantity' }
    ];

    this.DocumentCorrectionColumns = [
      { field: 'SlNo', header: 'S.No' },
      { field: 'DocNumber', header: 'Doc.No.' },
      { field: 'ApprovalStatus', header: 'Approval Status' },
      { field: 'ApprovedDate', header: 'Approved Date' },
      { field: 'ApproverReason', header: 'Approver Reason' },
      // { field: 'NoPacking', header: 'Bags' },
    ];

    this.DocumentCorrectionApproveColumns = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'RName', header: 'Region Name' },
      { field: 'GName', header: 'Godown Name' },
      { field: 'DocType', header: 'Doc.Type' },
      { field: 'DocNumber', header: 'Doc.No' },
      { field: 'CreatedDate', header: 'Requested Date' },
      { field: 'Reason', header: 'Correction Reason' },
      { field: 'ApprovalStatus', header: 'Status' },
      { field: 'ApproverReason', header: 'Approver Reason' }
    ];

    this.OBStackDetails = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'ITNAME', header: 'Commodity' },
      { field: 'StackNo', header: 'Stack No' },
      { field: 'StackBalanceBags', header: 'No of Bags' },
      { field: 'StackBalanceWeight', header: 'Quantity' },
      { field: 'StackDate', header: 'OB Stack Date' },
      { field: 'CurYear', header: 'Year' }
    ];

    this.StackCardClosing = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'Code', header: 'Code' },
      { field: 'Stackno', header: 'Stack No' },
      { field: 'Year', header: 'Card Year' },
      { field: 'Active', header: 'Active' },
      { field: 'OpeningDate', header: 'Opening Date' },
      { field: 'ClosingDate', header: 'Closing Date' },
      { field: 'Commodity', header: 'Item Name' }
    ];

    this.PartyLedgerMaster = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'RName', header: 'Region Name' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'Favour', header: 'Alias / Favour of' },
      { field: 'Pan', header: 'Pan No' },
      { field: 'TIN', header: 'GST No' },
      { field: 'Account', header: 'A/c No' },
      { field: 'Bank', header: 'Bank Name' },
      { field: 'Branch', header: 'Branch' },
      { field: 'IFSC', header: 'IFSC Code' },
      // { header: 'Modify' },
    ];

    this.PartyName = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'StateCode', header: 'State Code' },
      { field: 'Pan', header: 'Pan No' },
      { field: 'GSTNo', header: 'GST' },
      { field: 'TIN', header: 'GST No' },
    ];

    this.PurchaseTaxEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Amount' },
      { field: 'Percentage', header: 'Tax %' },
      { field: 'VatAmount', header: 'Tax Amount' },
      { field: 'Total', header: 'Total' },
      // { header: 'Modify' },
    ];

    this.SalesTaxEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'CommodityName', header: 'Commodity Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'Hsncode', header: 'Hsncode' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Rate', header: 'Rate' },
      { field: 'Amount', header: 'Value' },
      { field: 'TaxPercentage', header: 'Tax %' },
      { field: 'CGST', header: 'CGST Amt' },
      { field: 'SGST', header: 'SGST Amt' },
      { field: 'TaxAmount', header: 'Tax Amt' },
      { field: 'Total', header: 'Total Amt' },
      // { header: 'Modify' },
      // { header: 'Delete' }
    ];

    this.ServiceProviderEntry = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'Month', header: 'Month' },
      { field: 'Year', header: 'Year' },
      { field: 'CompanyName', header: 'Company Name' },
      { field: 'TIN', header: 'GST No' },
      { field: 'BillNo', header: 'Bill No' },
      { field: 'bd', header: 'Bill Date' },
      { field: 'CommodityName', header: 'Service Name' },
      { field: 'Amount', header: 'Amount' },
      { field: 'TaxPercentage', header: 'GST %' },
      { field: 'CGST', header: 'CGST Amt' },
      { field: 'SGST', header: 'SGST Amt' },
      { field: 'TaxAmount', header: 'Total Tax Amt' },
      { field: 'Total', header: 'Total Amt' },
      // { header: 'Modify' },
      // { header: 'Delete' }
    ];

    this.TenderAllotmentToRegionCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'SelectedOrderNo', header: 'Order Number' },
      { field: 'PartyName', header: 'Party Name' },
      { field: 'RName', header: 'Region Name' },
      { field: 'Spell', header: 'Spell' },
      { field: 'Quantity', header: 'Quantity' },
    ]

    this.TenderQuantityCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'Quantity', header: 'Quantity' },
    ]

    this.TenderAllotmentToGodownCols = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'OrderNumber', header: 'Order Number' },
      { field: 'GName', header: 'Godown Name' },
      { field: 'Quantity', header: 'Quantity' },
      { field: 'Remarks', header: 'Remarks' }
    ]

    this.AllotmentIssueQuantity = [
      { header: 'S.No', field: 'SlNo' },
      { field: 'AllotmentMonth', header: 'Month' },
      // { field: 'SIDate', header: 'Date' },
      { field: 'SocietyCode', header: 'Society Name' },
      { field: 'SocietyName', header: 'Society Name' },
      { field: 'Acscode', header: 'Shop Code' },
      { field: 'IssuerName', header: 'Issuer Name' },
      { field: 'Commodity', header: 'Commodity' },
      { field: 'Scheme', header: 'Scheme' },
      { field: 'AllotmentQty', header: 'Allotment Quantity' },
      { field: 'IssueQty', header: 'Issue Quantity' }
    ];
    
    this.ProcessToG2GIssueCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Stock Issue No', field: 'SINo' },
      { header: 'Issuer Name', field: 'IssuerName' },
      { header: 'Receivor Name', field: 'ReceivorName' },
    ];

    this.ProcessToG2GCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'DOC NO.', field: 'DocNumber' },
      { header: 'Start Date', field: 'GToGStartDate' },
      { header: 'End Date', field: 'GToGEndDate' },
      { header: 'Error', field: 'GToGError' },
      { header: 'Status', field: 'Status' }
    ];

    this.QuantityACIssueDetailsCommodity = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Commodity', field: 'Commodity' },
      { header: 'OB+Receipt', field: 'OBR' },
      { header: 'PDS/CRS', field: 'PDS' },
      { header: 'CO-OP/ICDS/OMR', field: 'ICDS' },
      { header: 'Po/Fi/Pr/Fo', field: 'Po' },
      { header: 'NMP', field: 'NMP' },
      { header: 'BUL/HOS/GAS/TEN/PONGAL', field: 'Scheme' },
      { header: 'CREDIT', field: 'Credit' },
      { header: 'OAP', field: 'Oap' },
      { header: 'SRILANKA', field: 'srilanka' },
      { header: 'AAY', field: 'Aay' },
      { header: 'SPds CRS', field: 'SPdsCRS' },
      { header: 'SPds COOP', field: 'SPdsCOOP' },
      { header: 'Cement/Flood', field: 'Cement' },
      { header: 'Total Sales', field: 'TotalSales' },
      { header: 'PTNMGR', field: 'PTNMGR' },
      { header: 'SGRY', field: 'SGRY' },
      { header: 'AnnaPoorna', field: 'AnnaPoorna' },
      { header: 'Total Free Rice', field: 'TotalFreeRice' },
      { header: 'Issues to Processing  ', field: 'IssuestoProcessing  ' },
      { header: 'Transfer Within Region', field: 'TransferWithinRegion' },
      { header: 'Transfer Other Region', field: 'TransferOtherRegion' },
      { header: 'WriteOff', field: 'WriteOff' },
      { header: 'Cl/Pack/BULKING', field: 'BULKING' },
      { header: 'Vc/Bt/Blg', field: 'Blg' },
      { header: 'Purchase Return', field: 'PurchaseReturn' },
      { header: 'Total Issues', field: 'Total Issues' },
      { header: 'Closing Balance', field: 'ClosingBalance' },
    ];

    this.StackCardDocDetailsCols = [
      { header: 'S.No', field: 'SlNo' },
      { header: 'Doc.No', field: 'DocNo' },
      { header: 'Party Name', field: 'ReceivedFrom'},
      { header: 'Lorry No.', field: 'LorryNo' },
      { header: 'Doc.created Date', field: 'CreatedDate' },
      { header: 'Bags', field: 'NOOfPACKING'},
      { header: 'Quantity', field: 'NETWT' },
    ];

    this.IssuerPartyCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'IssuerCode', header: 'Issuer Code' },
      { field: 'Issuername', header: 'Issuer Name' },
      // { field: 'PartyID', header: 'Party Code' },
      { field: 'PartyName', header: 'Party Name' },
    ];
  }
}