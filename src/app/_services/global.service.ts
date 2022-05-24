import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(private afAuth:AngularFireAuth, private _snackBar:MatSnackBar, private router: Router) { }
  
  email:any;
  password:any;

  public modeOfTransport: any[] = ["AIR", "SEA"]
  public typeOfActivity: any[] = ["Export", "Import"] 
  public incoTerms: any[] = [
    {id:"EXW", data:"Ex Works (insert place of delivery)"},
    {id:"FCA", data:"Free Carrier (Insert named place of delivery)"},
    {id:"CPT", data:"Carriage Paid to (insert place of destination)"},
    {id:"CIP", data:"Carriage and Insurance Paid To (insert place of destination)"},
    {id:"DAP", data:"Delivered at Place (insert named place of destination)"},
    {id:"DPU", data:"Delivered at Place Unloaded (insert of place of destination)"},
    {id:"DDP", data:"Delivered Duty Paid (Insert place of destination)."},
    {id:"DDU", data:"Delivered Duty Unpaid (Insert place of destination)."}, //Added
    {id:"FAS", data:"Free Alongside Ship (insert name of port of loading)"},
    {id:"FOB", data:"Free on Board (insert named port of loading)"},
    {id:"CFR", data:"Cost and Freight (insert named port of destination)"},
    {id:"CIF", data:"Cost Insurance and Freight (insert named port of destination)"}
  ]
  public deliveryTypes:any = ["Express", "Normal"]
  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  openSnackBar(message:string){
    this._snackBar.open(message,"OK",{
      duration:5000,
      horizontalPosition:"center",
      verticalPosition:"bottom"
    })
  }

  checksignedin() {
    if (this.router.url == "/") {
      this.email = localStorage.getItem('email');
      this.password = localStorage.getItem('password');

      if(this.email) {
        this.signIn(this.email,this.password).then((user:any) =>{
          localStorage.setItem("token",user.user.multiFactor.user.accessToken);
          this.openSnackBar("Signin Successful");
          this.router.navigate(["/dashboard"])
        }).catch(err =>{
          console.log(err);
          this.openSnackBar(err.message);
        })
      }  
    }
  }

  signIn(email:string,password:string){
    return this.afAuth.signInWithEmailAndPassword(email,password);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
