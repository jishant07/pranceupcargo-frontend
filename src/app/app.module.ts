/* Angular Components/Modules */
import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

/* Angular Material Components */
import { MaterialModule } from './material.module';

/* Self Made Components */
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EstimateComponent } from './estimate/estimate.component';
import { FooterComponent } from './footer/footer.component';
import { AuthGuard } from './_services/auth.guard';
import { InterceptorService } from './_services/loader/interceptor.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PieceComponent } from './piece/piece.component';
import { DashboardContentComponent } from './dashboard/dashboard-content/dashboard-content.component';
import { OrdersComponent } from './orders/orders.component';
import { OngoingOrdersComponent } from './orders/ongoing-orders/ongoing-orders.component';
import { QuotationComponent } from './quotation/quotation.component';
import { OnholdQuotationComponent } from './quotation/onhold-quotation/onhold-quotation.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { ServicesComponent } from './services/services.component';
import { BlogAreaComponent } from './home/blog-area/blog-area.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    EstimateComponent,
    FooterComponent,
    DashboardComponent,
    PieceComponent,
    DashboardContentComponent,
    OrdersComponent,
    OngoingOrdersComponent,
    QuotationComponent,
    OnholdQuotationComponent,
    ContactusComponent,
    HomeContentComponent,
    ServicesComponent,
    BlogAreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [AuthGuard,{
    provide:HTTP_INTERCEPTORS,
    useClass:InterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
