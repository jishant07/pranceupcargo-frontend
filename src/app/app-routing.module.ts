import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_services/auth.guard';
import { DashboardContentComponent } from './dashboard/dashboard-content/dashboard-content.component';
import { OrdersComponent } from './orders/orders.component';
import { OngoingOrdersComponent } from './orders/ongoing-orders/ongoing-orders.component';
import { QuotationComponent } from './quotation/quotation.component';
import { OnholdQuotationComponent } from './quotation/onhold-quotation/onhold-quotation.component';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ServicesComponent } from './services/services.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PlaceOrderComponent } from './orders/place-order/place-order.component';
 
const routes: Routes = [
  //Web
  { path:"", component:HomeComponent, children:[
    {path:'', component: HomeContentComponent}] },
  { path:"contactus", component:HomeComponent, children:[
      {path:'', component: ContactusComponent}] },
  { path:"services", component:HomeComponent, children:[
      {path:'', component: ServicesComponent}] },
      
  //Client dashbaord
  { path:"login", component:LoginComponent },
  { path:"signup", component:SignupComponent },
  // { path:"dashboard",component:DashboardComponent,canActivate:[AuthGuard] }
  { path:"dashboard",component:DashboardComponent,canActivate:[AuthGuard] , children:[
    {path:'', component: DashboardContentComponent}]},
  { path:"completedorders",component:DashboardComponent , children:[
    {path:'', component: OrdersComponent}]},
  { path:"ongoingorders",component:DashboardComponent , children:[
    {path:'', component: OngoingOrdersComponent}]},
  { path:"quotation",component:DashboardComponent , children:[
    {path:'', component: QuotationComponent}]},
  { path:"onholdquotation",component:DashboardComponent , children:[
    {path:'', component: OnholdQuotationComponent}]},
  { path:"placeorder",component:DashboardComponent , children:[
    {path:'', component: PlaceOrderComponent}]},
  { path:"placeorder/:orderId",component:DashboardComponent , children:[
      {path:'', component: PlaceOrderComponent}]},
    
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
