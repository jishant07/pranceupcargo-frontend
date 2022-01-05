import { TypeaheadService } from './../_services/typeahead.service';
import { GlobalService } from './../_services/global.service';
import { FormGroup, FormControl, Validators, ValidationErrors, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.css']
})
export class EstimateComponent implements OnInit {

  estimateForm:FormGroup =  new FormGroup({
    modeOfTransport : new FormControl('',[Validators.required]),
    typeOfActivity : new FormControl('',[Validators.required]),
    destCountry : new FormControl(''),
    destinationPort: new FormControl(''),
    destinationAirport: new FormControl(''),
    countryOfOrigin: new FormControl(''),
    portOfOrigin: new FormControl(''),
    airportOfOrigin: new FormControl(''),
    incoTerms: new FormControl('',[Validators.required]),
    pieces: new FormArray([
      PieceComponent.makePieceItem()
    ])
  })
  isExport:string = ""
  countryList:any = []
  destCountryList:any = []
  countryOfOriginList:any = []
  chargableWeight:any = 0
  cbmWeight:any = 0

  constructor(public global_service:GlobalService,private typeadhead_service:TypeaheadService) { }

  ngOnInit(): void {
    this.typeadhead_service.getCountries().subscribe((res:any) =>{
      this.countryList = res.message;
      this.destCountryList = res.message;
      this.countryOfOriginList = res.message;
    })
  }

  activitySelected(event:any){
    if(event.value == 'Export'){
      this.isExport = "true"
      this.estimateForm.get('countryOfOrigin')?.removeValidators(Validators.required);
      this.estimateForm.get('countryOfOrigin')?.reset();
      this.estimateForm.get('destCountry')?.addValidators(Validators.required)
      if(this.estimateForm.value.modeOfTransport == 'SEA'){
        this.estimateForm.get('destinationAirport')?.removeValidators(Validators.required)
        this.estimateForm.get('destinationAirport')?.reset();
        this.estimateForm.get('destinationPort')?.addValidators(Validators.required)
      }else{
        this.estimateForm.get('destinationPort')?.removeValidators(Validators.required)
        this.estimateForm.get('destinationPort')?.reset();
        this.estimateForm.get('destinationAirport')?.addValidators(Validators.required)
      }
      this.estimateForm.updateValueAndValidity();
    }else{
      this.isExport = "false"
      this.estimateForm.get('destCountry')?.removeValidators(Validators.required);
      this.estimateForm.get('destCountry')?.reset();
      this.estimateForm.get('countryOfOrigin')?.addValidators(Validators.required)
      if(this.estimateForm.value.modeOfTransport == 'SEA'){
        this.estimateForm.get('airportOfOrigin')?.removeValidators(Validators.required)
        this.estimateForm.get('airportOfOrigin')?.reset();
        this.estimateForm.get('portOfOrigin')?.addValidators(Validators.required)
      }else{
        this.estimateForm.get('portOfOrigin')?.removeValidators(Validators.required)
        this.estimateForm.get('portOfOrigin')?.reset();
        this.estimateForm.get('airportOfOrigin')?.addValidators(Validators.required)
      }
      this.estimateForm.updateValueAndValidity();
    }
  }
  getFormValidationErrors(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      console.log("KEY ====> "+ key, form.get(key)?.errors)
    });
  }

  get pieceArray(){
    return this.estimateForm.get('pieces') as FormArray;
  }

  addNewPackageType(){
    this.pieceArray.push(PieceComponent.makePieceItem())  
  }

  destCountryTypeAhead(){
    let term = this.estimateForm.value.destCountry
    term = term.toLowerCase();
    this.destCountryList = this.countryList.filter(function(item:any){
      return item.countryName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }
  
  countryOfOriginTypeahead(){
    let term = this.estimateForm.value.countryOfOrigin
    term = term.toLowerCase();
    this.countryOfOriginList = this.countryList.filter(function(item:any){
      return item.countryName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  calculateChargableWeight(type:string){
    this.chargableWeight = 0;
    this.cbmWeight = 0;
    if(type == "AIR"){
      this.pieceArray.controls.forEach(control =>{
        let controlWeight = control.value.grossWeight * control.value.noOfPieces;
        this.chargableWeight = this.chargableWeight + (controlWeight)
      })
    }else{
      this.pieceArray.controls.forEach(control =>{
        let controlWeight = control.value.grossWeight * control.value.noOfPieces;
        this.cbmWeight = this.cbmWeight + (controlWeight)
      })
    }
  }

  estimateSubmit(){
    if(this.estimateForm.value.modeOfTransport == 'AIR'){
      this.calculateChargableWeight("AIR");
    }else{
      this.calculateChargableWeight("SEA")
    }
    console.log(this.estimateForm.value);
  }
}
