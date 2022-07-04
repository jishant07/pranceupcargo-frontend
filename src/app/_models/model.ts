export class AirportModel{
    id:string;
    airportName:string;
    airportTag:string;
    state:string;
    country:string;
    express?:{gen:number,haz:number};
    normal?:{gen:number,haz:number};
}
export class PortsModel{
    id:string;
    portName:string;
    state:string;
    country:string;
    express?:{gen:number,haz:number};
    normal?:{gen:number,haz:number};
}
export class PiecesModel{     
    cargoType:string;  
    noOfPieces:number;  
    length:number;  
    breath:number;  
    height:number;  
    inchOrCm:string; 
    grossWeight:number; 
    hs_code?:string;    
}
export interface keyValuePairModel{
  key:string;
  value:string;
}
// export interface APIQuotesModel{
//     id:string;
//     data: QuotationModel[];
//     destinationData: PortModel;
//     originData: PortModel;      
// }
export interface QuotationModel{
    id: string;
    modeOfTransport: string;
    typeOfActivity: string;
    incoTerms: string;
    pieces: PiecesModel[];

    deliveryType: string;

    //Inco Tearm - Ex Works(exw)
    pickUpAddress?: string;
    spocName?: string;
    spocPhone?: string;

    //Inco Tearm - Free Carrier(fca)
    shipperAddress?: string;
    fcaLocation?: string;

    //Inco Tearm - Delivered at Place(dap)
    dapdduAddress?: string;

    //Inco Tearm - Delivered Duty Paid(ddp)
    ddpdduAddress?: string;
    //hscode: new FormControl(''),
    invoiceValue?: string;

    //Inco Tearm - Delivered Duty Unpaid(ddu)
    dduAddress?: string;
    dduInvoiceValue?: string;

    //Extra properties
    quoteAmount: string;
    deadline: string;
    status: string;
    uid: string;
    sentFrom: string;

    
    portOfOrigin: string;
    originPortName:string;

    airportOfOrigin: string;
    originAirportName:string;
    originAirportTag:string;
    
    originState:string;
    originCountry:string;

    destinationPort: string;
    destinationPortName:string;

    destinationAirport: string;
    destinationAirportName:string;
    destinationAirportTag:string;

    destinationState:string;
    destinationCountry:string;
}
export interface OrderModel{
    id: string;
    modeOfTransport: string;
    typeOfActivity: string;
    incoTerms: string;
    pieces: PiecesModel[];

    deliveryType: string;

    //Inco Tearm - Ex Works(exw)
    pickUpAddress?: string;
    spocName?: string;
    spocPhone?: string;

    //Inco Tearm - Free Carrier(fca)
    shipperAddress?: string;
    fcaLocation?: string;

    //Inco Tearm - Delivered at Place(dap)
    dapdduAddress?: string;

    //Inco Tearm - Delivered Duty Paid(ddp)
    ddpdduAddress?: string;
    //hscode: new FormControl(''),
    invoiceValue?: string;

    //Inco Tearm - Delivered Duty Unpaid(ddu)
    dduAddress?: string;
    dduInvoiceValue?: string;

    //Extra properties
    quoteAmount: string;
    deadline: string;
    status: string;
    uid: string;
    sentFrom: string;

    
    portOfOrigin: string;
    originPortName:string;

    airportOfOrigin: string;
    originAirportName:string;
    originAirportTag:string;
    
    originState:string;
    originCountry:string;

    destinationPort: string;
    destinationPortName:string;

    destinationAirport: string;
    destinationAirportName:string;
    destinationAirportTag:string;

    destinationState:string;
    destinationCountry:string;
}