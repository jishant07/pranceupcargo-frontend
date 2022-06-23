import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { APIQuotesModel, QuotationModel } from 'src/app/_models/model';
import { QuoteService } from 'src/app/_services/quote.service';

@Component({
  selector: 'app-onhold-quotation',
  templateUrl: './onhold-quotation.component.html',
  styleUrls: ['./onhold-quotation.component.css']
})
export class OnholdQuotationComponent {
  apiQuotes: APIQuotesModel[];
  
  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType','quoteAmount','deadline'];

  dataSource: MatTableDataSource<APIQuotesModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private quoteService : QuoteService) { 
      if(this.apiQuotes != null){
      this.dataSource.data = this.apiQuotes;
      }
  }

  ngOnInit(): void {
    this.quoteService.getQuotes()
    .subscribe((res: any) =>{
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.apiQuotes = JSON.parse(JSON.stringify( res.message));
        console.log(this.apiQuotes);
        // console.log(JSON.parse(JSON.stringify(this.apiQuotes[0].data)).uid);        
        this.dataSource = new MatTableDataSource(this.apiQuotes);
      }
    });
  }
  
  ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filter = '+filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}