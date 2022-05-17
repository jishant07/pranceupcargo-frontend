import { FormArray, FormControl, FormGroup, Validators, FormBuilder, ControlContainer } from '@angular/forms';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  constructor(private elRef: ElementRef) { }

  @Input() pieceForm:any;
  @Input() rowNumber: number = 0;

  ngOnInit(): void {}

  static makePieceItem(){
    return new FormGroup({
      cargoType: new FormControl('',[Validators.required]),
      noOfPieces: new FormControl(null,[Validators.required]),
      length: new FormControl(null,[Validators.required]),
      breath: new FormControl(null,[Validators.required]),
      height: new FormControl(null,[Validators.required]),
      // // inchOrCm: new FormControl('CMs'),
      inchOrCm: new FormControl(),
      grossWeight: new FormControl(null,[Validators.required])      
    })
  }
  
  // deleteRow(rowNumber:number){
  //   console.log('Row number is '+rowNumber);
  // }

  deleteRow(event:any){
    const parentElement = this.elRef.nativeElement.closest('.pieces-class');
    console.log(parentElement);
  }
//-------------------------------------------------------------
// //Working approach
// @Input() pieceForm :FormGroup;

// PicesArray: Array<PicesModel> = [];  
// newDynamic: any = {};    

// ngOnInit(): void {  
//   this.pieceForm = new FormGroup({
//     cargoType: new FormControl('',[Validators.required]),
//     noOfPieces: new FormControl(null,[Validators.required]),
//     length: new FormControl(null,[Validators.required]),
//     breath: new FormControl(null,[Validators.required]),
//     height: new FormControl(null,[Validators.required]),
//     inchOrCm: new FormControl(),
//     grossWeight: new FormControl(null,[Validators.required])  
//   });

//   this.addRow();
// }  

// addRow() {    
//   //this.newDynamic = {cargoType: ' ', noOfPieces: '',length: ' ',breath: ' ',height: ' ',inchOrCm: ' ',grossWeight: ' '};  
//   this.newDynamic = new FormGroup({
//     cargoType: new FormControl('',[Validators.required]),
//     noOfPieces: new FormControl(null,[Validators.required]),
//     length: new FormControl(null,[Validators.required]),
//     breath: new FormControl(null,[Validators.required]),
//     height: new FormControl(null,[Validators.required]),
//     inchOrCm: new FormControl(),
//     grossWeight: new FormControl(null,[Validators.required])  
//   });
//   // this.newDynamic.get('cargoType')?.setValue('');
//   // this.newDynamic.get('noOfPieces')?.setValue('');
//   // this.newDynamic.get('length')?.setValue('');
//   // this.newDynamic.get('breath')?.setValue('');
//   // this.newDynamic.get('height')?.setValue('');
//   // this.newDynamic.get('inchOrCm')?.setValue('');
//   // this.newDynamic.get('grossWeight')?.setValue('');

//   this.PicesArray.push(this.newDynamic);
  
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('cargoType')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('noOfPieces')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('length')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('breath')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('height')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('inchOrCm')?.setValue('');
//   // ((this.pieceForm.get('controls') as FormArray).at(index) as FormGroup).get('grossWeight')?.setValue('');
  

//   //this.resetTags(index);

//   return true;  
// } 

// // resetTags(index:number) {
// //   index = index + 1;
// //   debugger
// //   const arr = this.pieceForm.get('controls') as FormArray;
// //   while (index !== arr.length) {
// //     arr.removeAt(index);
// //   }
// // }
  
// deleteRow(index:number) {  
//   if(this.PicesArray.length ==1) { 
//      //when only one row  
//        return false;  
//   } else {  
//     //delete row
//     this.PicesArray.splice(index, 1);          
//     return true;  
//   }  
// }

//------------------------------------------------
  // parentFormGroup: FormGroup;
  // pieceFormFormGroup: FormGroup;

  // constructor(private fb: FormBuilder, private parentControl: ControlContainer) {
  // }

  // ngOnInit(): void {
  //   this.parentFormGroup = this.parentControl.control as FormGroup;
  //   this.pieceFormFormGroup = this.fb.group({
  //     cargoType: new FormControl('',[Validators.required]),
  //     noOfPieces: new FormControl(null,[Validators.required]),
  //     length: new FormControl(null,[Validators.required]),
  //     breath: new FormControl(null,[Validators.required]),
  //     height: new FormControl(null,[Validators.required]),
  //     inchOrCm: new FormControl(),
  //     grossWeight: new FormControl(null,[Validators.required]) 
  //   });
  //   this.parentFormGroup.addControl('pieces', this.pieceFormFormGroup);
  // }


  // public get isValid(): boolean {
  //   return this.addressFormGroup.valid;
  // }

  // public get isDirty(): boolean {
  //   return this.addressFormGroup.dirty;
  // }
//------------------------------------------------

// @Input() parentFormGroup: FormGroup;

// constructor(private fb: FormBuilder) { }

//   ngOnInit(): void {
//     this.parentFormGroup.addControl('pieces', this.fb.group({
//       cargoType: new FormControl('',[Validators.required]),
//       noOfPieces: new FormControl(null,[Validators.required]),
//       length: new FormControl(null,[Validators.required]),
//       breath: new FormControl(null,[Validators.required]),
//       height: new FormControl(null,[Validators.required]),
//       inchOrCm: new FormControl(),
//       grossWeight: new FormControl(null,[Validators.required]) 
//     }));
//   }
// public get isValid(): boolean {
//   return this.parentFormGroup.controls.pieces.valid;
// }

// public get isDirty(): boolean {
//   return this.parentFormGroup.controls.pieces.dirty;
// }
  
}

export class PicesModel{     
  cargoType:string;  
  noOfPieces:number;  
  length:number;  
  breath:number;  
  height:number;  
  inchOrCm:string; 
  grossWeight:number;     
} 
