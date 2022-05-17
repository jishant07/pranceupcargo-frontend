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
}
export class keyValuePairModel{
  key:string;
  value:string;
}