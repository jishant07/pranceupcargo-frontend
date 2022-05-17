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
    destCountryId : new FormControl(''),
    destinationPort: new FormControl(''),
    destinationAirport: new FormControl(''),
    countryOfOrigin: new FormControl(''),
    countryOfOriginId: new FormControl(''),
    portOfOrigin: new FormControl(''),
    airportOfOrigin: new FormControl(''),
    incoTerms: new FormControl('',[Validators.required]),
    pieces: new FormArray([
      //PieceComponent.makePieceItem()
    ]),
    deliveryType: new FormControl('',[Validators.required])
  })
  
  isActivityTypeSelected:boolean = false;
  isTransportModeSelected:boolean = false;
  isExport: boolean = false;
  isTrasnportTypeSea: boolean = false;
  countryList:any = []
  
  destCountryList:any = []
  destPortsList:any = []
  destFilterPortsList:any = []
  destAirportsList:any = []
  destFilterAirportsList:any = []

  countryOfOriginList:any = []
  countryOfOriginPortsList:any = []
  countryOforiginFilterPortsList: any = []
  countryOfOriginAirportsList:any = []
  countryOfOriginFilterAirportsList:any = []

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

  activityChanged(event:any){
    this.isActivityTypeSelected=true;
    if(event.value == 'Export'){
      this.isExport = true;
      this.estimateForm.get('countryOfOrigin')?.removeValidators(Validators.required);
      this.estimateForm.get('countryOfOriginId')?.removeValidators(Validators.required);
      this.estimateForm.get('countryOfOrigin')?.reset();
      this.estimateForm.get('countryOfOriginId')?.reset();
      this.estimateForm.get('destCountry')?.addValidators(Validators.required)
      this.estimateForm.get('destCountryId')?.addValidators(Validators.required)
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
      this.isExport = false;
      this.estimateForm.get('destCountry')?.removeValidators(Validators.required);
      this.estimateForm.get('destCountryId')?.removeValidators(Validators.required)
      this.estimateForm.get('destCountry')?.reset();
      this.estimateForm.get('destCountryId')?.reset();
      this.estimateForm.get('countryOfOrigin')?.addValidators(Validators.required)
      this.estimateForm.get('countryOfOriginId')?.addValidators(Validators.required)
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

  get pieceArray(){
    return this.estimateForm.get('pieces') as FormArray;
  }

  addNewPackageType(){
    //this.pieceArray.push(PieceComponent.makePieceItem())  
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

  destinationCountrySelected(event:any){
    let value = event.option.value
    this.estimateForm.patchValue({
      destCountryId: value.id,
      destCountry: value.countryName
    })
    this.typeadhead_service.getAirportByCountry(value.id).subscribe((res:any) =>{
      this.destAirportsList = res.message
      this.destFilterAirportsList = res.message
    })
    this.typeadhead_service.getPortsByCountry(value.id).subscribe((res:any) =>{
      this.destPortsList = res.message
      this.destFilterPortsList = res.message
    })
  }

  countryOfOriginSelected(event:any){
    let value = event.option.value
    this.estimateForm.patchValue({
      countryOfOriginId: value.id,
      countryOfOrigin: value.countryName
    })
    this.typeadhead_service.getAirportByCountry(value.id).subscribe((res:any) =>{
      this.countryOfOriginAirportsList = res.message
      this.countryOfOriginFilterAirportsList = res.message
    })
    this.typeadhead_service.getPortsByCountry(value.id).subscribe((res:any) =>{
      this.countryOfOriginPortsList = res.message
      this.countryOforiginFilterPortsList = res.message
    })
  }

  destAirportTypeAhead(){
    let term = this.estimateForm.value.destinationAirport
    term = term.toLowerCase();
    this.destFilterAirportsList = this.destAirportsList.filter(function(item:any){
      console.log(item);
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  destPortTypeAhead(){
    let term = this.estimateForm.value.destinationPort
    term = term.toLowerCase();
    this.destFilterPortsList = this.destPortsList.filter(function(item:any){
      console.log(item);
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  countryOfOriginAirportTypeahead(){
    let term = this.estimateForm.value.airportOfOrigin
    term = term.toLowerCase();
    this.countryOfOriginFilterAirportsList = this.countryOfOriginAirportsList.filter((item:any) =>{
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  countryOfOriginPortTypeahead(){
    let term = this.estimateForm.value.portOfOrigin
    term = term.toLowerCase();
    this.countryOforiginFilterPortsList = this.countryOforiginFilterPortsList.filter((item:any) =>{
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true;
    })
  }

  estimateSubmit(){
    if(this.estimateForm.value.modeOfTransport == 'AIR'){
      this.calculateChargableWeight("AIR");
    }else{
      this.calculateChargableWeight("SEA")
    }
    let temp:any = {}
    Object.keys(this.estimateForm.value).forEach(key =>{
      if(this.estimateForm.value[key] != "" && this.estimateForm.value[key] != null)temp[key] = this.estimateForm.value[key];
    })
    console.log(temp)
  }
  
  transportModeChanged(event:any){
    this.isTransportModeSelected=true;
    if(event.value.toLowerCase() =='sea'){
      this.isTrasnportTypeSea=true;
    }
    else{
      this.isTrasnportTypeSea=false;
    }
  }
}
