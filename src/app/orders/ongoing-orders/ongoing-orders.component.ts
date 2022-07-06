import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderModel } from 'src/app/_models/model';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-ongoing-orders',
  templateUrl: './ongoing-orders.component.html',
  styleUrls: ['./ongoing-orders.component.css']
})
export class OngoingOrdersComponent implements OnInit {
  ordersData: OrderModel[];
  isLoading = true;

  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  dataSource: MatTableDataSource<OrderModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService : OrderService) { 
  }

  ngOnInit(): void {
    const orderState = 'ACTIVE';
    this.orderService.getOrders(orderState)
    .subscribe((res: any) =>{
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.ordersData = JSON.parse(JSON.stringify( res.message));
        this.dataSource = new MatTableDataSource(this.ordersData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      }
      else if(res.status == "failure"){
        this.dataSource = new MatTableDataSource(this.ordersData);
        this.isLoading = false;
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  changeMode(value:string){
    if(value.toLowerCase() == 'air'){
      this.displayedColumns = ['id','modeOfTransport','typeOfActivity','destinationAirport'
      ,'airportOfOrigin','incoTerms','deliveryType'];
    }
    else if(value.toLowerCase() == 'sea'){
      this.displayedColumns = ['id','modeOfTransport','typeOfActivity','destinationPort'
      ,'portOfOrigin','incoTerms','deliveryType'];
    }
    else{
      this.displayedColumns = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
    ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];
    
    }
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
