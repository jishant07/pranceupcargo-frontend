import { FormArray, FormControl, FormGroup, Validators, FormBuilder, ControlContainer } from '@angular/forms';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { QuotationComponent } from '../quotation/quotation.component';
import { PlaceOrderComponent } from '../orders/place-order/place-order.component';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})

export class PieceComponent implements OnInit {
  hs_codediv: boolean = true;
  static hs_codediv: boolean;

  constructor(private elRef: ElementRef
    , private quotation: QuotationComponent
    , private placeOrder: PlaceOrderComponent) { }

  @Input() pieceForm:any;
  @Input() rowNumber: number = 0;

  ngOnInit(): void {}

  static makePieceItem(){

    if(localStorage.getItem('inco_terms') == 'ddp' || localStorage.getItem('inco_terms') == 'ddu') {
      this.hs_codediv = false;

      return new FormGroup({
        hs_code: new FormControl('',[Validators.required]),
        cargoType: new FormControl('',[Validators.required]),
        noOfPieces: new FormControl(null,[Validators.required]),
        length: new FormControl(null,[Validators.required]),
        breath: new FormControl(null,[Validators.required]),
        height: new FormControl(null,[Validators.required]),
        inchOrCm: new FormControl(null,[Validators.required]),
        grossWeight: new FormControl(null,[Validators.required])  
      });

    }else{
      
      return new FormGroup({
        hs_code: new FormControl(''),
        cargoType: new FormControl('',[Validators.required]),
        noOfPieces: new FormControl(null,[Validators.required]),
        length: new FormControl(null,[Validators.required]),
        breath: new FormControl(null,[Validators.required]),
        height: new FormControl(null,[Validators.required]),
        inchOrCm: new FormControl(null,[Validators.required]),
        grossWeight: new FormControl(null,[Validators.required])  
      });
    }
  }
  
  openhidehs_codediv() {
    if(localStorage.getItem('inco_terms') == 'ddp' || localStorage.getItem('inco_terms') == 'ddu') {
      this.hs_codediv = false;
    }else{
      this.hs_codediv = true;
    }
  }

  getClass() {
    if(localStorage.getItem('inco_terms') == 'ddp' || localStorage.getItem('inco_terms') == 'ddu') {
      return 'showdiv';
    }else{
      return 'hidediv';
    }
  }

  deleteRow(event:any){
    const parentElement = this.elRef.nativeElement.closest('.pieces-class');
    
    this.quotation.removePackage(parentElement);
    this.placeOrder.removePackage(parentElement);
  }  
}