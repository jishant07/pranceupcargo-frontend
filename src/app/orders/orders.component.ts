import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderModel } from 'src/app/_models/model';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersData: OrderModel[];
  isLoading = true;
  mode:string = 'Air';
  hasData:boolean;

  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  displayAirModeColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationAirport'
      ,'airportOfOrigin','incoTerms','deliveryType'];

  displaySeaModeColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort'
      ,'portOfOrigin','incoTerms','deliveryType'];

  displayAll: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  dataSource: MatTableDataSource<OrderModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService : OrderService) { 
  }

  ngOnInit(): void {
    this.getData();
  }
  
  getData(){    
    const orderState = 'COMPLETED';
    this.orderService.getOrders(orderState)
    .subscribe((res: any) =>{
      console.log(res);
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.ordersData = JSON.parse(JSON.stringify( res.message));
        this.dataSource = new MatTableDataSource(this.ordersData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;   
        if(this.dataSource.data.length>0){this.hasData = true;}
        else{this.hasData = false;}     
        this.changeMode(this.mode);
      }
      else if(res.status == "failure"){
        this.dataSource = new MatTableDataSource(this.ordersData);
        this.isLoading = false;
        this.hasData = false;
      }
    });
  }

  ngAfterViewInit() {
    if(this.dataSource != null){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    this.mode = 'all';
    this.displayTableBasedOnMode();
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeMode(value:string){
    this.mode = value.toLocaleLowerCase();
    this.displayTableBasedOnMode();
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayTableBasedOnMode(){
    if(this.mode == 'air'){
      this.displayedColumns = this.displayAirModeColumns;
    }
    else if(this.mode == 'sea'){
      this.displayedColumns = this.displaySeaModeColumns
    }
    else{
      this.displayedColumns = this.displayAll; 
    }
  }

}
