export interface StockReceipt {
    ReceivingCode: string;
    RCode: number;
    ItemDetail: any[];
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
    NKgs: number;
    WTCode: string;
    Moisture: string;
    StackBalance: number;
    //SR-Freight Details
    Remarks: string;
}
