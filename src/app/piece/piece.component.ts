import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {

  constructor() { }

  @Input() pieceForm:any;

  ngOnInit(): void {}

  static makePieceItem(){
    return new FormGroup({
      hsCode: new FormControl('', [Validators.required]),
      noOfPieces: new FormControl(null,[Validators.required]),
      length: new FormControl(null,[Validators.required]),
      breath: new FormControl(null,[Validators.required]),
      height: new FormControl(null,[Validators.required]),
      // inchOrCm: new FormControl('CMs'),
      inchOrCm: new FormControl(),
      grossWeight: new FormControl(null,[Validators.required]),
    })
  }
}
