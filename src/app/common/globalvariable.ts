export class GolbalVariable {
    ///Reports
    public static readonly StockDORegFilename = 'DOREG';
    public static readonly StockReceiptRegFilename = 'REREG';
    public static readonly StocTruckMemoRegFilename = 'TMREG';
    public static readonly StockIssueRegFilename = 'ISREG';
    public static readonly QuantityACForIssue = 'ISQAC';
    public static readonly QuantityACForReceipt = 'REQAC';
    public static readonly StackCardDetailsReport = 'SCARD';
    public static readonly QuantityACForReceiptScheme = 'REQASCHEME';
    public static readonly QuantityACForTruckMemoScheme = 'TMQASCHEME';
    public static readonly QuantityACForAllIssueScheme = 'ISQASCHEME';
    public static readonly QuantityACForIssueSchemeCRS = 'ISQACRS';
    public static readonly QuantityACForIssueSchemeCOOP = 'ISQASOCIETY';
    public static readonly QuantityACForReceiptDetailCommodity = '';
    public static readonly StackCardRegisterReport = 'SCARDREG';
    public static readonly OCRRegisterRpeort = 'OCRREG';
    public static readonly CommodityReceiptReport = 'COMREC';
    public static readonly CommodityIssueMemoReport = 'COMISS';
    public static readonly SchemeIssueMemo = 'SCHEMEISS';
    public static readonly HullingDetailsReportFileName = 'HULREG';
    public static readonly SchemeReceiptReportFileName = 'SCREC';
    public static readonly TransactionReceiptReportFileName = 'TRREC';    
    public static readonly WriteOffReportFileName = 'WOFF';
    public static readonly GUReportFileName = 'GU';
    public static readonly GRReportFileName = "GR";
    //Transfer
    public static readonly TruckToRegionFileName = 'TRUCKTOREGION';
    public static readonly TruckFromRegionFileName = 'TRUCKFROMREGION';
    //Purchase
    public static readonly HoPurchaseFileName = 'HOPURCHASE';
    public static readonly RoPurchaseFileName = 'ROPURCHASE';
    public static readonly RonoPurchaseFileName = 'RONOPURCHASE';

    //DeliveryOrderReport
    public static readonly DOAllSchemeReportFileName = 'DOALLSCH';
    public static readonly DODemandDraftDateFileName = 'DODDDATE';
    public static readonly DODemandDraftBankFileName = 'DODDBANK';
    public static readonly DOMarginReportFileName = 'DOMARGIN';
    public static readonly DOOAPReportFileName = 'DOOAP';
    public static readonly DOAnnapornaReportFileName = 'DOANNA';
    public static readonly DOOthersReportFileName = 'DOOTHERS';
    public static readonly DOSPLPDSReportFileName = 'DOSPLPDS';
    public static readonly DOSocietyReportFileName = 'DOSOCIETY';
    //Correction-slip
    public static readonly CorrectionSlipFileName = 'CORRSLIP';
    //SalesIssueMemo
    public static readonly SalesIssueMemoFileName = 'SIMCUSD';
    public static readonly SalesIssueMemoAbstractFileName = 'SIMABSD';


    ///Documents
    public static readonly StockReceiptDocument = 'REDOC';
    public static readonly StockIssueDocument = 'ISDOC';
    public static readonly StockTruckMemoDocument = 'TMDOC';
    public static readonly DeliveryOrderDocument = 'DODOC';
    public static readonly DDChequeDocument = 'DDCHE';
    public static readonly GSTFileName = 'GST';
}