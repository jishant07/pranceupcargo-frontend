import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder, Validator, ValidatorFn } from '@angular/forms';
import { PieceComponent } from '../piece/piece.component';

import { GlobalService } from '../_services/global.service';
import { TypeaheadService } from '../_services/typeahead.service';

import { AirportModel, PortsModel, keyValuePairModel } from '../_models/model';

import { QuoteService } from '../_services/quote.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  @ViewChild(PieceComponent, { static: false }) childC: PieceComponent;

  /* Properties */
  isActivityTypeSelected: boolean = false;
  isTransportModeSelected: boolean = false;
  isExport: boolean = false;
  isTrasnportTypeSea: boolean = false;

  countryList: any = []
  destCountryList: any = []
  destPortsList: any = []
  destFilterPortsList: any = []
  destAirportsList: any = []
  destFilterAirportsList: any = []
  countryOfOriginList: any = []
  countryOfOriginPortsList: any = []
  countryOforiginFilterPortsList: any = []
  countryOfOriginAirportsList: any = []
  countryOfOriginFilterAirportsList: any = []

  chargableWeight: any = 0
  cbmWeight: any = 0

  indianPortsArray: PortsModel[];
  allPortsArray: PortsModel[];
  allDestinationPorts: string[] = [];
  allOriginPorts: string[] = [];
  filteredDestinationPorts: string[] = [];
  filteredOriginPorts: string[] = [];
  destinationPorts: boolean = true;
  originPorts: boolean = false;
  allDestinationPortsKeyValue: keyValuePairModel[] = [];
  allOriginPortsKeyValue: keyValuePairModel[] = [];


  indianAirportsArray: AirportModel[];
  allAirportsArray: AirportModel[];
  allDestinationAirports: string[] = [];
  allOriginAirports: string[] = [];
  filteredDestinationAirports: string[] = [];
  filteredOriginAirports: string[] = [];
  destinationAirports: boolean = true;
  originAirports: boolean = false;
  allDestinationAirportsKeyValue: keyValuePairModel[] = [];
  allOriginAirportsKeyValue: keyValuePairModel[] = [];

  activityTypeExport: string = 'Export';
  activityTypeImport: string = 'Import';
  TransportModeAir: string = 'Air';
  TransportModeSea: string = 'Sea';

  rowNumber: number = 0;
  hs_codediv: boolean = true;

  constructor(
    public global_service: GlobalService
    , private typeadhead_service: TypeaheadService
    , private fb: FormBuilder
    , private quoteService: QuoteService
    , private router: Router) {
  }

  estimateForm = this.fb.group({
    modeOfTransport: new FormControl('', [Validators.required]),
    typeOfActivity: new FormControl('', [Validators.required]),
    destinationPort: [''],
    destinationAirport: new FormControl(''),
    portOfOrigin: new FormControl(''),
    airportOfOrigin: new FormControl(''),
    incoTerms: new FormControl('', [Validators.required]),
    pieces: new FormArray([
      PieceComponent.makePieceItem()
    ]),

    deliveryType: new FormControl('', [Validators.required]),

    //Inco Tearm - Ex Works(exw)
    pickUpAddress: new FormControl(''),
    spocName: new FormControl(''),
    spocPhone: new FormControl(''),

    //Inco Tearm - Free Carrier(fca)
    shipperAddress: new FormControl(''),
    fcaLocation: new FormControl(''),

    //Inco Tearm - Delivered at Place(dap)
    dapdduAddress: new FormControl(''),

    //Inco Tearm - Delivered Duty Paid(ddp)
    ddpdduAddress: new FormControl(''),
    //hscode: new FormControl(''),
    invoiceValue: new FormControl(''),

    //Inco Tearm - Delivered Duty Unpaid(ddu)
    dduAddress: new FormControl(''),
    //dduHscode: new FormControl(''),
    dduInvoiceValue: new FormControl(''),
  });

  ngOnInit(): void {
    this.incoTerm_removeAllValidation();
    this.autoComplete();            
    localStorage.setItem('hs', '0');
  }

  activityChanged(event: any) {
    this.getPorts();
    this.getAirports();
    this.isActivityTypeSelected = true;
    if (event.value == this.activityTypeExport) {
      this.isExport = true;
      this.estimateForm.get('countryOfOrigin')?.removeValidators(Validators.required);
      this.estimateForm.get('countryOfOriginId')?.removeValidators(Validators.required);
      this.estimateForm.get('countryOfOrigin')?.reset();
      this.estimateForm.get('countryOfOriginId')?.reset();
      this.estimateForm.get('destCountry')?.addValidators(Validators.required)
      this.estimateForm.get('destCountryId')?.addValidators(Validators.required)
      if (this.estimateForm.value.modeOfTransport == 'SEA') {
        this.estimateForm.get('destinationAirport')?.removeValidators(Validators.required)
        this.estimateForm.get('destinationAirport')?.reset();
        this.estimateForm.get('destinationPort')?.addValidators(Validators.required)
      } else {
        this.estimateForm.get('destinationPort')?.removeValidators(Validators.required)
        this.estimateForm.get('destinationPort')?.reset();
        this.estimateForm.get('destinationAirport')?.addValidators(Validators.required)
      }
      this.estimateForm.updateValueAndValidity();
    } else {
      this.isExport = false;
      this.estimateForm.get('destCountry')?.removeValidators(Validators.required);
      this.estimateForm.get('destCountryId')?.removeValidators(Validators.required)
      this.estimateForm.get('destCountry')?.reset();
      this.estimateForm.get('destCountryId')?.reset();
      this.estimateForm.get('countryOfOrigin')?.addValidators(Validators.required)
      this.estimateForm.get('countryOfOriginId')?.addValidators(Validators.required)
      if (this.estimateForm.value.modeOfTransport == 'SEA') {
        this.estimateForm.get('airportOfOrigin')?.removeValidators(Validators.required)
        this.estimateForm.get('airportOfOrigin')?.reset();
        this.estimateForm.get('portOfOrigin')?.addValidators(Validators.required)
      } else {
        this.estimateForm.get('portOfOrigin')?.removeValidators(Validators.required)
        this.estimateForm.get('portOfOrigin')?.reset();
        this.estimateForm.get('airportOfOrigin')?.addValidators(Validators.required)
      }
      this.estimateForm.updateValueAndValidity();
    }
  }

  get pieceArray() {
    return this.estimateForm.get('pieces') as FormArray;
  }

  destCountryTypeAhead() {
    let term = this.estimateForm.value.destCountry
    term = term.toLowerCase();
    this.destCountryList = this.countryList.filter(function (item: any) {
      return item.countryName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  countryOfOriginTypeahead() {
    debugger
    let term = this.estimateForm.value.countryOfOrigin
    term = term.toLowerCase();
    this.countryOfOriginList = this.countryList.filter(function (item: any) {
      return item.countryName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  calculateChargableWeight(type: string) {
    this.chargableWeight = 0;
    this.cbmWeight = 0;
    if (type == "AIR") {
      this.pieceArray.controls.forEach(control => {
        let controlWeight = control.value.grossWeight * control.value.noOfPieces;
        this.chargableWeight = this.chargableWeight + (controlWeight)
      })
    } else {
      this.pieceArray.controls.forEach(control => {
        let controlWeight = control.value.grossWeight * control.value.noOfPieces;
        this.cbmWeight = this.cbmWeight + (controlWeight)
      })
    }
  }

  destinationCountrySelected(event: any) {
    let value = event.option.value
    this.estimateForm.patchValue({
      destCountryId: value.id,
      destCountry: value.countryName
    })
    this.typeadhead_service.getAirportByCountry(value.id).subscribe((res: any) => {
      this.destAirportsList = res.message
      this.destFilterAirportsList = res.message
    })
    this.typeadhead_service.getPortsByCountry(value.id).subscribe((res: any) => {
      this.destPortsList = res.message
      this.destFilterPortsList = res.message
    })
  }

  countryOfOriginSelected(event: any) {
    let value = event.option.value
    this.estimateForm.patchValue({
      countryOfOriginId: value.id,
      countryOfOrigin: value.countryName
    })
    this.typeadhead_service.getAirportByCountry(value.id).subscribe((res: any) => {
      this.countryOfOriginAirportsList = res.message
      this.countryOfOriginFilterAirportsList = res.message
    })
    this.typeadhead_service.getPortsByCountry(value.id).subscribe((res: any) => {
      this.countryOfOriginPortsList = res.message
      this.countryOforiginFilterPortsList = res.message
    })
  }

  destAirportTypeAhead() {
    let term = this.estimateForm.value.destinationAirport
    term = term.toLowerCase();
    this.destFilterAirportsList = this.destAirportsList.filter(function (item: any) {
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  destPortTypeAhead() {
    let term = this.estimateForm.value.destinationPort
    term = term.toLowerCase();
    this.destFilterPortsList = this.destPortsList.filter(function (item: any) {
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  countryOfOriginAirportTypeahead() {
    let term = this.estimateForm.value.airportOfOrigin
    term = term.toLowerCase();
    this.countryOfOriginFilterAirportsList = this.countryOfOriginAirportsList.filter((item: any) => {
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }

  countryOfOriginPortTypeahead() {
    let term = this.estimateForm.value.portOfOrigin
    term = term.toLowerCase();
    this.countryOforiginFilterPortsList = this.countryOforiginFilterPortsList.filter((item: any) => {
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true;
    })
  }
  estimateSubmit() {
    if(!this.estimateForm.valid){
      return;
    }
    let formData: any = {};
    if (this.estimateForm.value.modeOfTransport == 'AIR') {
      this.calculateChargableWeight("AIR");
      Object.keys(this.estimateForm.value).forEach(key => {
        if (this.estimateForm.value[key] != "" && this.estimateForm.value[key] != null) {

          if (key == 'portOfOrigin' || key == 'destinationPort') {
            //Do not add portOfOrigin & destinationPort if transport mode is Air
          }
          else if (key == 'airportOfOrigin') {
            formData[key] = this.GetAirortPlaceIdByAirportName(this.originPorts, this.estimateForm.value[key]); 
          }
          else if (key == 'destinationAirport') {
            formData[key] = this.GetAirortPlaceIdByAirportName(this.destinationPorts, this.estimateForm.value[key]);
          }
          else {
            formData[key] = this.estimateForm.value[key];
          }
        }
      });
    } else {
      this.calculateChargableWeight("SEA")
      Object.keys(this.estimateForm.value).forEach(key => {
        if (this.estimateForm.value[key] != "" && this.estimateForm.value[key] != null) {

          if (key == 'airportOfOrigin' || key == 'destinationAirport') {
            //Do not add airportOfOrigin & destinationAirport if transport mode is Sea
          }
          else if (key == 'portOfOrigin') {
            formData[key] = this.GetPortPlaceIdByPortName(this.originPorts, this.estimateForm.value[key]);
          }
          else if (key == 'destinationPort') {
            formData[key] = this.GetPortPlaceIdByPortName(this.destinationPorts, this.estimateForm.value[key]);
          }
          else {
            formData[key] = this.estimateForm.value[key];
          }

        }
      });

    }
    // console.log(this.estimateForm);    
    formData["sentFrom"] = "USER";
    //console.log(formData)

    this.quoteService.quoteOnHold(formData).subscribe((res: any) => {
     //res = {status: 'success', message: 'qtyOFyP20ClbVz7Syz06'}
     if(res != null && res.status == 'success'){
      this.global_service.openSnackBar("Quotation submitted successful");
      this.router.navigate(["/onholdquotation"])
     }
     else{
      this.global_service.openSnackBar("There is some technical problem, try again later")
     }
    },error=>{
      this.global_service.openSnackBar("Error: There is some technical problem, try again later");
      this.global_service.openSnackBar(error);
    });
  }

  transportModeChanged(event: any) {
    this.isTransportModeSelected = true;
    if (event.value.toLowerCase() == 'sea') {
      this.getPorts();
      this.isTrasnportTypeSea = true;
    }
    else {
      this.getAirports();
      this.isTrasnportTypeSea = false;
    }
  }

  //Begin: Inco Terms
  incoTermChanged(event: any) {
    this.incoTerm_removeAllValidation();
    var selectedIncoTearm = this.estimateForm.value.incoTerms.toLowerCase();
    //localStorage.setItem('inco_terms', selectedIncoTearm)
    if( selectedIncoTearm == 'ddp' || selectedIncoTearm == 'ddu'){         
      localStorage.setItem('hs', '1');
    }
    else{         
      localStorage.setItem('hs', '0');
    }

    switch (selectedIncoTearm) {
      case 'exw':
        //Ex Works        
        this.incoTerm_exw_Validation('add');
        break;
      case 'fca':
        //Free Carrier
        this.incoTerm_fca_Validation('add');
        break;
      case 'cpt':
        //Carrige Paid To
        break;
      case 'cip':
        //Carrige and Insurance Paid To
        break;
      case 'dap':
        //Delivered at Place
        this.incoTerm_dap_Validation('add');
        break;
      case 'dpu':
        //Delivered at Place Unload
        break;
      case 'ddp':
        //Delivered Duty Paid
        this.incoTerm_ddp_Validation('add');  
        break;
      case 'ddu':
        //Delivered Duty Unpaid
        this.incoTerm_ddu_Validation('add'); 
        break;
      case 'fas':
        //Free Alongside ship
        break;
      case 'fob':
        //Free on Board
        break;
      case 'cfr':
        //Cost and Freight
        break;
      case 'cif':
        //Cost Insurance and Freight
        break;
      default:
        //console.log("No such day exists!");
        this.incoTerm_removeAllValidation();
        break;
    }
  }

  incoTerm_removeAllValidation() {
    this.incoTerm_exw_Validation('remove');
    this.incoTerm_fca_Validation('remove');
    this.incoTerm_dap_Validation('remove');
    this.incoTerm_ddp_Validation('remove');
    this.incoTerm_ddu_Validation('remove');
  }

  incoTerm_exw_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.estimateForm.get('pickUpAddress')?.addValidators(Validators.required);
      this.estimateForm.get('spocName')?.addValidators(Validators.required);
      this.estimateForm.get('spocPhone')?.addValidators(Validators.required);
    }
    else {
      // this.estimateForm.get('pickUpAddress')?.removeValidators(Validators.required);
      // this.estimateForm.get('spocName')?.removeValidators(Validators.required);
      // this.estimateForm.get('spocPhone')?.removeValidators(Validators.required);

      this.estimateForm.get('pickUpAddress')?.clearValidators();
      this.estimateForm.get('spocName')?.clearValidators();
      this.estimateForm.get('spocPhone')?.clearValidators();

      this.estimateForm.get('pickUpAddress')?.setValue('');
      this.estimateForm.get('spocName')?.setValue('');
      this.estimateForm.get('spocPhone')?.setValue('');
    }
    this.estimateForm.updateValueAndValidity();
  }

  incoTerm_fca_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.estimateForm.get('shipperAddress')?.addValidators(Validators.required);
      this.estimateForm.get('fcaLocation')?.addValidators(Validators.required);
    }
    else {
      // this.estimateForm.get('shipperAddress')?.removeValidators(Validators.required);
      // this.estimateForm.get('fcaLocation')?.removeValidators(Validators.required);

      this.estimateForm.get('shipperAddress')?.clearValidators();
      this.estimateForm.get('fcaLocation')?.clearValidators();

      this.estimateForm.get('shipperAddress')?.setValue('');
      this.estimateForm.get('fcaLocation')?.setValue('');
    }
    this.estimateForm.updateValueAndValidity();
  }

  incoTerm_dap_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.estimateForm.get('dapdduAddress')?.addValidators(Validators.required);
    }
    else {
      //this.estimateForm.get('dapdduAddress')?.removeValidators(Validators.required);      
      this.estimateForm.get('dapdduAddress')?.clearValidators();

      this.estimateForm.get('dapdduAddress')?.setValue('');
    }
    this.estimateForm.updateValueAndValidity();
  }

  incoTerm_ddp_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.estimateForm.get('ddpdduAddress')?.addValidators(Validators.required);
      //this.estimateForm.get('hscode')?.addValidators(Validators.required);
      this.estimateForm.get('invoiceValue')?.addValidators(Validators.required);
    }
    else {
      // this.estimateForm.get('ddpdduAddress')?.removeValidators(Validators.required);
      // this.estimateForm.get('hscode')?.removeValidators(Validators.required);
      // this.estimateForm.get('invoiceValue')?.removeValidators(Validators.required);

      this.estimateForm.get('ddpdduAddress')?.clearValidators();
      //this.estimateForm.get('hscode')?.clearValidators();
      this.estimateForm.get('spocPhone')?.clearValidators();

      this.estimateForm.get('ddpdduAddress')?.setValue('');
      //this.estimateForm.get('hscode')?.setValue('');
      this.estimateForm.get('invoiceValue')?.setValue('');
    }
    this.estimateForm.updateValueAndValidity();
  }

  incoTerm_ddu_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.estimateForm.get('dduAddress')?.addValidators(Validators.required);
      //this.estimateForm.get('dduHscode')?.addValidators(Validators.required);
      this.estimateForm.get('dduInvoiceValue')?.addValidators(Validators.required);
    }
    else {
      this.estimateForm.get('dduAddress')?.clearValidators();
      //this.estimateForm.get('dduHscode')?.clearValidators();
      this.estimateForm.get('spocPhone')?.clearValidators();

      this.estimateForm.get('dduAddress')?.setValue('');
      //this.estimateForm.get('dduHscode')?.setValue('');
      this.estimateForm.get('dduInvoiceValue')?.setValue('');
    }
    this.estimateForm.updateValueAndValidity();
  }

  incoTermsExWorksFormControls() {
    this.estimateForm = new FormGroup({
      modeOfTransport: new FormControl('', [Validators.required]),
      typeOfActivity: new FormControl('', [Validators.required]),
      destCountry: new FormControl(''),
      destCountryId: new FormControl(''),
      destinationPort: new FormControl(''),
      destinationAirport: new FormControl(''),
      countryOfOrigin: new FormControl(''),
      countryOfOriginId: new FormControl(''),
      portOfOrigin: new FormControl(''),
      airportOfOrigin: new FormControl(''),
      incoTerms: new FormControl('', [Validators.required]),
      pieces: new FormArray([
        PieceComponent.makePieceItem()
      ]),
      deliveryType: new FormControl('', [Validators.required]),
      pickUpAddress: new FormControl('', [Validators.required]),
      spocName: new FormControl('', [Validators.required]),
      spocPhone: new FormControl('', [Validators.required])
    });
  }
  //End: Inco Terms
  //Begin: Port and Airports
  autoComplete() {
    //Ports
    this.estimateForm.get('portOfOrigin')?.valueChanges.subscribe(value => {
      this.getFilteredPorts(this.originPorts, value);
    });
    this.estimateForm.get('destinationPort')?.valueChanges.subscribe(value => {
      this.getFilteredPorts(this.destinationPorts, value);
    });
    //Airport
    this.estimateForm.get('airportOfOrigin')?.valueChanges.subscribe(value => {
      this.getFilteredAirports(this.originPorts, value);
    });
    this.estimateForm.get('destinationAirport')?.valueChanges.subscribe(value => {
      this.getFilteredAirports(this.destinationPorts, value);
    });
  }

  getPorts() {
    this.estimateForm.controls['destinationPort'].reset();
    this.estimateForm.controls['portOfOrigin'].reset();

    if (this.estimateForm.value.typeOfActivity.toLowerCase() == this.activityTypeExport.toLowerCase()) {

      if (this.estimateForm.value.modeOfTransport.toLowerCase() == this.TransportModeSea.toLowerCase()) {
        this.getIndianPorts(this.originPorts);
        this.getPortsExceptIndia(this.destinationPorts);
      }
    }
    else {

      if (this.estimateForm.value.modeOfTransport.toLowerCase() == this.TransportModeSea.toLowerCase()) {
        this.getPortsExceptIndia(this.originPorts);
        this.getIndianPorts(this.destinationPorts);
      }
    }
  }
  getIndianPorts(isDestinationPorts: boolean) {
    this.typeadhead_service.getIndianPorts().subscribe((res: any) => {
      this.indianPortsArray = res.message;

      var filteredPorts: string[] = [];
      var filteredPortsKeyValue: keyValuePairModel[] = [];
      //To convert array value into comma separated 
      this.indianPortsArray?.forEach(element => {
        filteredPorts.push(element.portName + ', ' + element.state + ', ' + element.country);
        filteredPortsKeyValue.push({ key: element.id, value: element.portName + ', ' + element.state + ', ' + element.country });
      });

      this.allDestinationPorts = isDestinationPorts ? filteredPorts : this.allDestinationPorts;
      this.allOriginPorts = isDestinationPorts ? this.allOriginPorts : filteredPorts;

      this.allDestinationPortsKeyValue = isDestinationPorts ? filteredPortsKeyValue : this.allDestinationPortsKeyValue;
      this.allOriginPortsKeyValue = isDestinationPorts ? this.allOriginPortsKeyValue : filteredPortsKeyValue;

      this.filteredDestinationPorts = this.allDestinationPorts;
      this.filteredOriginPorts = this.allOriginPorts;

      // console.log('isDestinationPorts '+isDestinationPorts);
      // console.log(this.filteredOriginPorts);
      // console.log(this.filteredDestinationPorts);
    });
  }
  getPortsExceptIndia(isDestinationPorts: boolean) {
    this.typeadhead_service.getPortsExceptIndia().subscribe((res: any) => {
      this.allPortsArray = res.message;

      var filteredPorts: string[] = [];
      var filteredPortsKeyValue: keyValuePairModel[] = [];
      //To convert array value into comma separated 
      this.allPortsArray?.forEach(element => {
        filteredPorts.push(element.portName + ', ' + element.state + ', ' + element.country);
        filteredPortsKeyValue.push({ key: element.id, value: element.portName + ', ' + element.state + ', ' + element.country });
      });

      this.allDestinationPorts = isDestinationPorts ? filteredPorts : this.allDestinationPorts;
      this.allOriginPorts = isDestinationPorts ? this.allOriginPorts : filteredPorts;

      this.allDestinationPortsKeyValue = isDestinationPorts ? filteredPortsKeyValue : this.allDestinationPortsKeyValue;
      this.allOriginPortsKeyValue = isDestinationPorts ? this.allOriginPortsKeyValue : filteredPortsKeyValue;

      this.filteredDestinationPorts = this.allDestinationPorts;
      this.filteredOriginPorts = this.allOriginPorts;

      // console.log('isDestinationPorts '+isDestinationPorts);
      // console.log(this.filteredOriginPorts);
      // console.log(this.filteredDestinationPorts);
    });
  }
  getFilteredPorts(isDestinationPorts: boolean, enteredstring: string) {
    if (enteredstring == null) {
      return;
    }
    if (isDestinationPorts) {
      this.filteredDestinationPorts = this.allDestinationPorts.filter(item => {
        return item.toLowerCase().indexOf(enteredstring.toLowerCase()) > -1
      });
    }
    else {
      this.filteredOriginPorts = this.allOriginPorts.filter(item => {
        return item.toLowerCase().indexOf(enteredstring.toLowerCase()) > -1
      });
    }
  }

  GetPortPlaceIdByPortName(isDestinationPorts: boolean, Port: string) {
    if (isDestinationPorts)
      return this.allDestinationPortsKeyValue.find(item => item.value === Port)?.key;
    else
      return this.allOriginPortsKeyValue.find(item => item.value === Port)?.key;
  }
  GetAirortPlaceIdByAirportName(isDestinationPorts: boolean, Airport: string) {
    if (isDestinationPorts)
      return this.allDestinationAirportsKeyValue.find(item => item.value === Airport)?.key;
    else
      return this.allOriginAirportsKeyValue.find(item => item.value === Airport)?.key;
  }
  getAirports() {
    this.estimateForm.controls['destinationAirport'].reset();
    this.estimateForm.controls['airportOfOrigin'].reset();

    if (this.estimateForm.value.typeOfActivity.toLowerCase() == this.activityTypeExport.toLowerCase()) {

      if (this.estimateForm.value.modeOfTransport.toLowerCase() == this.TransportModeAir.toLowerCase()) {
        this.getIndianAirports(this.originAirports);
        this.getAirportsExceptIndia(this.destinationPorts);
      }
    }
    else {

      if (this.estimateForm.value.modeOfTransport.toLowerCase() == this.TransportModeAir.toLowerCase()) {
        this.getAirportsExceptIndia(this.originAirports);
        this.getIndianAirports(this.destinationPorts);
      }
    }
  }
  getIndianAirports(isDestinationAirports: boolean) {
    this.typeadhead_service.getIndianAirports().subscribe((res: any) => {
      this.indianAirportsArray = res.message;

      var filteredAirports: string[] = [];
      var filteredAirportsKeyValue: keyValuePairModel[] = [];
      //To convert array value into comma separated 
      this.indianAirportsArray?.forEach(element => {
        filteredAirports.push(element.airportTag + ', ' + element.airportName + ', ' + element.state + ', ' + element.country);
        filteredAirportsKeyValue.push({ key: element.id, value: element.airportTag + ', ' + element.airportName + ', ' + element.state + ', ' + element.country });
      });

      this.allDestinationAirports = isDestinationAirports ? filteredAirports : this.allDestinationAirports;
      this.allOriginAirports = isDestinationAirports ? this.allOriginAirports : filteredAirports;

      this.allDestinationAirportsKeyValue = isDestinationAirports ? filteredAirportsKeyValue : this.allDestinationAirportsKeyValue;
      this.allOriginAirportsKeyValue = isDestinationAirports ? this.allOriginAirportsKeyValue : filteredAirportsKeyValue;

      this.filteredDestinationAirports = this.allDestinationAirports;
      this.filteredOriginAirports = this.allOriginAirports;

      // console.log('isDestinationAirports '+isDestinationAirports);
      // console.log(this.filteredOriginPorts);
      // console.log(this.filteredDestinationPorts);
    });
  }
  getAirportsExceptIndia(isDestinationAirports: boolean) {
    this.typeadhead_service.getAirportsExceptIndia().subscribe((res: any) => {
      this.allAirportsArray = res.message;

      var filteredAirports: string[] = [];
      var filteredAirportsKeyValue: keyValuePairModel[] = [];
      //To convert array value into comma separated 
      this.allAirportsArray?.forEach(element => {
        filteredAirports.push(element.airportTag + ', ' + element.airportName + ', ' + element.state + ', ' + element.country);
        filteredAirportsKeyValue.push({ key: element.id, value: element.airportTag + ', ' + element.airportName + ', ' + element.state + ', ' + element.country });
      });

      this.allDestinationAirports = isDestinationAirports ? filteredAirports : this.allDestinationAirports;
      this.allOriginAirports = isDestinationAirports ? this.allOriginAirports : filteredAirports;

      this.allDestinationAirportsKeyValue = isDestinationAirports ? filteredAirportsKeyValue : this.allDestinationAirportsKeyValue;
      this.allOriginAirportsKeyValue = isDestinationAirports ? this.allOriginAirportsKeyValue : filteredAirportsKeyValue;

      this.filteredDestinationAirports = this.allDestinationAirports;
      this.filteredOriginAirports = this.allOriginAirports;

      // console.log('isDestinationAirports '+isDestinationAirports);
      // console.log(this.filteredOriginPorts);
      // console.log(this.filteredDestinationPorts);
    });
  }
  getFilteredAirports(isDestinationAirports: boolean, enteredstring: string) {
    if (enteredstring == null) {
      return;
    }
    if (isDestinationAirports) {
      this.filteredDestinationAirports = this.allDestinationAirports.filter(item => {
        return item.toLowerCase().indexOf(enteredstring.toLowerCase()) > -1
      });
    }
    else {
      this.filteredOriginAirports = this.allOriginAirports.filter(item => {
        return item.toLowerCase().indexOf(enteredstring.toLowerCase()) > -1
      });
    }
  }
  //End: Port and Airports
  //Being: Cargo details
  PiecesFormGroup(): FormGroup {

    if(localStorage.getItem('hs') == '1') {
      //console.log(localStorage.getItem('inco_terms'));
      this.childC.openhidehs_codediv();

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

  };

  get PicesFormArray() {
    return (this.estimateForm.get('pieces') as FormArray);
  }

  addNewPackage(): void {
    this.rowNumber++;
    var pieces = this.estimateForm.get('pieces') as FormArray;

    this.childC.openhidehs_codediv();
    pieces.push(this.PiecesFormGroup());

    if(localStorage.getItem('hs') == '1') {
      this.removePackage(this.rowNumber);
    }
  }

  removePackage(i: number) {
    var pieces = this.estimateForm.get('pieces') as FormArray;
    pieces.removeAt(i);
  }
  //End: Cargo details
}

