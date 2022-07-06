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
  mode:string = 'Air';

  displayedColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  displayAirModeColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationAirport'
      ,'airportOfOrigin','incoTerms','deliveryType'];

  displaySeaModeColumns: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort'
      ,'portOfOrigin','incoTerms','deliveryType'];

  displayAll: string[] = ['id','modeOfTransport','typeOfActivity','destinationPort','destinationAirport'
  ,'portOfOrigin','airportOfOrigin','incoTerms','deliveryType'];

  dataSource: MatTableDataSource<QuotationModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private quoteService : QuoteService) { 
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(){    
    const quoteState = 'EXPIRED';
    this.quoteService.getQuotes(quoteState)
    .subscribe((res: any) =>{
      ////Response format - {status: 'success', message: Array(9)}
      if(res.status == "success"){
        this.quotesData = JSON.parse(JSON.stringify( res.message));
        this.dataSource = new MatTableDataSource(this.quotesData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.changeMode(this.mode);
      }
      else if(res.status == "failure"){
        this.dataSource = new MatTableDataSource(this.quotesData);
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