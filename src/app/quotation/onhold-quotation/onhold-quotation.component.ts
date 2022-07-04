import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { QuotationModel } from 'src/app/_models/model';
import { QuoteService } from 'src/app/_services/quote.service';

@Component({
  selector: 'app-onhold-quotation',
  templateUrl: './onhold-quotation.component.html',
  styleUrls: ['./onhold-quotation.component.css']
})
export class OnholdQuotationComponent implements OnInit, AfterViewInit {
  quotesData: QuotationModel[];
  isLoading = true;
  
  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType','quoteAmount','deadline'];

  dataSource: MatTableDataSource<QuotationModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private quoteService : QuoteService) { 
  }

  ngOnInit(): void {
    this.quoteService.getQuotes()
    .subscribe((res: any) =>{
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.quotesData = JSON.parse(JSON.stringify( res.message));
        this.dataSource = new MatTableDataSource(this.quotesData);
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