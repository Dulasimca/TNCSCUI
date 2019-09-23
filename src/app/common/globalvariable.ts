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
    public static readonly QuantityACForTruckMemoScheme = '';
    public static readonly QuantityACForAllIssueScheme = 'ISQASCHEME';
    public static readonly QuantityACForIssueSchemeCRS = 'ISQACRS';
    public static readonly QuantityACForIssueSchemeCOOP = 'ISQASOCIETY';

    ///Documents
    public static readonly StockReceiptDocument = 'REDOC';
    public static readonly StockIssueDocument = 'ISDOC';
    public static readonly StockTruckMemoDocument = 'TMDOC';
    public static readonly DeliveryOrderDocument = 'DODOC';
    public static readonly DDChequeDocument = 'DDCHE';
}