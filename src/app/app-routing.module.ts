import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { RelativesComponent } from './components/relatives/relatives.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { IncomesComponent } from './components/incomes/incomes.component';
import { FixedExpensesComponent } from './components/fixed.expenses/fixed.expenses.component';
import { VariableExpensesComponent } from './components/variable-expenses/variable-expenses.component';
import { RealEstateComponent } from './components/real-estate/real-estate.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { FinancialAssetsComponent } from './components/financial-assets/financial-assets.component';
import { CommitmentsComponent } from './components/commitments/commitments.component';
import { SavingComponent } from './components/saving/saving.component';
import { GptApiComponent } from './components/gpt-api/gpt-api.component';
import { MortgageComponent } from './components/mortgage/mortgage.component';
import { LifeInsuranceComponent } from './components/life-insurance/life-insurance.component';
import { LongTermCareInsuranceComponent } from './components/long-term-care-insurance/long-term-care-insurance.component';
import { HealthInsuranceComponent } from './components/health-insurance/health-insurance.component';
import { PensionComponent } from './components/pension/pension.component';
import { Pension2Component } from './components/pension/pension2.component';
import { PensionJointComponent } from './components/pension/pension-joint.component';
import { CalculatedDataComponent } from './components/calculated-data/calculated-data.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { EconomicalStabilityComponent } from './components/economical-stability/economical-stability.component';
import { RepetitiveGoalsComponent } from './components/repetitive-goals/repetitive-goals.component';
import { IncomeGoalsComponent } from './components/income-goals/income-goals.component';
import { OneOffFamilyGoalsComponent } from './components/one-off-family-goals/one-off-family-goals.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LossOfWorkingCapacityComponent } from './components/loss-of-working-capacity/loss-of-working-capacity.component';
import { CurrentFlowComponent } from './components/current-flow/current-flow.component';
import { NumerologyComponent } from './components/numerology/numerology.component';
import { SalaryCalculatorComponent } from './components/salary-calculator/salary-calculator.component';
import { NotesInsightsComponent } from './components/notes-insights/notes-insights.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
  {
    path: "", redirectTo: "/Login", pathMatch: "full"
  }
  ,
  {
    path: "Login",
    component: LoginComponent
  },
  {
    path: "PersonalData",
    component: PersonalDataComponent
  },
  {
    path: "Relatives",
    component: RelativesComponent
  },
  {
    path: "Incomes",
    component: IncomesComponent
  },
  {
    path: "FixedExpenses",
    component: FixedExpensesComponent
  }
  ,
  {
    path: "VariableExpenses",
    component: VariableExpensesComponent
  }
  ,
  {
    path: "CurrentFlow",
    component: CurrentFlowComponent
  }
  ,
  {
    path: "CalculatedData",
    component: CalculatedDataComponent
  }
  ,
  {
    path: "RealEstate",
    component: RealEstateComponent
  },
  {
    path: "Vehicles",
    component: VehiclesComponent
  }
  ,
  {
    path: "FinancialAssets",
    component: FinancialAssetsComponent
  }
  ,
  {
    path: "Commitments",
    component: CommitmentsComponent
  }
  ,
  {
    path: "Saving",
    component: SavingComponent
  }
  ,
  {
    path: "GptApi",
    component: GptApiComponent
  }
  ,
  {
    path: "Mortgage",
    component: MortgageComponent
  }
  ,
  {
    path: "LifeInsurance",
    component: LifeInsuranceComponent
  }
  ,
  {
    path: "LossOfWorkingCapacity",
    component: LossOfWorkingCapacityComponent
  }
  ,
  {
    path: "LongTermCareInsurance",
    component: LongTermCareInsuranceComponent
  }
  ,
  {
    path: "HealthInsurance",
    component: HealthInsuranceComponent
  }
  ,
  {
    path: "Pension",
    component: PensionComponent
  }
  ,
  {
    path: "Pension2",
    component: Pension2Component
  }
  ,
  {
    path: "PensionJoint",
    component: PensionJointComponent
  },
  {
    path: "EconomicalStability",
    component: EconomicalStabilityComponent
  }
  ,
  {
    path: "UsersList",
    component: UsersListComponent
  }
  ,
  {
    path: "RepetitiveGoals",
    component: RepetitiveGoalsComponent
  }
  ,
  {
    path: "IncomeGoals",
    component: IncomeGoalsComponent
  }
  ,
  {
    path: "OneOffFamilyGoals",
    component: OneOffFamilyGoalsComponent
  }
  ,
  {
    path: "NotesInsights",
    component: NotesInsightsComponent
  }
  ,
  {
    path: "Profile",
    component: ProfileComponent
  } ,
  {
    path: "Nomerology",
    component: NumerologyComponent
  } ,
  {
    path: "SalaryCalculator",
    component: SalaryCalculatorComponent
  } ,
  {
    path: "**",
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
