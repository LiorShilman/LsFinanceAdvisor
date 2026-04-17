
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  /*  GetMessage() {
     return this.http.get(
       'api/message');
   } */

  SendCurrProjectToServer(jsonProject: string) {
    //console.log("SendCurrProjectToServer");
    const url = 'api/saveProject'; // Replace with the appropriate URL
    const project = jsonProject; // Convert the object to JSON string
    const body = { project: project }; // Update the body object with role and prompt keys
    return this.http.post(url, body);
  }

  DeleteByUserID(id: number) {
    const url = `api/removeUser/${id}`; // Replace with the appropriate URL
    return this.http.delete(url);
  }

  GetAllUsers() {
    //console.log("GetAllUsers");
    const url = 'api/getAllUsers'; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetFinanceAdvisorByUser(id: number) {
    const url = `api/getFinanceAdvisorByUser/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetPersonalDataByUser(id: number) {
    const url = `api/getPersonalDataByUser/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetChildrenByPersonID(id: number) {
    const url = `api/getChildrenByPersonID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetRelativesByParentsID(id1: number, id2: number) {
    const url = `api/getRelativesByParentsID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetIncomesByPersonID(id1: number, id2: number) {
    const url = `api/getIncomesByPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetIncomesExByPersonID(id: number) {
    const url = `api/getIncomesExByPersonID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetFixedExpensesByUserID(id: number) {
    const url = `api/getFixedExpensesByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetSavingByUserID(id: number) {
    const url = `api/getSavingByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetRealEstatesByUserID(id: number) {
    const url = `api/getRealEstatesByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetVehiclesByUserID(id: number) {
    const url = `api/getVehiclesByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetFinanceLiquidityAssetByUserID(id: number) {
    const url = `api/getFinanceLiquidityAssetByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetFinanceUnliquidityAssetByUserID(id: number) {
    const url = `api/getFinanceUnliquidityAssetByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetCommitmentsByUserID(id: number) {
    const url = `api/getCommitmentsByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetCurrentFlowByUserID(id: number) {
    const url = `api/getCurrentFlowByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }


  GetMortgagesByUserID(id: number) {
    const url = `api/getMortgagesByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetLifeInsuranceByPersonID(id1: number, id2: number) {
    const url = `api/getLifeInsuranceByPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetOldPensionFundPersonID(id1: number, id2: number) {
    const url = `api/getOldPensionFundPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetPensionJointUserID(id: number) {
    const url = `api/getPensionJointUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetPensionFundPersonID(id1: number, id2: number) {
    const url = `api/getPensionFundPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetGemelPersonID(id1: number, id2: number) {
    const url = `api/getGemelPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetSocialSecurityBenefitsPersonID(id1: number, id2: number) {
    const url = `api/getSocialSecurityBenefitsPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetManagerInsurancePersonID(id1: number, id2: number) {
    const url = `api/getManagerInsurancePersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetLossOfWorkingCapacityPersonID(id1: number, id2: number) {
    const url = `api/getLossOfWorkingCapacityPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }


  GetVariableExpensesByUserID(id: number) {
    const url = `api/getVariableExpensesByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetLifeLongCareInsurancesInHealthByPersonID(id1: number, id2: number) {
    const url = `api/getLifeLongCareInsurancesInHealthByPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetLifeLongCareInsurancesInInsuranceCompanyByPersonID(id1: number, id2: number) {
    const url = `api/getLifeLongCareInsurancesInInsuranceCompanyByPersonID/${id1}/${id2}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID(id: number) {
    const url = `api/getLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetHealthInsuranceByUserID(id: number) {
    const url = `api/getHealthInsuranceByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetRepetitiveGoalsByUserID(id: number) {
    const url = `api/getRepetitiveGoalsByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetEconomicalStabilityByUserID(id: number) {
    const url = `api/getEconomicalStabilityByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetIncomesGoalByUserID(id: number) {
    const url = `api/getIncomesGoalByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  GetOneOffFamilyGoalByUserID(id: number) {
    const url = `api/getOneOffFamilyGoalByUserID/${id}`; // Replace with the appropriate URL
    return this.http.get(url);
  }

  

}