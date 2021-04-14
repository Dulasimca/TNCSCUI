export class StatusMessage {
    public static readonly SEVERITY_SUCCESS = 'success';
    public static readonly SEVERITY_ERROR = 'error';
    public static readonly SEVERITY_WARNING = 'warn';
    public static readonly SUMMARY_SUCCESS = 'Success Message';
    public static readonly SUMMARY_WARNING = 'Warning Message';
    public static readonly SUMMARY_ALERT = 'Alert Message!';
    public static readonly SUMMARY_APPROVED = 'Approved!';
    public static readonly SUMMARY_REJECTED = 'Rejected!';
    public static readonly SUMMARY_REQUIRED = 'Data Required';
    public static readonly SUMMARY_ERROR = 'Error Message';
    public static readonly SUMMARY_INVALID = 'Invalid Date!'
    public static readonly SuccessMessage = 'Saved Successfully!';
    public static readonly ErrorMessage = 'Please Contact Administrator!';
    public static readonly WarningMessage = 'Please try after sometime!';
    public static readonly NoRecordMessage = 'No Record Found!';
    public static readonly ErrorGeneratingDocNo = 'Error occurred in generating document number!';
    public static readonly NoRecForCombination = 'No Record for this combination!'
    public static readonly NetworkErrorMessage = 'Please check your Network Connectivity!';
    public static readonly ExceedingStackBalance = 'Exceeding the Stack Balance!';
    public static readonly NotSufficientStackBalance = 'Stack Balance is not sufficient!';
    public static readonly ValidDateErrorMessage = 'Please select a valid date range!';
    public static readonly StackCardClosedMessage = 'Stack Card has been closed  already!';
    public static readonly RunningStackCardErrMessage = 'You have entered running stack card number!';
    public static readonly ExistingStackCardErrMessage = 'Stack card is existing!';
    public static readonly StackCardClosingDateErrMessage = 'Closing date must be greater than opening date!';
    public static readonly StackCardClosedSucceesMessage = 'Card Closed!';
    public static readonly ValidCredentialsErrorMessage = 'Please Enter Valid Credentials!';
    public static readonly PasswordChangeSuccessMessage = 'Password changed Successfully!';
    public static readonly PasswordMatchErrorMessage = 'Password did not match!';
    public static readonly NoRecordForCBChart = 'No Record found for CB!';
    public static readonly NoRecordForReceiptChart = 'No Record found for Receipt!';
    public static readonly NoRecordForIssueChart = 'No Record found for Issue!';
    public static readonly DashboardNoRecord = 'No Record found today!';
    public static readonly CHAndPayableAtInDO = 'Please enter CH/DD/PO/OCR No! or Payable At';
    public static readonly BankNameInDO = 'Please enter "C-" For Cereal or "N-" For Non-Cereal then enter bank name!';
    public static readonly DocumentMissingFields = 'Please fill all the below missing fields - ';
    public static readonly StackcardDeleted = 'Stack card deleted successfully!';
    public static readonly SuccessValidationMsg = 'Proceed with save or print!';
    public static readonly GodownCodeMismatch = 'Godown Code is Mismatching! Please select valid doc!';
    public static readonly PurchaseTargetDateValidation = 'You have entered target date beyond completed date!';
    public static readonly AllotmentIssueQuantityValidation = 'No available balance in allotted quantity!';
    public static readonly AllotmentPercentQtyValidation = 'No available balance in allotted 60% of quantity!';
    public static readonly ExceedingAllotmentQty = 'Exceeding the allotted quantity!';
    public static readonly ExceedingAllotmentQtyOfPercent = 'Exceeding the 60% of allotted quantity!';
    public static readonly NoAllotmentBalance = 'No Allotment Balance found!';
    public static readonly NoSocietyCodeForIssue = 'Society Code is missing for issuer: ';
    public static readonly NoACSCodeForIssue = 'ACSCode is missing for issuer: ';
    public static readonly NoSocietyAndACSCodeForIssue = 'Society and ACSCode are missing for issuer: ';
    public static readonly NotValidReceiptDateForStackCard = 'Receipt date must be before or on the selected stack card date';
    public static readonly NoGatePassFound = 'No GatePass found for selected date!';
    public static readonly PartyNameExists = 'Entered Party Name already exists!';
    public static readonly RateExists = 'Entered Commodity and Scheme is already available for this date. Please update the close date for the existing record!';
    public static readonly ProvideSignature = 'Please provide a signature first!';
    public static readonly NoLeftDataToProcess = 'No data left to process for this combination';
    public static readonly DOSalesTaxImportError = 'Failed to import DO to Sales Tax !';
    public static readonly DOSalesTaxImportSuccess = 'Imported Successfully !';
    public static readonly DOAprrovalMessage = 'Approval sent for ';
    public static readonly NoAccountingYearFound = 'No accounting year found!';
    public static readonly HSNCodeError = 'Selected Item has no HSNCode! Please update item details in Item Master.'
    public static readonly SalesDataCleared = 'No uncleared data is been found! Proceed with View';
    public static readonly TransferSuccessMsg = 'Transferred Successfully !';
}