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
  
  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  dataSource: MatTableDataSource<OrderModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService : OrderService) { 
  }

  ngOnInit(): void {
    this.orderService.getOrders()
    .subscribe((res: any) =>{
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.ordersData = JSON.parse(JSON.stringify( res.message));
        console.log(this.ordersData);      
        this.dataSource = new MatTableDataSource(this.ordersData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

}
