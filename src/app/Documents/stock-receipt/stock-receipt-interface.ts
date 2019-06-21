export interface StockReceipt {
    ReceivingCode: string;
    RCode: number;
    //SR-Details
    SRNo: any;
    SRDate: Date;
    PAllotment: any;
    OrderNo: number;
    OrderDate: Date;
    MTransport: string;
    Trcode: string;
    DepositorType: string;
    DepositorCode: string;
    TruckMemoNo: any;
    TruckMemoDate: Date;
    ManualDocNo: number;
    LNo: any;
    LFrom: any;
    //SR-Item Details
    TStockNo: number;
    Scheme: string;
    ICode: string;
    IPCode: string;
    NoPacking: any;
    GKgs: number;
    Nkgs: number;
    WTCode: string;
    Moisture: string;
    stackBalance: number;
}
