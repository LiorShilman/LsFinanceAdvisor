import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { CoreModule } from './services/core/core.module';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { RelativesComponent } from './components/relatives/relatives.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RelativeComponent } from './components/relative/relative.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumbersOnlyDirective } from './directives/number-only.directive';
import { VariableExpensesComponent } from './components/variable-expenses/variable-expenses.component';
import { RealEstateComponent } from './components/real-estate/real-estate.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { CommitmentsComponent } from './components/commitments/commitments.component';
import { SavingComponent } from './components/saving/saving.component';
import { HttpClientModule } from '@angular/common/http';
import { LifeInsuranceComponent } from './components/life-insurance/life-insurance.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LongTermCareInsuranceComponent } from './components/long-term-care-insurance/long-term-care-insurance.component';
import { HealthInsuranceComponent } from './components/health-insurance/health-insurance.component';
import { Pension2Component } from './components/pension/pension2.component';
import { PensionJointComponent } from './components/pension/pension-joint.component';
import { CalculatedDataComponent } from './components/calculated-data/calculated-data.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { EconomicalStabilityComponent } from './components/economical-stability/economical-stability.component';
import { RepetitiveGoalsComponent } from './components/repetitive-goals/repetitive-goals.component';
import { IncomeGoalsComponent } from './components/income-goals/income-goals.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LossOfWorkingCapacityComponent } from './components/loss-of-working-capacity/loss-of-working-capacity.component';
import { CurrentFlowComponent } from './components/current-flow/current-flow.component';
import { NumerologyComponent } from './components/numerology/numerology.component';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Corrected import
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    PersonalDataComponent,
    RelativesComponent,
    NotFoundComponent,
    RelativeComponent,
    NumbersOnlyDirective,
    VariableExpensesComponent,
    RealEstateComponent,
    VehiclesComponent,
    CommitmentsComponent,
    SavingComponent,  
    LifeInsuranceComponent,
    LongTermCareInsuranceComponent,
    HealthInsuranceComponent,
    Pension2Component,
    PensionJointComponent,
    CalculatedDataComponent,
    UsersListComponent,
    EconomicalStabilityComponent,
    RepetitiveGoalsComponent,
    IncomeGoalsComponent,
    ProfileComponent,
    LossOfWorkingCapacityComponent,
    CurrentFlowComponent,
    NumerologyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    HighchartsChartModule,
    AngularFirestoreModule, // Corrected usage
    AngularFireDatabaseModule,
   AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 