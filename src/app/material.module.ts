import { Injectable, NgModule } from "@angular/core";

/* Angular Material Components */
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
    imports:[        
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
    ],
    exports:[          
    MatAutocompleteModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
    ]
})
export class MaterialModule{}