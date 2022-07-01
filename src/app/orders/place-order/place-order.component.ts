import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PieceComponent } from 'src/app/piece/piece.component';
import { AirportModel, keyValuePairModel, PortsModel } from 'src/app/_models/model';
import { GlobalService } from 'src/app/_services/global.service';
import { OrderService } from 'src/app/_services/order.service';
import { QuoteService } from 'src/app/_services/quote.service';
import { TypeaheadService } from 'src/app/_services/typeahead.service';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

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
    //, private quoteService: QuoteService
    , private router: Router
    , private orderServie: OrderService) {
  }

  orderForm = this.fb.group({
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

    //Upload documents
    hblFile: new FormControl('', [Validators.required]),
    packingListFile: new FormControl('', [Validators.required]),
    invoiceFile: new FormControl('', [Validators.required]),
    freightCertificateFile: new FormControl(''), // only required when inco term is 'exw' or 'fca'

    hblFileSource: new FormControl('', [Validators.required]),
    packingListFileSource: new FormControl('', [Validators.required]),
    invoiceFileSource: new FormControl('', [Validators.required]),
    freightCertificateFileSource: new FormControl(''), // only required when inco term is 'exw' or 'fca'

  });
  ngOnInit(): void {
    this.incoTerm_removeAllValidation();
    this.autoComplete();
  }
  activityChanged(event: any) {
    this.getPorts();
    this.getAirports();
    this.isActivityTypeSelected = true;
    if (event.value == this.activityTypeExport) {
      this.isExport = true;
      this.orderForm.get('countryOfOrigin')?.removeValidators(Validators.required);
      this.orderForm.get('countryOfOriginId')?.removeValidators(Validators.required);
      this.orderForm.get('countryOfOrigin')?.reset();
      this.orderForm.get('countryOfOriginId')?.reset();
      this.orderForm.get('destCountry')?.addValidators(Validators.required)
      this.orderForm.get('destCountryId')?.addValidators(Validators.required)
      if (this.orderForm.value.modeOfTransport == 'SEA') {
        this.orderForm.get('destinationAirport')?.removeValidators(Validators.required)
        this.orderForm.get('destinationAirport')?.reset();
        this.orderForm.get('destinationPort')?.addValidators(Validators.required)
      } else {
        this.orderForm.get('destinationPort')?.removeValidators(Validators.required)
        this.orderForm.get('destinationPort')?.reset();
        this.orderForm.get('destinationAirport')?.addValidators(Validators.required)
      }
      this.orderForm.updateValueAndValidity();
    } else {
      this.isExport = false;
      this.orderForm.get('destCountry')?.removeValidators(Validators.required);
      this.orderForm.get('destCountryId')?.removeValidators(Validators.required)
      this.orderForm.get('destCountry')?.reset();
      this.orderForm.get('destCountryId')?.reset();
      this.orderForm.get('countryOfOrigin')?.addValidators(Validators.required)
      this.orderForm.get('countryOfOriginId')?.addValidators(Validators.required)
      if (this.orderForm.value.modeOfTransport == 'SEA') {
        this.orderForm.get('airportOfOrigin')?.removeValidators(Validators.required)
        this.orderForm.get('airportOfOrigin')?.reset();
        this.orderForm.get('portOfOrigin')?.addValidators(Validators.required)
      } else {
        this.orderForm.get('portOfOrigin')?.removeValidators(Validators.required)
        this.orderForm.get('portOfOrigin')?.reset();
        this.orderForm.get('airportOfOrigin')?.addValidators(Validators.required)
      }
      this.orderForm.updateValueAndValidity();
    }
  }
  get pieceArray() {
    return this.orderForm.get('pieces') as FormArray;
  }
  destCountryTypeAhead() {
    let term = this.orderForm.value.destCountry
    term = term.toLowerCase();
    this.destCountryList = this.countryList.filter(function (item: any) {
      return item.countryName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }
  countryOfOriginTypeahead() {
    let term = this.orderForm.value.countryOfOrigin
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
    this.orderForm.patchValue({
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
    this.orderForm.patchValue({
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
    let term = this.orderForm.value.destinationAirport
    term = term.toLowerCase();
    this.destFilterAirportsList = this.destAirportsList.filter(function (item: any) {
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }
  destPortTypeAhead() {
    let term = this.orderForm.value.destinationPort
    term = term.toLowerCase();
    this.destFilterPortsList = this.destPortsList.filter(function (item: any) {
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }
  countryOfOriginAirportTypeahead() {
    let term = this.orderForm.value.airportOfOrigin
    term = term.toLowerCase();
    this.countryOfOriginFilterAirportsList = this.countryOfOriginAirportsList.filter((item: any) => {
      return item.airportName.toLowerCase().indexOf(term) == -1 ? false : true
    })
  }
  countryOfOriginPortTypeahead() {
    let term = this.orderForm.value.portOfOrigin
    term = term.toLowerCase();
    this.countryOforiginFilterPortsList = this.countryOforiginFilterPortsList.filter((item: any) => {
      return item.portName.toLowerCase().indexOf(term) == -1 ? false : true;
    })
  }
  placeOrderSubmit() {
    if(!this.orderForm.valid){
      return;
    }
    let formData: any = {};
    if (this.orderForm.value.modeOfTransport == 'AIR') {
      this.calculateChargableWeight("AIR");
      Object.keys(this.orderForm.value).forEach(key => {
        if (this.orderForm.value[key] != "" && this.orderForm.value[key] != null) {

          if (key == 'portOfOrigin' || key == 'destinationPort') {
            //Do not add portOfOrigin & destinationPort if transport mode is Air
          }
          else if (key == 'airportOfOrigin') {
            formData[key] = this.GetAirortPlaceIdByAirportName(this.originPorts, this.orderForm.value[key]); 
            console.log('origin airport ='+ this.orderForm.value[key]);           
          }
          else if (key == 'destinationAirport') {
            formData[key] = this.GetAirortPlaceIdByAirportName(this.destinationPorts, this.orderForm.value[key]);
            console.log('dest. airport ='+ this.orderForm.value[key]); 
          }
          else {
            formData[key] = this.orderForm.value[key];
          }
        }
      });
    } else {
      this.calculateChargableWeight("SEA")
      Object.keys(this.orderForm.value).forEach(key => {
        if (this.orderForm.value[key] != "" && this.orderForm.value[key] != null) {

          if (key == 'airportOfOrigin' || key == 'destinationAirport') {
            //Do not add airportOfOrigin & destinationAirport if transport mode is Sea
          }
          else if (key == 'portOfOrigin') {
            formData[key] = this.GetPortPlaceIdByPortName(this.originPorts, this.orderForm.value[key]);
            //console.log('origin port ='+ this.orderForm.value[key]);
          }
          else if (key == 'destinationPort') {
            formData[key] = this.GetPortPlaceIdByPortName(this.destinationPorts, this.orderForm.value[key]);
            //console.log('Dest. port ='+ this.orderForm.value[key]);
          }
          else {
            formData[key] = this.orderForm.value[key];
          }

        }
      });

    }
    //console.log(this.orderForm);    
    formData["sentFrom"] = "USER";
    console.log(formData); //Final object for api

    this.orderServie.placeOrder(formData).subscribe((res:any)=>{
      console.log('PlaceOrder result');
      console.log(res);
    });

    // console.log('hbl file source')
    // console.log(this.orderForm.get('hblFileSource')?.value);

    const oFormData = new FormData();
    // oFormData.append('deliveryType', formData['deliveryType']?.value);
    // oFormData.append('destinationPort', formData['destinationPort']?.value);
    // oFormData.append('freightCertificateFileSource', formData['freightCertificateFileSource']?.value);
    // oFormData.append('hblFileSource', formData['hblFileSource']?.value);
    // oFormData.append('incoTerms', formData['incoTerms']?.value);
    // oFormData.append('invoiceFileSource', formData['invoiceFileSource']?.value);
    // oFormData.append('modeOfTransport', formData['modeOfTransport']?.value);
    // oFormData.append('packingListFileSource', formData['packingListFileSource']?.value);
    // oFormData.append('pieces', formData['pieces']?.value);
    // oFormData.append('portOfOrigin', formData['portOfOrigin']?.value);
    // oFormData.append('sentFrom', formData['sentFrom']?.value);
    // oFormData.append('typeOfActivity', formData['typeOfActivity']?.value);
    
    // oFormData.append('pickUpAddress', formData['pickUpAddress']?.value);
    // oFormData.append('spocName', formData['spocName']?.value);
    // oFormData.append('spocPhone', formData['spocPhone']?.value);

    oFormData.append('hblFileSource', formData['hblFileSource']);
    oFormData.append('incoTerms', formData['incoTerms']);
    oFormData.append('invoiceFileSource', formData['invoiceFileSource']);

    console.log('final data for test api');
    console.log(oFormData);
    this.orderServie.placeOrder(oFormData).subscribe((res:any)=>{
      console.log('PlaceOrder result');
      console.log(res);
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
    var selectedIncoTearm = this.orderForm.value.incoTerms.toLowerCase();
    localStorage.setItem('inco_terms', selectedIncoTearm);
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
      this.orderForm.get('pickUpAddress')?.addValidators(Validators.required);
      this.orderForm.get('spocName')?.addValidators(Validators.required);
      this.orderForm.get('spocPhone')?.addValidators(Validators.required);
      this.orderForm.get('freightCertificateFile')?.addValidators(Validators.required);
      //this.orderForm.get('freightCertificateFileSource')?.addValidators(Validators.required);
    }
    else {
      // this.orderForm.get('pickUpAddress')?.removeValidators(Validators.required);
      // this.orderForm.get('spocName')?.removeValidators(Validators.required);
      // this.orderForm.get('spocPhone')?.removeValidators(Validators.required);

      this.orderForm.get('pickUpAddress')?.clearValidators();
      this.orderForm.get('spocName')?.clearValidators();
      this.orderForm.get('spocPhone')?.clearValidators();
      this.orderForm.get('freightCertificateFile')?.clearValidators();
      //this.orderForm.get('freightCertificateFileSource')?.clearValidators();

      this.orderForm.get('pickUpAddress')?.setValue('');
      this.orderForm.get('spocName')?.setValue('');
      this.orderForm.get('spocPhone')?.setValue('');
      this.orderForm.get('freightCertificateFile')?.setValue('');
      //this.orderForm.get('freightCertificateFileSource')?.setValue('');
    }
    this.orderForm.updateValueAndValidity();
  }
  incoTerm_fca_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.orderForm.get('shipperAddress')?.addValidators(Validators.required);
      this.orderForm.get('fcaLocation')?.addValidators(Validators.required);
      this.orderForm.get('freightCertificateFile')?.addValidators(Validators.required);
      //this.orderForm.get('freightCertificateFileSource')?.addValidators(Validators.required);
    }
    else {
      // this.orderForm.get('shipperAddress')?.removeValidators(Validators.required);
      // this.orderForm.get('fcaLocation')?.removeValidators(Validators.required);

      this.orderForm.get('shipperAddress')?.clearValidators();
      this.orderForm.get('fcaLocation')?.clearValidators();
      this.orderForm.get('freightCertificateFile')?.clearValidators();
      //this.orderForm.get('freightCertificateFileSource')?.clearValidators();

      this.orderForm.get('shipperAddress')?.setValue('');
      this.orderForm.get('fcaLocation')?.setValue('');
      this.orderForm.get('freightCertificateFile')?.setValue('');
      //this.orderForm.get('freightCertificateFileSource')?.setValue('');
    }
    this.orderForm.updateValueAndValidity();
  }
  incoTerm_dap_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.orderForm.get('dapdduAddress')?.addValidators(Validators.required);
    }
    else {
      //this.orderForm.get('dapdduAddress')?.removeValidators(Validators.required);      
      this.orderForm.get('dapdduAddress')?.clearValidators();

      this.orderForm.get('dapdduAddress')?.setValue('');
    }
    this.orderForm.updateValueAndValidity();
  }
  incoTerm_ddp_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.orderForm.get('ddpdduAddress')?.addValidators(Validators.required);
      //this.orderForm.get('hscode')?.addValidators(Validators.required);
      this.orderForm.get('invoiceValue')?.addValidators(Validators.required);
    }
    else {
      // this.orderForm.get('ddpdduAddress')?.removeValidators(Validators.required);
      // this.orderForm.get('hscode')?.removeValidators(Validators.required);
      // this.orderForm.get('invoiceValue')?.removeValidators(Validators.required);

      this.orderForm.get('ddpdduAddress')?.clearValidators();
      //this.orderForm.get('hscode')?.clearValidators();
      this.orderForm.get('spocPhone')?.clearValidators();

      this.orderForm.get('ddpdduAddress')?.setValue('');
      //this.orderForm.get('hscode')?.setValue('');
      this.orderForm.get('invoiceValue')?.setValue('');
    }
    this.orderForm.updateValueAndValidity();
  }
  incoTerm_ddu_Validation(addOrRemove: string) {
    addOrRemove = addOrRemove.toLowerCase();
    if (addOrRemove == 'add') {
      this.orderForm.get('dduAddress')?.addValidators(Validators.required);
      //this.orderForm.get('dduHscode')?.addValidators(Validators.required);
      this.orderForm.get('dduInvoiceValue')?.addValidators(Validators.required);
    }
    else {
      this.orderForm.get('dduAddress')?.clearValidators();
      //this.orderForm.get('dduHscode')?.clearValidators();
      this.orderForm.get('spocPhone')?.clearValidators();

      this.orderForm.get('dduAddress')?.setValue('');
      //this.orderForm.get('dduHscode')?.setValue('');
      this.orderForm.get('dduInvoiceValue')?.setValue('');
    }
    this.orderForm.updateValueAndValidity();
  }
  incoTermsExWorksFormControls() {
    this.orderForm = new FormGroup({
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
    this.orderForm.get('portOfOrigin')?.valueChanges.subscribe(value => {
      this.getFilteredPorts(this.originPorts, value);
    });
    this.orderForm.get('destinationPort')?.valueChanges.subscribe(value => {
      this.getFilteredPorts(this.destinationPorts, value);
    });
    //Airport
    this.orderForm.get('airportOfOrigin')?.valueChanges.subscribe(value => {
      this.getFilteredAirports(this.originPorts, value);
    });
    this.orderForm.get('destinationAirport')?.valueChanges.subscribe(value => {
      this.getFilteredAirports(this.destinationPorts, value);
    });
  }
  getPorts() {
    this.orderForm.controls['destinationPort'].reset();
    this.orderForm.controls['portOfOrigin'].reset();

    if (this.orderForm.value.typeOfActivity.toLowerCase() == this.activityTypeExport.toLowerCase()) {

      if (this.orderForm.value.modeOfTransport.toLowerCase() == this.TransportModeSea.toLowerCase()) {
        this.getIndianPorts(this.originPorts);
        this.getPortsExceptIndia(this.destinationPorts);
      }
    }
    else {

      if (this.orderForm.value.modeOfTransport.toLowerCase() == this.TransportModeSea.toLowerCase()) {
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
    this.orderForm.controls['destinationAirport'].reset();
    this.orderForm.controls['airportOfOrigin'].reset();

    if (this.orderForm.value.typeOfActivity.toLowerCase() == this.activityTypeExport.toLowerCase()) {

      if (this.orderForm.value.modeOfTransport.toLowerCase() == this.TransportModeAir.toLowerCase()) {
        this.getIndianAirports(this.originAirports);
        this.getAirportsExceptIndia(this.destinationPorts);
      }
    }
    else {

      if (this.orderForm.value.modeOfTransport.toLowerCase() == this.TransportModeAir.toLowerCase()) {
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

    if(localStorage.getItem('inco_terms') == 'ddp' || localStorage.getItem('inco_terms') == 'dpu') {
      console.log(localStorage.getItem('inco_terms'));
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
    return (this.orderForm.get('pieces') as FormArray);
  }
  addNewPackage(): void {
    this.rowNumber++;
    var pieces = this.orderForm.get('pieces') as FormArray;

    this.childC.openhidehs_codediv();
    pieces.push(this.PiecesFormGroup());

    if(localStorage.getItem('inco_terms') == 'ddp' || localStorage.getItem('inco_terms') == 'ddu') {
      this.removePackage(this.rowNumber);
    }
  }
  removePackage(i: number) {
      var pieces = this.orderForm.get('pieces') as FormArray;
      var pieceCount = (pieces.value as FormArray).length;
      if(pieceCount>1){
        pieces.removeAt(i+1);
      }
  }
  //End: Cargo details

  //Begin: File Upload
currentFile:File;
fileName:string;

onFileSelected(event:any,fileSelectedFor:string):void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
    //To set file name
    if(fileSelectedFor == 'HBL'){
      this.orderForm.patchValue({
        hblFile: this.fileName,
        hblFileSource: this.currentFile
      }); 
    }
    else if(fileSelectedFor == 'PackingList'){
      this.orderForm.patchValue({
        packingListFile: this.fileName,
        packingListFileSource: this.currentFile
      }); 
    }
    else if(fileSelectedFor == 'Invoice'){
      this.orderForm.patchValue({
        invoiceFile: this.fileName,
        invoiceFileSource: this.currentFile
      }); 
    }
    else if(fileSelectedFor == 'FreightCertificate'){
      this.orderForm.patchValue({
        freightCertificateFile: this.fileName,
        freightCertificateFileSource: this.currentFile
      }); 
    }
  }
  //End: File Upload
}
