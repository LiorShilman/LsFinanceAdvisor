import { Injectable } from '@angular/core';
import { AllInfoObj, ChildObj, CommitmentsRowObj, FinanceAssetRowObj, FixedExpensesRowObj, GemelRowObj, HealthInsuranceRowObj, IncomeExRowObj, IncomeRowObj, IncomesGoalsRowObj, IncomesGoalsRowsObj, LifeInsuranceRow, LifeLongCareInsurancesInHealthFundObj, LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj, LifeLongCareInsurancesInInsuranceCompanyRowObj, ManagerInsuranceRowObj, MortgagesRowObj, NeedOneOffFamilyGoalsRowObj, OldPensionFundRowObj, OneOffFamilyGoalsRowsObj, PensionFundRowObj, PensionJointRowObj, RealEstateRowObj, RepetitiveGoalsRowObj, SavingRowObj, UserRowObj, VariableExpensesRows4Json, VehiclesRowObj, itemsRowObj } from './GeneralTypes/GeneralTypes';
import { Observable, Subject } from 'rxjs';
import { JsonStringsService } from './json-strings.service';
import { ApiService } from './api.service';
import { FinancialReportGenerator } from './financial_report_generator';
//import { RequestInit } from 'node-fetch';
//import { translate } from '@vitalets/google-translate-api';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {
  AfterLogin: boolean;
  WithoutSidebar: boolean;
  AllInfo: AllInfoObj;

  private subUpdateAllInfo = new Subject();

  public subUpdateAllInfoObservable$ = this.subUpdateAllInfo as Observable<string>;

  constructor(private jsonStringsService: JsonStringsService, private apiService: ApiService) {


    this.AllInfo = new AllInfoObj(this);
    this.AfterLogin = false;
    this.WithoutSidebar = true;
    /* this.LoadAllUsersDB().then((result: any) => {
      let financeAdvisor = JSON.parse(result.toString());
      financeAdvisor.Users.forEach((user: any) => {
        const newUser = new UserRowObj();
        newUser.UserID = user.UserID;
        newUser.FirstName = user.FirstName;
        newUser.Mail = user.Mail;
        newUser.Identification = user.ID;
        this.AllInfo.UserListInfo.UsersRows.push(newUser);
      });
    }); */
  }

  onNumberOfChildrenChange(numberOfChildren: number): void {
    if (this.AllInfo.PersonalDataViewInfo.Child.length > numberOfChildren) {
      let child = this.AllInfo.PersonalDataViewInfo.Child.length;
      for (let i = numberOfChildren; i < child; i++) {
        this.AllInfo.PersonalDataViewInfo.Child.pop();
      }
    }
    else {
      for (let i = this.AllInfo.PersonalDataViewInfo.Child.length; i < numberOfChildren; i++) {
        const child = new ChildObj();
        // Set properties of the child object if needed
        this.AllInfo.PersonalDataViewInfo.Child.push(child);
      }
    }
    //this.Child = []; // Clear the Child array before adding new elements
  }

  RemoveElementsWithCondition(json: string, delimiter: string) {
    let jsonArray = JSON.parse(json);
    jsonArray = jsonArray.filter((item: any) => item[delimiter] !== "");
    let jsonStringResult = JSON.stringify(jsonArray);
    return jsonStringResult;
  }

  LoadAllUsersDB() {
    return new Promise((resolve, reject) => {
      var jsonGetAllUsers = "";

      this.apiService.GetAllUsers().subscribe((data: any) => {
        jsonGetAllUsers = data.res;

        let mergedJson = this.jsonStringsService.MergeJsonStrings({
          Users: jsonGetAllUsers,
        });

        /*       let mergedJson2 = this.jsonStringsService.MergeJsonStringsMJ({
                Users: jsonGetAllUsers,
              });
              
              console.log("mergedJson2 - " + mergedJson2); */


        resolve(mergedJson);
      });
    });
    /*    */
    //this.Fill4Test();

  }

  DeleteByUserID(userId: number) {
    return new Promise((resolve, reject) => {
      this.apiService.DeleteByUserID(userId).subscribe((data: any) => {
        resolve("");
      });
    })
  }

  LoadUserInfoByUserID(userId: number, mail: string, identification: string) {

    return new Promise((resolve, reject) => {
      let Person1ID = 0;

      this.AllInfo.PersonalDataViewInfo.Mail = mail;
      this.AllInfo.PersonalDataViewInfo.Id = identification;

      this.LoadAllUserInfoByUserID(userId).then((result: any) => {
        this.AfterLogin = true;
        this.WithoutSidebar = false;

        let financeAdvisor = JSON.parse(result.toString());

        //console.log("financeAdvisor EconomicalStability - " + JSON.stringify(financeAdvisor.EconomicalStability))

        //console.log("financeAdvisor - " + JSON.stringify(this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj))

        financeAdvisor.PersonalData.forEach((person: any) => {
          if (person.IsPrimary) {
            Person1ID = person.Id;
            this.AllInfo.PersonalDataViewInfo.Name1 = person.FirstName;
            this.AllInfo.PersonalDataViewInfo.Age1 = person.Age;
            this.AllInfo.PersonalDataViewInfo.SelectedSex1 = person.Sex;
            this.AllInfo.PersonalDataViewInfo.SelectedStatus1 = person.Status;
            this.AllInfo.PersonalDataViewInfo.RetirementAge1 = person.RetirementAge;
            this.AllInfo.PersonalDataViewInfo.NumberOfChildren1 = person.NumberOfChildren;

            this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.forEach(element => {
              element.AmountInYear = new Array<string>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            });

            this.AllInfo.IncomesGoalsViewInfo.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1);

            let incomeGoalIdx = 0;
            this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows = [];
            financeAdvisor.IncomesGoal.forEach((incomeGoal: any) => {
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.ReturnOnSavings = incomeGoal.ReturnOnSavings;
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].IncomeSrc = incomeGoal.IncomeSource;
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].AmountInYear = new Array<string>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1);
              const elements = incomeGoal.Incomes.split("||");
              // Map each element to create an array of objects
              const arrayOfObjects = elements.map((element: any) => {

                element = element.replace(/\|/g, '');

                // Split each element by '-' to get the two parts
                const parts = element.split('@');
                // Create an object with 'xx' and 'yyyyy' fields
                return {
                  Idx: parts[0],
                  AmountInYear: parts[1]
                };
              });

              arrayOfObjects.forEach((elementAmountInYear: any) => {
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].AmountInYear[elementAmountInYear.Idx] = elementAmountInYear.AmountInYear;
              });
              incomeGoalIdx++;
            });


            if (this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.length == 0)
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj);


            for (let cnt = 0; cnt < this.AllInfo.IncomesGoalsViewInfo.AmountInYear.length; cnt++) {
              this.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] = 0;

              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.forEach((element: any) => {
                this.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] += element.AmountInYear[cnt] != undefined ? parseInt(element.AmountInYear[cnt].toString().replace(',', '')) : 0;
              });
              //console.log(`cnt - ${cnt} - amount - ${this.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt]}`);
            }

            this.AllInfo.IncomesGoalsViewInfo.AlreadyInSavings = "0";



            /*   this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows = [];
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[0].IncomeSrc = "קרן השתלמות - ילין לפידות";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[0].AmountInYear[2] = "50,000";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[0].AmountInYear[8] = "175,000";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[0].AmountInYear[14] = "175,000";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[0].AmountInYear[19] = "175,000";
  
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].IncomeSrc = "קרן דולרית - משיכה";
              for (let i = 0; i < this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear.length; i++)
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear[i] = "10,000";
  
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[2].IncomeSrc = "הפסקת שכר דירה";
              for (let i = 8; i < this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear.length; i++)
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[2].AmountInYear[i] = "48,000";
  
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[3].IncomeSrc = "שליש מזונות עמית";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[3].AmountInYear[1] = "7,200";
              for (let i = 2; i < this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear.length; i++)
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[3].AmountInYear[i] = "22,000";
  
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[4].IncomeSrc = "ה.מזונות עמית + שליש מעין";
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[4].AmountInYear[4] = "14,400";
              for (let i = 5; i < this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear.length; i++)
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[4].AmountInYear[i] = "33,000";
  
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[5].IncomeSrc = "הפסקת מזונות";
              for (let i = 8; i < this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[1].AmountInYear.length; i++)
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[5].AmountInYear[i] = "11,000";
   */



            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows.forEach(element => {
              element.AmountInYear = new Array<string>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            });

            this.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            this.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.Title = "צורך";
            this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[0] = 0;
            for (let index = 0; index < this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear.length; index++) {
              this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.UpdateRow(index);
            }
            this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.Title = "הפקדה לקרנות בתוך השכר";
            this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0] = 0;
            for (let index = 0; index < this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear.length; index++) {
              this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.UpdateRow(index);
            }
            this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Title = "תוספת הפקדה נדרשת להשקעה";
            this.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            this.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.Title = "סה״כ חיסכון חודשי";
            this.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1)
            this.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.Title = "סה״כ חיסכון שנתי";
            this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Title = "מצטבר";
            this.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.Title = "לשים בצד עכשיו - (ומקור הכסף)";
            this.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside = "";
            this.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.Title = "חיסכון קיים לילדים";
            this.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren = "";
            this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.Title = "תשואה מצטברת על השקעה (הערכה)";
            this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment = "";
            this.AllInfo.OneOffFamilyGoalsViewInfo.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow.Title = "סה״כ צורך הון נומינלי לכל היעדים";

            this.AllInfo.OneOffFamilyGoalsViewInfo.AmountInYear = new Array<number>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1);

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].CommonCostSrc = "40,000 - 80,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].Target = "רכב";
            /*             this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].AmountInYear[2] = "50,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].AmountInYear[7] = "50,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].AmountInYear[12] = "50,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].AmountInYear[17] = "50,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[0].AmountInYear[22] = "50,000";
             */
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[1].CommonCostSrc = "10,000 - 20,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[1].Target = "רכב נוסף";

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].CommonCostSrc = "50,000 - 100,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].Target = "לימודים גבוהים, קורסים והשתלמויות";
            /*             this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].AmountInYear[3] = "10,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].AmountInYear[8] = "10,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].AmountInYear[12] = "10,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[2].AmountInYear[17] = "10,000";
             */

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[3].CommonCostSrc = "75,000 - 150,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[3].Target = "שיפוצים וחלומות";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[4].CommonCostSrc = "40,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[4].Target = "חופשות משפחתיות";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[5].CommonCostSrc = "48,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[5].Target = "תינוק/ת בעריסה";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[6].CommonCostSrc = "30,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[6].Target = "בר/ת מצווה";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[7].CommonCostSrc = "12,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[7].Target = "לימודים בחינוך פרטי";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[8].CommonCostSrc = "12,000 / 6000 / 5,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[8].Target = "מסע לפולין , נהיגה , יישור שיניים";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[9].CommonCostSrc = "20,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[9].Target = "שכר לימוד תואר ראשון";


            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[10].CommonCostSrc = "36,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[10].Target = "עזרה במחייה בלימודים";
            /*             this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[10].AmountInYear[6] = "25,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[10].AmountInYear[9] = "25,000";
             */

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[11].CommonCostSrc = "50,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[11].Target = "חתונה";
            /*             this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[11].AmountInYear[11] = "50,000";
                        this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[11].AmountInYear[14] = "50,000";
             */
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[12].CommonCostSrc = "400,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[12].Target = "עזרה להון ראשוני לדירה";

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[13].CommonCostSrc = "כל סכום";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[13].Target = "הלוואת גישור";

            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[14].CommonCostSrc = "5,000 - 10,000";
            this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[14].Target = "משכנתה";


            let oneOffFamilyGoalIdx = 0;
            //console.log(JSON.stringify(financeAdvisor.OneOffFamilyGoals));
            //this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows = [];
            financeAdvisor.OneOffFamilyGoals.forEach((oneOffFamilyGoal: any, idx: number) => {

              if (oneOffFamilyGoal.OneOffFamilyGoal != "") {
                const elements = oneOffFamilyGoal.OneOffFamilyGoal.split("||");

                if (elements.length > 0) {

                }
                // Map each element to create an array of objects
                const arrayOfObjects = elements.map((element: any) => {

                  element = element.replace(/\|/g, '');

                  // Split each element by '-' to get the two parts
                  const parts = element.split('@');
                  // Create an object with 'xx' and 'yyyyy' fields

                  return {
                    Idx: parts[0],
                    Idx2: parts[1],
                    AmountInYear: parts[2]
                  };
                });

                //console.log(arrayOfObjects);

                arrayOfObjects.forEach((elementAmountInYear: any, idx: number) => {
                  //console.log(elementAmountInYear);
                  this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[elementAmountInYear.Idx].AmountInYear[elementAmountInYear.Idx2] = elementAmountInYear.AmountInYear;
                });
              }
              if (oneOffFamilyGoal.DepositFromFundsOneOffFamilyGoal != "") {
                //console.log(oneOffFamilyGoal.DepositFromFundsOneOffFamilyGoal);
                //console.log(oneOffFamilyGoal.CumulativeReturnOnInvestment);
                //console.log(oneOffFamilyGoal.PutAside);
                //console.log(oneOffFamilyGoal.SavingsExistForChildren);
                const elements = oneOffFamilyGoal.DepositFromFundsOneOffFamilyGoal.split("||");
                // Map each element to create an array of objects
                const arrayOfObjects = elements.map((element: any) => {

                  element = element.replace(/\|/g, '');

                  // Split each element by '-' to get the two parts
                  const parts = element.split('@');
                  // Create an object with 'xx' and 'yyyyy' fields

                  return {
                    Idx: parts[0],
                    AmountInYear: parts[1]
                  };
                });

                arrayOfObjects.forEach((elementAmountInYear: any, idx: number) => {
                  this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment = oneOffFamilyGoal.CumulativeReturnOnInvestment;
                  this.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside = oneOffFamilyGoal.PutAside;
                  this.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren = oneOffFamilyGoal.SavingsExistForChildren;
                  this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[elementAmountInYear.idx] = elementAmountInYear.AmountInYear;
                });
              }

              if (oneOffFamilyGoal.AdditionalDepositOneOffFamilyGoalsRow != "" && oneOffFamilyGoal.AdditionalDepositOneOffFamilyGoalsRow != undefined) {
                //console.log(oneOffFamilyGoal.AdditionalDepositOneOffFamilyGoalsRow);
                //console.log(oneOffFamilyGoal.CumulativeReturnOnInvestment);
                //console.log(oneOffFamilyGoal.PutAside);
                //console.log(oneOffFamilyGoal.SavingsExistForChildren);
                const elements = oneOffFamilyGoal.AdditionalDepositOneOffFamilyGoalsRow.split("||");
                // Map each element to create an array of objects
                const arrayOfObjects = elements.map((element: any) => {

                  element = element.replace(/\|/g, '');

                  // Split each element by '-' to get the two parts
                  const parts = element.split('@');
                  // Create an object with 'xx' and 'yyyyy' fields

                  return {
                    Idx: parts[0],
                    AmountInYear: parts[1]
                  };
                });

                arrayOfObjects.forEach((elementAmountInYear: any, idx: number) => {
                  //console.log(elementAmountInYear.Idx);
                  //console.log(elementAmountInYear.AmountInYear);
                  this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[elementAmountInYear.Idx] = elementAmountInYear.AmountInYear;
                });

                //console.log(this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear);


                for (let index = 0; index < this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear.length; index++) {
                  this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.UpdateRow(index);
                }
              }


/*               this.AllInfo.IncomesGoalsViewInfo.ReturnOnSavings = incomeGoal.ReturnOnSavings;
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].IncomeSrc = incomeGoal.IncomeSource;
              this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].AmountInYear = new Array<string>(parseInt(this.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.AllInfo.PersonalDataViewInfo.Age1) + 1);
              const elements = incomeGoal.Incomes.split("||");
              // Map each element to create an array of objects
              const arrayOfObjects = elements.map((element:any) => {

                element = element.replace(/\|/g, '');

                // Split each element by '-' to get the two parts
                const parts = element.split('@');
                // Create an object with 'xx' and 'yyyyy' fields
                return {
                  Idx: parts[0],
                  AmountInYear: parts[1]
                };
              });

              arrayOfObjects.forEach((elementAmountInYear:any) => {
                this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows[incomeGoalIdx].AmountInYear[elementAmountInYear.Idx] = elementAmountInYear.AmountInYear;
              });
 */              oneOffFamilyGoalIdx++;
            });


            //this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[12].AmountInYear[6] = "500,000"; // Delete

            /*          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[0].NameOfGoal = "שיפוץ";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[0].EveryFewYears = "10";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[0].Cost = "50,000";
         
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[1].NameOfGoal = "קורס העצמה";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[1].EveryFewYears = "3";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[1].Cost = "7,000";
         
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[2].NameOfGoal = "טיול משפחתי זוגי";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[2].EveryFewYears = "1";
                     this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[2].Cost = "10,000"; */



            this.onNumberOfChildrenChange(parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1));
            if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "נשוי")
              this.AllInfo.PersonalDataViewInfo.Marride = true;
            else
              this.AllInfo.PersonalDataViewInfo.Marride = false;
          }
          else {
            this.AllInfo.PersonalDataViewInfo.Name2 = person.FirstName;
            this.AllInfo.PersonalDataViewInfo.Age2 = person.Age;
            this.AllInfo.PersonalDataViewInfo.SelectedSex2 = person.Sex;
            this.AllInfo.PersonalDataViewInfo.RetirementAge2 = person.RetirementAge;
          }
        });
        for (var i = 0; i < financeAdvisor.Children.length; i++) {
          this.AllInfo.PersonalDataViewInfo.Child[i].Age = financeAdvisor.Children[i].Age;
          this.AllInfo.PersonalDataViewInfo.Child[i].SelectedSex = financeAdvisor.Children[i].Sex;
          this.AllInfo.PersonalDataViewInfo.Child[i].Name = financeAdvisor.Children[i].FirstName;
        }
        this.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome = financeAdvisor.FinanceAdvisor[0].SeudiInsuranceInHome;
        this.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad = financeAdvisor.FinanceAdvisor[0].SeudiInsuranceInMossad;
        this.AllInfo.PersonalDataViewInfo.AnnualInterest = financeAdvisor.FinanceAdvisor[0].AnnualInterst;
        this.AllInfo.PersonalDataViewInfo.Unplanned = financeAdvisor.FinanceAdvisor[0].Unplanned;
        this.AllInfo.PersonalDataViewInfo.CreditRating = financeAdvisor.FinanceAdvisor[0].CreditRating;
        financeAdvisor.Relatives.forEach((relative: any) => {
          if (relative.PersonID == Person1ID) {
            this.AllInfo.RelativeViewInfo.FatherAge1 = relative.FatherAge;
            this.AllInfo.RelativeViewInfo.FatherCanHelp1 = relative.FatherCanHelp;
            this.AllInfo.RelativeViewInfo.FatherNeedHelp1 = relative.FatherNeedHelp;
            this.AllInfo.RelativeViewInfo.FatherGetF1 = relative.FatherInheritanceAmount;
            this.AllInfo.RelativeViewInfo.CommentFather1 = relative.FatherComment;
            this.AllInfo.RelativeViewInfo.MotherAge1 = relative.MotherAge;
            this.AllInfo.RelativeViewInfo.MotherCanHelp1 = relative.MotherCanHelp;
            this.AllInfo.RelativeViewInfo.MotherNeedHelp1 = relative.MotherNeedHelp;
            this.AllInfo.RelativeViewInfo.MotherGetF1 = relative.MotherInheritanceAmount;
            this.AllInfo.RelativeViewInfo.CommentMother1 = relative.MotherComment;
          }
          else {
            this.AllInfo.RelativeViewInfo.FatherAge2 = relative.FatherAge;
            this.AllInfo.RelativeViewInfo.FatherCanHelp2 = relative.FatherCanHelp;
            this.AllInfo.RelativeViewInfo.FatherNeedHelp2 = relative.FatherNeedHelp;
            this.AllInfo.RelativeViewInfo.FatherGetF2 = relative.FatherInheritanceAmount;
            this.AllInfo.RelativeViewInfo.CommentFather2 = relative.FatherComment;
            this.AllInfo.RelativeViewInfo.MotherAge2 = relative.MotherAge;
            this.AllInfo.RelativeViewInfo.MotherCanHelp2 = relative.MotherCanHelp;
            this.AllInfo.RelativeViewInfo.MotherNeedHelp2 = relative.MotherNeedHelp;
            this.AllInfo.RelativeViewInfo.MotherGetF2 = relative.MotherInheritanceAmount;
            this.AllInfo.RelativeViewInfo.CommentMother2 = relative.MotherComment;
          }
        });

        let incomeIdxPerson1 = 0;
        let incomeIdxPerson2 = 0;
        financeAdvisor.Incomes.forEach((income: any) => {
          if (income.PersonID == Person1ID) {
            this.AllInfo.IncomesViewInfo.IncomeRows[0].push(new IncomeRowObj());
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].Type = income.Type;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].FixedMonthly = income.FixedMonthly;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].MonthlyRevenue1 = income.MonthlyRevenue1;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].MonthlyRevenue2 = income.MonthlyRevenue2;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].MonthlyRevenue3 = income.MonthlyRevenue3;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].Comment = income.Comment;
            this.AllInfo.IncomesViewInfo.IncomeRows[0][incomeIdxPerson1].CalcMonthlyAverage(0);
            incomeIdxPerson1++;
          }
          else {
            this.AllInfo.IncomesViewInfo.IncomeRows[1].push(new IncomeRowObj());
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].Type = income.Type;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].FixedMonthly = income.FixedMonthly;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].MonthlyRevenue1 = income.MonthlyRevenue1;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].MonthlyRevenue2 = income.MonthlyRevenue2;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].MonthlyRevenue3 = income.MonthlyRevenue3;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].Comment = income.Comment;
            this.AllInfo.IncomesViewInfo.IncomeRows[1][incomeIdxPerson2].CalcMonthlyAverage(1);
            incomeIdxPerson2++;
          }
        });

        if (this.AllInfo.IncomesViewInfo.IncomeRows[0].length == 0)
          this.AllInfo.IncomesViewInfo.IncomeRows[0].push(new IncomeRowObj);

        if (this.AllInfo.IncomesViewInfo.IncomeRows[1].length == 0)
          this.AllInfo.IncomesViewInfo.IncomeRows[1].push(new IncomeRowObj);



        let lossOfWorkingCapacityIdxPerson1 = 0;
        let lossOfWorkingCapacityIdxPerson2 = 0;
        financeAdvisor.LossOfWorkingCapacity.forEach((lossOfWorkingCapacity: any) => {
          if (lossOfWorkingCapacity.PersonID == Person1ID) {
            this.AllInfo.LossOfWorkingCapacity.GrossForPension[0] = lossOfWorkingCapacity.GrossForPension;
            this.AllInfo.LossOfWorkingCapacity.SocialSecurity[0] = lossOfWorkingCapacity.SocialSecurity;
            this.AllInfo.LossOfWorkingCapacity.PensionFund[0] = lossOfWorkingCapacity.PensionFund;
            this.AllInfo.LossOfWorkingCapacity.ManagerInsurance[0] = lossOfWorkingCapacity.ManagerInsurance;
            this.AllInfo.LossOfWorkingCapacity.PrivateInsurance[0] = lossOfWorkingCapacity.PrivateInsurance;
            lossOfWorkingCapacityIdxPerson1++;
          }
          else {
            this.AllInfo.LossOfWorkingCapacity.GrossForPension[1] = lossOfWorkingCapacity.GrossForPension;
            this.AllInfo.LossOfWorkingCapacity.SocialSecurity[1] = lossOfWorkingCapacity.SocialSecurity;
            this.AllInfo.LossOfWorkingCapacity.PensionFund[1] = lossOfWorkingCapacity.PensionFund;
            this.AllInfo.LossOfWorkingCapacity.ManagerInsurance[1] = lossOfWorkingCapacity.ManagerInsurance;
            this.AllInfo.LossOfWorkingCapacity.PrivateInsurance[1] = lossOfWorkingCapacity.PrivateInsurance;
            lossOfWorkingCapacityIdxPerson2++;
          }
        });

        this.AllInfo.LossOfWorkingCapacity.MaximumAmount[0] = (this.AllInfo.LossOfWorkingCapacity.GrossForPension[0] != "") ? (parseInt(this.AllInfo.LossOfWorkingCapacity.GrossForPension[0]) * 0.75).toFixed(0).toString() : "";
        this.AllInfo.LossOfWorkingCapacity.MaximumAmount[1] = (this.AllInfo.LossOfWorkingCapacity.GrossForPension[1] != "") ? (parseInt(this.AllInfo.LossOfWorkingCapacity.GrossForPension[1]) * 0.75).toFixed(0).toString() : "";

        let incomeExIdx = 0;
        this.AllInfo.IncomesViewInfo.IncomeExRows.splice(2);
        financeAdvisor.IncomesEx.forEach((incomeEx: any) => {
          if (incomeExIdx > 1)
            this.AllInfo.IncomesViewInfo.IncomeExRows.push(new IncomeExRowObj());
          this.AllInfo.IncomesViewInfo.IncomeExRows[incomeExIdx].Type = incomeEx.Type;
          this.AllInfo.IncomesViewInfo.IncomeExRows[incomeExIdx].MonthlyAvg = incomeEx.MonthlyAvg;
          this.AllInfo.IncomesViewInfo.IncomeExRows[incomeExIdx].Comment = incomeEx.Comment;
          incomeExIdx++;
        });


        let fixedMonthlyAvg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[0].forEach(element => {
          fixedMonthlyAvg += (element.FixedMonthly.replace(',', '') != "" ? parseFloat(element.FixedMonthly.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0] = fixedMonthlyAvg.toFixed(0).toString();

        let monthlyRevenue1Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[0].forEach(element => {
          monthlyRevenue1Avg += (element.MonthlyRevenue1.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue1.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[0] = monthlyRevenue1Avg.toFixed(0).toString();

        let monthlyRevenue2Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[0].forEach(element => {
          monthlyRevenue2Avg += (element.MonthlyRevenue2.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue2.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[0] = monthlyRevenue2Avg.toFixed(0).toString();

        let monthlyRevenue3Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[0].forEach(element => {
          monthlyRevenue3Avg += (element.MonthlyRevenue3.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue3.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[0] = monthlyRevenue3Avg.toFixed(0).toString();

        fixedMonthlyAvg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[1].forEach(element => {
          fixedMonthlyAvg += (element.FixedMonthly.replace(',', '') != "" ? parseFloat(element.FixedMonthly.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1] = fixedMonthlyAvg.toFixed(0).toString();

        monthlyRevenue1Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[1].forEach(element => {
          monthlyRevenue1Avg += (element.MonthlyRevenue1.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue1.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[1] = monthlyRevenue1Avg.toFixed(0).toString();

        monthlyRevenue2Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[1].forEach(element => {
          monthlyRevenue2Avg += (element.MonthlyRevenue2.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue2.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[1] = monthlyRevenue2Avg.toFixed(0).toString();

        monthlyRevenue3Avg = 0;
        this.AllInfo.IncomesViewInfo.IncomeRows[1].forEach(element => {
          monthlyRevenue3Avg += (element.MonthlyRevenue3.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue3.replace(',', '')) : 0);
        });
        this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[1] = monthlyRevenue3Avg.toFixed(0).toString();

        this.AllInfo.IncomesViewInfo.Income[0] = ((this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0].replace(',', '')) : 0) +
          (((this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[0].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[0].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[0].replace(',', '')) : 0)) / 3)).toFixed(0).toString();

        this.AllInfo.IncomesViewInfo.Income[1] = ((this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1].replace(',', '')) : 0) +
          (((this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[1].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[1].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[1].replace(',', '')) : 0)) / 3)).toFixed(0).toString();

        let incomeEx = 0;

        for (let i = 0; i < this.AllInfo.IncomesViewInfo.IncomeExRows.length; i++) {
          incomeEx += (this.AllInfo.IncomesViewInfo.IncomeExRows[i].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[i].MonthlyAvg.replace(',', '')) : 0);
        }

        this.AllInfo.IncomesViewInfo.IncomeEx = incomeEx.toString();;


        /* 
                this.AllInfo.IncomesViewInfo.IncomeEx = ((this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.IncomeExRows[2].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[2].MonthlyAvg.replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.IncomeExRows[3].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[3].MonthlyAvg.replace(',', '')) : 0)).toFixed(0).toString();
         */

        this.AllInfo.IncomesViewInfo.SumIncomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
          (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
          (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0));

        this.AllInfo.IncomesViewInfo.SumNetIncomes =
          ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
            (this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
            (this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

        console.log("SumNetIncomes = " + this.AllInfo.IncomesViewInfo.SumNetIncomes);

        let economicalStability = JSON.stringify(financeAdvisor.EconomicalStability[0])
        this.AllInfo.EconomicalStabilityViewInfo.CapitalTagged = JSON.parse(economicalStability).CapitalLabeledForThis;
        this.AllInfo.EconomicalStabilityViewInfo.HowManyYears = JSON.parse(economicalStability).InHowManyYears;

        //console.log("CapitalTagged - " + this.AllInfo.EconomicalStabilityViewInfo.CapitalTagged);
        //console.log("HowManyYears - " + this.AllInfo.EconomicalStabilityViewInfo.HowManyYears);

        let repetitiveGoalsIdx = 0;
        this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows = [];
        financeAdvisor.RepetitiveGoals.forEach((repetitiveGoals: any) => {
          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows.push(new RepetitiveGoalsRowObj());
          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[repetitiveGoalsIdx].NameOfGoal = repetitiveGoals.NameOfTarget;
          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[repetitiveGoalsIdx].EveryFewYears = repetitiveGoals.EveryFewYears;
          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[repetitiveGoalsIdx].Cost = repetitiveGoals.TargetCost;
          repetitiveGoalsIdx++;
        });

        if (this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows.length == 0)
          this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows.push(new RepetitiveGoalsRowObj);

        /*   this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0] = ((this.AllInfo.IncomesViewInfo.IncomeRows[0][0].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[0][0].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[0][1].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[0][1].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[0][2].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[0][2].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[0][3].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[0][3].FixedMonthly.replace(',', '')) : 0)).toFixed(0).toString();
  
  
          this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1] = ((this.AllInfo.IncomesViewInfo.IncomeRows[1][0].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[1][0].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[1][1].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[1][1].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[1][2].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[1][2].FixedMonthly.replace(',', '')) : 0) +
            (this.AllInfo.IncomesViewInfo.IncomeRows[1][3].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeRows[1][3].FixedMonthly.replace(',', '')) : 0)).toFixed(0).toString();
  
  
          this.AllInfo.IncomesViewInfo.Income[0] = ((this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[0].replace(',', '')) : 0) +
            (((this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[0].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[0].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[0].replace(',', '')) : 0)) / 3)).toFixed(0).toString();
  
          this.AllInfo.IncomesViewInfo.Income[1] = ((this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.FixedMonthlyAvg[1].replace(',', '')) : 0) +
            (((this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[1].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[1].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[1].replace(',', '')) : 0)) / 3)).toFixed(0).toString();
  
          let incomeEx = 0;
  
          for (let i = 0; i < this.AllInfo.IncomesViewInfo.IncomeExRows.length; i++) {
            incomeEx += (this.AllInfo.IncomesViewInfo.IncomeExRows[i].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[i].MonthlyAvg.replace(',', '')) : 0);
          }
  
          this.AllInfo.IncomesViewInfo.IncomeEx = incomeEx.toString();;
  
  /*         this.AllInfo.IncomesViewInfo.IncomeEx = (
            ((this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "") ? parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) +
            ((this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "") ? parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0) +
            ((this.AllInfo.IncomesViewInfo.IncomeExRows[2].MonthlyAvg.replace(',', '') != "") ? parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[2].MonthlyAvg.replace(',', '')) : 0) +
            ((this.AllInfo.IncomesViewInfo.IncomeExRows[3].MonthlyAvg.replace(',', '') != "") ? parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[3].MonthlyAvg.replace(',', '')) : 0)).toFixed(0).toString();
   
          this.AllInfo.IncomesViewInfo.SumNetIncomes =
            ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
              (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
              (this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
              (this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));
   */
        let savingIdx = 0;
        this.AllInfo.SavingViewInfo.SavingRows = [];
        financeAdvisor.Saving.forEach((saving: any) => {
          this.AllInfo.SavingViewInfo.SavingRows.push(new SavingRowObj());
          this.AllInfo.SavingViewInfo.SavingRows[savingIdx].Type = saving.Type;
          this.AllInfo.SavingViewInfo.SavingRows[savingIdx].FixedMonthly = saving.FixedMonthly;
          this.AllInfo.SavingViewInfo.SavingRows[savingIdx].CurrentAmount = saving.CurrentAmount;
          this.AllInfo.SavingViewInfo.SavingRows[savingIdx].Comment = saving.Comment;
          savingIdx++;
        });

        if (this.AllInfo.SavingViewInfo.SavingRows.length == 0)
          this.AllInfo.SavingViewInfo.SavingRows.push(new SavingRowObj);

        this.AllInfo.SavingViewInfo.SavingMonthly = 0;

        for (let i = 0; i < this.AllInfo.SavingViewInfo.SavingRows.length; i++) {
          this.AllInfo.SavingViewInfo.SavingMonthly += (this.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '')) : 0);
        }

        this.AllInfo.SavingViewInfo.CurrAmounts = 0;

        for (let i = 0; i < this.AllInfo.SavingViewInfo.SavingRows.length; i++) {
          this.AllInfo.SavingViewInfo.CurrAmounts += (this.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '')) : 0);
        }

        let fixedExpenseIdx = 0;
        this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.splice(4);
        financeAdvisor.FixedExpenses.forEach((fixedExpense: any) => {
          if (fixedExpenseIdx > 3) {
            this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.push(new FixedExpensesRowObj());
          }
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].Type = fixedExpense.Type;
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].FixedMonthly = fixedExpense.FixedMonthly;
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].MonthlyExpense1 = fixedExpense.MonthlyExpense1;
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].MonthlyExpense2 = fixedExpense.MonthlyExpense2;
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].MonthlyExpense3 = fixedExpense.MonthlyExpense3;
          this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[fixedExpenseIdx].Comment = fixedExpense.Comment
          fixedExpenseIdx++;
        });

        var expenses = 0;

        for (let i = 0; i < this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
          expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '')) : 0);
        }

        this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg = expenses.toFixed(0).toString();

        expenses = 0;

        for (let i = 0; i < this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
          expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '')) : 0);
        }

        this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();

        expenses = 0;

        for (let i = 0; i < this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
          expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '')) : 0);
        }

        this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = expenses.toFixed(0).toString();

        expenses = 0;

        for (let i = 0; i < this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
          expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '')) : 0);
        }

        this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg = expenses.toFixed(0).toString();

        this.AllInfo.FixedExpensesViewInfo.Expenses = ((this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '')) : 0) +
          (((this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '')) : 0) +
            (this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '')) : 0) +
            (this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '')) : 0)) / 3)).toFixed(0).toString();


        //console.log("Var - " + JSON.parse(financeAdvisor.VariableExpenses));
        financeAdvisor.VariableExpenses.forEach((element: any, idx: any) => {
          /*  if (element.CategoryName == "שונות")
             console.log("financeAdvisor.VariableExpenses - " + JSON.stringify(element)); */
          this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[element.CategoryIndex].VariableExpensesRowObj[element.SubcategoryIndex].CurrExpense = element.CurrentExpense;
          this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[element.CategoryIndex].VariableExpensesRowObj[element.SubcategoryIndex].SatisfactionExpense = element.SatisfactionExpense;
          this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[element.CategoryIndex].VariableExpensesRowObj[element.SubcategoryIndex].Anchor = element.Anchor == 1 ? true : false;
          this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[element.CategoryIndex].VariableExpensesRowObj[element.SubcategoryIndex].Flexible = element.Flexible == 1 ? true : false;
          this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[element.CategoryIndex].VariableExpensesRowObj[element.SubcategoryIndex].GoodToBe = element.GoodToBe == 1 ? true : false;
        });

        this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses = 0;

        for (let i = 0; i < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
          for (let j = 0; j < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
            this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses += ((this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '') != "" ? parseFloat(this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '')) : 0));
          }
        }



        let financeLiquidityAssetsIdx = 0;
        this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows = [];
        financeAdvisor.FinanceLiquidityAsset.forEach((financeliquidityAssets: any) => {
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.push(new FinanceAssetRowObj());
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[financeLiquidityAssetsIdx].DescriptionSaving = financeliquidityAssets.Description;
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[financeLiquidityAssetsIdx].WhereSaving = financeliquidityAssets.SavingLocation;
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[financeLiquidityAssetsIdx].CurrentAmount = financeliquidityAssets.CurrentAmount;
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[financeLiquidityAssetsIdx].Comment = financeliquidityAssets.Comment;
          financeLiquidityAssetsIdx++;
        });

        if (this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length == 0)
          this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.push(new FinanceAssetRowObj);


        let financeUnliquidityAssetsIdx = 0;
        this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows = [];
        financeAdvisor.FinanceUnliquidityAsset.forEach((financeUnliquidityAssets: any) => {
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.push(new FinanceAssetRowObj());
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[financeUnliquidityAssetsIdx].DescriptionSaving = financeUnliquidityAssets.Description;
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[financeUnliquidityAssetsIdx].DescriptionSaving = financeUnliquidityAssets.Description;
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[financeUnliquidityAssetsIdx].WhereSaving = financeUnliquidityAssets.SavingLocation;
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[financeUnliquidityAssetsIdx].CurrentAmount = financeUnliquidityAssets.CurrentAmount;
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[financeUnliquidityAssetsIdx].Comment = financeUnliquidityAssets.Comment;
          financeUnliquidityAssetsIdx++;
        })

        if (this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.length == 0)
          this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.push(new FinanceAssetRowObj);


        let realEstatesIdx = 0;
        this.AllInfo.RealEstateViewInfo.RealEstateRows = [];

        financeAdvisor.RealEstates.forEach((realEstates: any) => {
          this.AllInfo.RealEstateViewInfo.RealEstateRows.push(new RealEstateRowObj);
          //console.log("\n" + realEstates + "\n");
          this.AllInfo.RealEstateViewInfo.RealEstateRows[realEstatesIdx].Description = realEstates.Type;
          this.AllInfo.RealEstateViewInfo.RealEstateRows[realEstatesIdx].AssetValue = realEstates.AssetValue;
          this.AllInfo.RealEstateViewInfo.RealEstateRows[realEstatesIdx].NortgageBalance = realEstates.MortgageBalance;
          this.AllInfo.RealEstateViewInfo.RealEstateRows[realEstatesIdx].Comment = realEstates.Comment;
          realEstatesIdx++;
        })

        if (this.AllInfo.RealEstateViewInfo.RealEstateRows.length == 0)
          this.AllInfo.RealEstateViewInfo.RealEstateRows.push(new RealEstateRowObj);

        var assetValue = 0;

        for (let i = 0; i < this.AllInfo.RealEstateViewInfo.RealEstateRows.length; i++) {
          assetValue += (this.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '')) : 0);
        }

        this.AllInfo.RealEstateViewInfo.AssetValues = assetValue.toFixed(0).toString();

        var nortgageBalances = 0;

        for (let i = 0; i < this.AllInfo.RealEstateViewInfo.RealEstateRows.length; i++) {
          nortgageBalances += (this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '')) : 0);
        }

        this.AllInfo.RealEstateViewInfo.NortgageBalances = nortgageBalances.toFixed(0).toString();

        this.AllInfo.RealEstateViewInfo.NetWorths = (this.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '')) : 0) -
          (this.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '')) : 0);

        let vehiclesIdx = 0;
        this.AllInfo.VehiclesViewInfo.VehiclesRows = [];

        financeAdvisor.Vehicles.forEach((vehicles: any) => {
          this.AllInfo.VehiclesViewInfo.VehiclesRows.push(new VehiclesRowObj());
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].Description = vehicles.Description;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].YearOfProduction = vehicles.YearOfProduction;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].VehicleWorth = vehicles.VehicleWorth;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].KmPerYear = vehicles.KmPerYear;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].FuelConsumption = vehicles.FuelConsumption;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].Test = vehicles.Test;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].Insurance = vehicles.Insurance;
          this.AllInfo.VehiclesViewInfo.VehiclesRows[vehiclesIdx].Treatments = vehicles.Treatments;
          this.AllInfo.VehiclesViewInfo.PriceOfFuel = vehicles.PriceOfFuel;
          vehiclesIdx++;
        })


        if (this.AllInfo.VehiclesViewInfo.VehiclesRows.length == 0)
          this.AllInfo.VehiclesViewInfo.VehiclesRows.push(new VehiclesRowObj);


        let currentFlowIdx = 0;
        this.AllInfo.CommitmentsViewInfo.CommitmentsRows = [];
        
        // מיון לפי היום בחודש (Date הוא מספר יום בלבד)
        financeAdvisor.CurrentFlow
          .sort((a: any, b: any) => a.Date - b.Date) // ממיין מהקטן לגדול
          .forEach((currentFlow: any) => {
            this.AllInfo.CurrentFlowViewInfo.itemsRows.push(new itemsRowObj());
            this.AllInfo.CurrentFlowViewInfo.itemsRows[currentFlowIdx].Date = currentFlow.Date;
            this.AllInfo.CurrentFlowViewInfo.itemsRows[currentFlowIdx].Type = currentFlow.Type;
            this.AllInfo.CurrentFlowViewInfo.itemsRows[currentFlowIdx].CurrAmount = currentFlow.CurrAmount;
            this.AllInfo.CurrentFlowViewInfo.itemsRows[currentFlowIdx].Comment = currentFlow.Comment;
            currentFlowIdx++;
          });

        if (this.AllInfo.CurrentFlowViewInfo.itemsRows.length == 0)
          this.AllInfo.CurrentFlowViewInfo.itemsRows.push(new itemsRowObj);


        let commitmentsIdx = 0;
        this.AllInfo.CommitmentsViewInfo.CommitmentsRows = [];
        financeAdvisor.Commitments.forEach((commitments: any) => {
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows.push(new CommitmentsRowObj());
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].TheLender = commitments.Description;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].ExecutionDate = commitments.ExecutionDate;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].OriginalAmount = commitments.OriginalAmount;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].CurrAmount = commitments.CurrAmount;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].MonthlyPayment = commitments.MonthlyPayment;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].Interest = commitments.Interest;
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[commitmentsIdx].Comment = commitments.Comment;
          commitmentsIdx++;
        })

        if (this.AllInfo.CommitmentsViewInfo.CommitmentsRows.length == 0)
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows.push(new CommitmentsRowObj);


        this.AllInfo.CommitmentsViewInfo.BuildingASstrategyOfLiquidationOfCommitments();

        let mortgagesIdx = 0;
        this.AllInfo.MortgagesViewInfo.MortgagesRows = [];
        financeAdvisor.Mortgages.forEach((mortgages: any) => {
          this.AllInfo.MortgagesViewInfo.MortgagesRows.push(new MortgagesRowObj());
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].Name = mortgages.Name;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].Route = mortgages.Route;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].OriginalAmount = mortgages.OriginalAmount;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].CurrAmount = mortgages.CurrentAmount;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].Interest = mortgages.Interest;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].YearToEnd = mortgages.YearToEnd;
          this.AllInfo.MortgagesViewInfo.MortgagesRows[mortgagesIdx].Linkage = mortgages.Linkage;
          mortgagesIdx++;
        })

        if (this.AllInfo.MortgagesViewInfo.MortgagesRows.length == 0)
          this.AllInfo.MortgagesViewInfo.MortgagesRows.push(new MortgagesRowObj);

        this.AllInfo.MortgagesViewInfo.CostOfFinancings = 0;

        for (let i = 0; i < this.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
          this.AllInfo.MortgagesViewInfo.CostOfFinancings += (this.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost).replace(',', '') != "" ? parseInt(this.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')) : 0;
        }

        this.AllInfo.MortgagesViewInfo.RemainingMortgages = 0;

        for (let i = 0; i < this.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
          this.AllInfo.MortgagesViewInfo.RemainingMortgages += (this.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().totalPrincipalWithLinkage).replace(',', '') != "" ? parseInt(this.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().totalPrincipalWithLinkage.replace(',', '')) : 0;
        }

        var nortgageBalances = 0;

        for (let i = 0; i < this.AllInfo.RealEstateViewInfo.RealEstateRows.length; i++) {
          nortgageBalances += (this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '')) : 0);
        }

        this.AllInfo.RealEstateViewInfo.NortgageBalances = nortgageBalances.toFixed(0).toString();

        let lifeInsuranceIdxPerson1 = 0;
        let lifeInsuranceIdxPerson2 = 0;
        this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0] = [];
        this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1] = [];

        financeAdvisor.LifeInsurance.forEach((lifeInsurance: any) => {
          if (lifeInsurance.PersonID == Person1ID) {
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0].push(new LifeInsuranceRow());
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][lifeInsuranceIdxPerson1].Name = lifeInsurance.Name;
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][lifeInsuranceIdxPerson1].CapitalAmount = lifeInsurance.CapitalAmount;
            lifeInsuranceIdxPerson1++;
          }
          else {
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1].push(new LifeInsuranceRow());
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][lifeInsuranceIdxPerson2].Name = lifeInsurance.Name;
            this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][lifeInsuranceIdxPerson2].CapitalAmount = lifeInsurance.CapitalAmount;
            lifeInsuranceIdxPerson2++;
          }
        })

        if (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0].length == 0)
          this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0].push(new LifeInsuranceRow);

        if (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1].length == 0)
          this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1].push(new LifeInsuranceRow);

        this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0] = 0;

        for (let i = 0; i < this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0].length; i++) {
          this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0] += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].CapitalAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].CapitalAmount.replace(',', '')) : 0);
        }

        this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1] = 0;

        for (let i = 0; i < this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1].length; i++) {
          this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1] += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].CapitalAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].CapitalAmount.replace(',', '')) : 0);
        }


        let lifeLongCareInsurancesInHealthFundIdx = 0;
        financeAdvisor.LifeLongCareInsurancesInHealth.forEach((lifeLongCareInsurancesInHealthFund: any) => {
          if (lifeLongCareInsurancesInHealthFund.PersonID == Person1ID) {
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].Name = lifeLongCareInsurancesInHealthFund.Name;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].HomeAmount = lifeLongCareInsurancesInHealthFund.HomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].SeudiAmount = lifeLongCareInsurancesInHealthFund.SeudiAmount;
          }
          else {
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].Name = lifeLongCareInsurancesInHealthFund.Name;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].HomeAmount = lifeLongCareInsurancesInHealthFund.HomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].SeudiAmount = lifeLongCareInsurancesInHealthFund.SeudiAmount;
          }
        });

        let lifeLongCareInsurancesInInsuranceCompanyPerson1Idx = 0;
        let lifeLongCareInsurancesInInsuranceCompanyPerson2Idx = 0;
        this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1] = [];
        this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1] = [];

        financeAdvisor.LifeLongCareInsurancesInInsuranceCompany.forEach((lifeLongCareInsurancesInInsuranceCompany: any) => {

          if (lifeLongCareInsurancesInInsuranceCompany.PersonID == Person1ID) {
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0].push(new LifeLongCareInsurancesInInsuranceCompanyRowObj());
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][lifeLongCareInsurancesInInsuranceCompanyPerson1Idx].Name = lifeLongCareInsurancesInInsuranceCompany.Name;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][lifeLongCareInsurancesInInsuranceCompanyPerson1Idx].First5YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany.First5YearHomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][lifeLongCareInsurancesInInsuranceCompanyPerson1Idx].Over6YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany.Over6YearHomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][lifeLongCareInsurancesInInsuranceCompanyPerson1Idx].First5YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany.First5YearSeudiAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][lifeLongCareInsurancesInInsuranceCompanyPerson1Idx].Over6YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany.Over6YearSeudiAmount;
            lifeLongCareInsurancesInInsuranceCompanyPerson1Idx++;
          }
          else {
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1].push(new LifeLongCareInsurancesInInsuranceCompanyRowObj());
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][lifeLongCareInsurancesInInsuranceCompanyPerson2Idx].Name = lifeLongCareInsurancesInInsuranceCompany.Name;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][lifeLongCareInsurancesInInsuranceCompanyPerson2Idx].First5YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany.First5YearHomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][lifeLongCareInsurancesInInsuranceCompanyPerson2Idx].Over6YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany.Over6YearHomeAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][lifeLongCareInsurancesInInsuranceCompanyPerson2Idx].First5YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany.First5YearSeudiAmount;
            this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][lifeLongCareInsurancesInInsuranceCompanyPerson2Idx].Over6YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany.Over6YearSeudiAmount;
            lifeLongCareInsurancesInInsuranceCompanyPerson2Idx++;
          }
        })

        let lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx = 0;
        this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows = [];

        financeAdvisor.LifeLongCareInsurancesInInsuranceCompany4Childrens.forEach((lifeLongCareInsurancesInInsuranceCompany4Childrens: any) => {
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows.push(new LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj());
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].ChildName = lifeLongCareInsurancesInInsuranceCompany4Childrens.ChildName;
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].Name = lifeLongCareInsurancesInInsuranceCompany4Childrens.Name;
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].First5YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany4Childrens.First5YearHomeMount;
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].Over6YearHomeAmount = lifeLongCareInsurancesInInsuranceCompany4Childrens.Over6YearHomeMount;
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].First5YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany4Childrens.First5YearSeudiMount;
          this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx].Over6YearSeudiAmount = lifeLongCareInsurancesInInsuranceCompany4Childrens.Over6YearSeudiMount;
          lifeLongCareInsurancesInInsuranceCompany4ChildrensIdx++;
        })

        this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0] = 0;

        for (let i = 0; i < this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0].length; i++) {
          this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0] += (this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][i].First5YearHomeAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][i].First5YearHomeAmount.replace(',', '')) : 0);
        }

        if (this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].HomeAmount != "")
          this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0] += parseInt(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].HomeAmount.replace(',', ''));

        this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1] = 0;

        for (let i = 0; i < this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1].length; i++) {
          this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1] += (this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][i].First5YearHomeAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1][i].First5YearHomeAmount.replace(',', '')) : 0);
        }

        if (this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[0].HomeAmount != "")
          this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1] += parseInt(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].HomeAmount.replace(',', ''));

        let healthInsuranceIdx = 0;
        this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows = [];

        financeAdvisor.HealthInsurance.forEach((healthInsurance: any) => {
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.push(new HealthInsuranceRowObj());
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[healthInsuranceIdx].NameOfInsured = healthInsurance.NameOfInsured;
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[healthInsuranceIdx].NameOfHealthInsurance = healthInsurance.NameOfHealthInsurance;
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[healthInsuranceIdx].SupplementaryInsurance = healthInsurance.SupplementaryInsurance;
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[healthInsuranceIdx].PrivateInsurancDescription = healthInsurance.PrivateInsurancDescription;
          healthInsuranceIdx++;
        })

        if (this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.length == 0)
          this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.push(new HealthInsuranceRowObj);

        let managerInsuranceIdxPerson1 = 0;
        let managerInsuranceIdxPerson2 = 0;
        this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows = [];
        this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows = [];

        financeAdvisor.ManagerInsurance.forEach((managerInsurance: any) => {
          if (managerInsurance.PersonID == Person1ID) {
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.push(new ManagerInsuranceRowObj());
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].NameOfInsurance = managerInsurance.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].CurrentCapitalAmount = managerInsurance.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].MonthlyDepositAmount = managerInsurance.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].LumpSum = managerInsurance.LumpSum;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].AllowanceFactor = managerInsurance.AllowanceFactor;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].CalcCapitalAmountInCaseOfDeath();
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].CalcCapitalAmountInCasePension(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge1, this.AllInfo.PersonalDataViewInfo.Age1);
            this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[managerInsuranceIdxPerson1].CalcMonthlyAllowance();
            managerInsuranceIdxPerson1++;
          }
          else {
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows.push(new ManagerInsuranceRowObj());
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].NameOfInsurance = managerInsurance.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].CurrentCapitalAmount = managerInsurance.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].MonthlyDepositAmount = managerInsurance.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].LumpSum = managerInsurance.LumpSum;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].AllowanceFactor = managerInsurance.AllowanceFactor;
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].CalcCapitalAmountInCaseOfDeath();
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].CalcCapitalAmountInCasePension(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge2, this.AllInfo.PersonalDataViewInfo.Age2);
            this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[managerInsuranceIdxPerson2].CalcMonthlyAllowance();
            managerInsuranceIdxPerson2++;
          }
        })


        if (this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.length == 0)
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.push(new ManagerInsuranceRowObj);

        if (this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows.length == 0)
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows.push(new ManagerInsuranceRowObj);



        this.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.length; i++) {
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances += (this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }

        this.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows.length; i++) {
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances += (this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }


        let pensionFundIdxPerson1 = 0;
        let pensionFundIdxPerson2 = 0;
        this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows = [];
        this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows = [];
        financeAdvisor.PensionFund.forEach((pensionFund: any) => {
          if (pensionFund.PersonID == Person1ID) {
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.push(new PensionFundRowObj());
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].NameOfInsurance = pensionFund.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].CurrentCapitalAmount = pensionFund.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].MonthlyDepositAmount = pensionFund.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].EndDate = pensionFund.EndDate;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].WidowsAllowance = pensionFund.WidowsAllowance;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].OrphanAllowance = pensionFund.OrphanAllowance;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].DisabilityFund = pensionFund.DisabilityFund;
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge1, this.AllInfo.PersonalDataViewInfo.Age1);
            this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[pensionFundIdxPerson1].CalcCalculatedMonthlyAllowance();
            pensionFundIdxPerson1++;
          }
          else {
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows.push(new PensionFundRowObj());
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].NameOfInsurance = pensionFund.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].CurrentCapitalAmount = pensionFund.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].MonthlyDepositAmount = pensionFund.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].EndDate = pensionFund.EndDate;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].WidowsAllowance = pensionFund.WidowsAllowance;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].OrphanAllowance = pensionFund.OrphanAllowance;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].DisabilityFund = pensionFund.DisabilityFund;
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge2, this.AllInfo.PersonalDataViewInfo.Age2);
            this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[pensionFundIdxPerson2].CalcCalculatedMonthlyAllowance();
            pensionFundIdxPerson2++;
          }
        })

        if (this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.length == 0)
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.push(new PensionFundRowObj);

        if (this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows.length == 0)
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows.push(new PensionFundRowObj);



        this.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.length; i++) {
          this.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }

        this.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows.length; i++) {
          this.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }

        let pensionGemelPerson1 = 0;
        let pensionGemelPerson2 = 0;
        this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows = [];
        this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows = [];
        financeAdvisor.Gemel.forEach((gemel: any) => {
          if (gemel.PersonID == Person1ID) {
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.push(new PensionFundRowObj());
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].NameOfInsurance = gemel.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].CurrentCapitalAmount = gemel.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].MonthlyDepositAmount = gemel.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].EndDate = gemel.EndDate;
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge1, this.AllInfo.PersonalDataViewInfo.Age1);
            this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelPerson1].CalcCalculatedMonthlyAllowance();
            pensionGemelPerson1++;
          }
          else {
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.push(new PensionFundRowObj());
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].NameOfInsurance = gemel.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].CurrentCapitalAmount = gemel.CurrentCapitalAmount;
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].MonthlyDepositAmount = gemel.MonthlyDepositAmount;
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].EndDate = gemel.EndDate;
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge2, this.AllInfo.PersonalDataViewInfo.Age2);
            this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelPerson2].CalcCalculatedMonthlyAllowance();
            pensionGemelPerson2++;
          }
        })

        if (this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.length == 0)
          this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.push(new PensionFundRowObj);

        if (this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.length == 0)
          this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.push(new PensionFundRowObj);



        this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.length; i++) {
          this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }

        this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.length; i++) {
          this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
        }



        /*         let pensionGemelIdxPerson1 = 0;
                let pensionGemelIdxPerson2 = 0;
                this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows = [];
                this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows = [];
                financeAdvisor.Gemel.forEach((pensionGemel: any) => {
                  if (pensionGemel.PersonID == Person1ID) {
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.push(new GemelRowObj());
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].NameOfInsurance = pensionGemel.NameOfInsurance;
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].CurrentCapitalAmount = pensionGemel.CurrentCapitalAmount;
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].MonthlyDepositAmount = pensionGemel.MonthlyDepositAmount;
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].EndDate = pensionGemel.EndDate;
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge1, this.AllInfo.PersonalDataViewInfo.Age1);
                    this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[pensionGemelIdxPerson1].CalcCalculatedMonthlyAllowance();
                    pensionGemelIdxPerson1++;
                  }
                  else {
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.push(new GemelRowObj());
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].NameOfInsurance = pensionGemel.NameOfInsurance;
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].CurrentCapitalAmount = pensionGemel.CurrentCapitalAmount;
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].MonthlyDepositAmount = pensionGemel.MonthlyDepositAmount;
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].EndDate = pensionGemel.EndDate;
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].CalcFutureAmount(this.AllInfo.PersonalDataViewInfo.AnnualInterest, this.AllInfo.PersonalDataViewInfo.RetirementAge2, this.AllInfo.PersonalDataViewInfo.Age2);
                    this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[pensionGemelIdxPerson2].CalcCalculatedMonthlyAllowance();
                    pensionGemelIdxPerson2++;
                  }
                })
        
                if (this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.length == 0)
                  this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.push(new PensionFundRowObj);
        
                if (this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.length == 0)
                  this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.push(new PensionFundRowObj);
        
        
                this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances = 0;
        
                for (let i = 0; i < this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.length; i++) {
                  this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
                }
        
                this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances = 0;
        
                for (let i = 0; i < this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows.length; i++) {
                  this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances += (this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
                }
         */

        let oldPensionFundIdxPerson1 = 0;
        let oldPensionFundIdxPerson2 = 0;
        this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows = [];
        this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows = [];

        financeAdvisor.OldPensionFund.forEach((oldPensionFund: any) => {
          if (oldPensionFund.PersonID == Person1ID) {
            this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.push(new OldPensionFundRowObj());
            this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[oldPensionFundIdxPerson1].NameOfInsurance = oldPensionFund.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[oldPensionFundIdxPerson1].AllowanceAmount = oldPensionFund.AllowanceAmount;
            this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[oldPensionFundIdxPerson1].WidowsAllowance = oldPensionFund.WidowsAllowance;
            this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[oldPensionFundIdxPerson1].OrphanAllowance = oldPensionFund.OrphanAllowance;
            oldPensionFundIdxPerson1++;
          }
          else {
            this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows.push(new OldPensionFundRowObj());
            this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[oldPensionFundIdxPerson2].NameOfInsurance = oldPensionFund.NameOfInsurance;
            this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[oldPensionFundIdxPerson2].AllowanceAmount = oldPensionFund.AllowanceAmount;
            this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[oldPensionFundIdxPerson2].WidowsAllowance = oldPensionFund.WidowsAllowance;
            this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[oldPensionFundIdxPerson2].OrphanAllowance = oldPensionFund.OrphanAllowance;
            oldPensionFundIdxPerson2++;
          }
        })

        if (this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.length == 0)
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.push(new OldPensionFundRowObj);

        if (this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows.length == 0)
          this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows.push(new OldPensionFundRowObj);

        this.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.length; i++) {
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts += (this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[i].AllowanceAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[i].AllowanceAmount.replace(',', '')) : 0);
        }

        this.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts = 0;

        for (let i = 0; i < this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows.length; i++) {
          this.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts += (this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[i].AllowanceAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows[i].AllowanceAmount.replace(',', '')) : 0);
        }


        let socialSecurityBenefitsIdxPerson1 = 0;
        let socialSecurityBenefitsIdxPerson2 = 0;
        financeAdvisor.SocialSecurityBenefits.forEach((socialSecurityBenefits: any) => {
          //console.log("socialSecurityBenefits - " + JSON.stringify(socialSecurityBenefits));
          if (socialSecurityBenefits.PersonID == Person1ID) {
            this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[socialSecurityBenefitsIdxPerson1].Amount = socialSecurityBenefits.Amount;
            socialSecurityBenefitsIdxPerson1++;
          }
          else {
            this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[socialSecurityBenefitsIdxPerson2].Amount = socialSecurityBenefits.Amount;
            socialSecurityBenefitsIdxPerson2++;
          }
        })

        this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts = 0;

        for (let i = 0; i < 3; i++) {
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts += (this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[i].Amount.replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[i].Amount.replace(',', '')) : 0);
        }

        this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts = 0;

        for (let i = 0; i < 3; i++) {
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts += (this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[i].Amount.replace(',', '') != "" ? parseFloat(this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[i].Amount.replace(',', '')) : 0);
        }

        let pensionJointIdx = 0;
        this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows = [];

        financeAdvisor.PensionJoint.forEach((pensionJoint: any) => {
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows.push(new PensionJointRowObj());
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[pensionJointIdx].NameOfInsurance = pensionJoint.NameOfInsurance;
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[pensionJointIdx].Amount = pensionJoint.Amount;
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[pensionJointIdx].Comment = pensionJoint.Comment;
          pensionJointIdx++;
        })

        if (this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows.length == 0)
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows.push(new PensionJointRowObj);

        resolve("");
      })

    })
  }

  LoadAllUserInfoByUserID(userId: number) {
    return new Promise((resolve, reject) => {

      var jsonGetFinanceAdvisorByUser = "";
      var jsonGetPersonalDataByUser = "";
      var jsonGetChildrenByPersonID = "";
      var jsonGetRelativesByParentsID = "";
      var jsonGetChildrenByPersonID = "";
      var jsonGetIncomesByPersonID = "";
      var jsonGetIncomesExByPersonID = "";
      var jsonGetFixedExpensesByUserID = "";
      var jsonGetSavingByUserID = "";
      var jsonGetRealEstatesByUserID = "";
      var jsonGetVehiclesByUserID = "";
      var jsonGetFinanceLiquidityAssetByUserID = "";
      var jsonGetFinanceUnliquidityAssetByUserID = "";
      var jsonGetCommitmentsByUserID = "";
      var jsonGetCurrentFlowByUserID = "";
      var jsonGetMortgagesByUserID = "";
      var jsonGetLifeInsuranceByPersonID = "";
      var jsonGetLifeLongCareInsurancesInHealthByPersonID = "";
      var jsonGetLifeLongCareInsurancesInInsuranceCompanyByPersonID = "";
      var jsonGetVariableExpensesByUserID = "";
      var jsonGetManagerInsurancePersonID = "";
      var jsonGetPensionFundPersonID = "";
      var jsonGetGemelPersonID = "";
      var jsonGetOldPensionFundPersonID = "";
      var jsonGetSocialSecurityBenefitsPersonID = "";
      var jsonGetPensionJointUserID = "";
      var jsonGetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID = "";
      var jsonGetHealthInsuranceByUserID = "";
      var jsonGetRepetitiveGoalsByUserID = "";
      var jsonGetEconomicalStabilityByUserID = "";
      var jsonGetIncomesGoalByUserID = "";
      var jsonGetOneOffFamilyGoalByUserID = "";
      var jsonGetLossOfWorkingCapacityPersonID = "";

      var UserID = userId;
      var Person1ID = 0;
      var Person2ID = 0;

      this.apiService.GetFinanceAdvisorByUser(UserID).subscribe((data: any) => {
        //console.log(data.res);
        jsonGetFinanceAdvisorByUser = data.res;
        const jsonObject = JSON.parse(data.res);

        // GetPersonalDataByUser
        this.apiService.GetPersonalDataByUser(UserID).subscribe((data: any) => {
          //console.log(data.res);
          jsonGetPersonalDataByUser = data.res;
          const jsonObject = JSON.parse(data.res);
          jsonObject.forEach((element: any) => {
            //console.log("\n" + element + "\n");
            if (element.IsPrimary) {
              Person1ID = element.Id;
            }
            else {
              Person2ID = element.Id;
            }
          });

          // GetChildrenByPersonID
          this.apiService.GetChildrenByPersonID(Person1ID).subscribe((data: any) => {
            //console.log(data.res);
            jsonGetChildrenByPersonID = data.res;
            const jsonObject = JSON.parse(data.res);
            /*             jsonObject.forEach((element: any) => {
                          console.log("\n" + element + "\n");
                        });
             */
            // GetRelativesByPersonID
            this.apiService.GetRelativesByParentsID(Person1ID, Person2ID).subscribe((data: any) => {
              console.log(data.res);
              jsonGetRelativesByParentsID = data.res;
              const jsonObject = JSON.parse(data.res);
              /*               jsonObject.forEach((element: any) => {
                              console.log("\n" + element + "\n");
                            });
               */

              this.apiService.GetLossOfWorkingCapacityPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                console.log(data.res);
                jsonGetLossOfWorkingCapacityPersonID = data.res;
                const jsonObject = JSON.parse(data.res);

                // GetIncomesByPersonID
                this.apiService.GetIncomesByPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                  console.log(data.res);
                  jsonGetIncomesByPersonID = data.res;
                  const jsonObject = JSON.parse(data.res);
                  /*                 jsonObject.forEach((element: any) => {
                                    console.log("\n" + element + "\n");
                                  });
                   */
                  // GetIncomesExByPersonID
                  this.apiService.GetIncomesExByPersonID(UserID).subscribe((data: any) => {
                    console.log(data.res);
                    jsonGetIncomesExByPersonID = data.res;
                    const jsonObject = JSON.parse(data.res);
                    /*                   jsonObject.forEach((element: any) => {
                                        console.log("\n" + element + "\n");
                                      });
                     */
                    // GetFixedExpensesByUserID
                    this.apiService.GetFixedExpensesByUserID(UserID).subscribe((data: any) => {
                      console.log(data.res);
                      jsonGetFixedExpensesByUserID = data.res;
                      const jsonObject = JSON.parse(data.res);
                      /*                     jsonObject.forEach((element: any) => {
                                            console.log("\n" + element + "\n");
                                          });
                       */
                      // GetSavingByUserID
                      this.apiService.GetSavingByUserID(UserID).subscribe((data: any) => {
                        console.log(data.res);
                        jsonGetSavingByUserID = data.res;
                        const jsonObject = JSON.parse(data.res);
                        /*                    jsonObject.forEach((element: any) => {
                                             console.log("\n" + element + "\n");
                                           });
                      */
                        // GetRealEstatesByUserID
                        this.apiService.GetRealEstatesByUserID(UserID).subscribe((data: any) => {
                          console.log(data.res);
                          jsonGetRealEstatesByUserID = data.res;
                          const jsonObject = JSON.parse(data.res);
                          /*                         jsonObject.forEach((element: any) => {
                                                    console.log("\n" + element + "\n");
                                                  });
                           */
                          // GetVehiclesByUserID
                          this.apiService.GetVehiclesByUserID(UserID).subscribe((data: any) => {
                            console.log(data.res);
                            jsonGetVehiclesByUserID = data.res;
                            const jsonObject = JSON.parse(data.res);
                            /*                        jsonObject.forEach((element: any) => {
                                                     console.log("\n" + element + "\n");
                                                   });
                          */
                            // GetFinanceLiquidityAssetByUserID
                            this.apiService.GetFinanceLiquidityAssetByUserID(UserID).subscribe((data: any) => {
                              console.log(data.res);
                              jsonGetFinanceLiquidityAssetByUserID = data.res;
                              const jsonObject = JSON.parse(data.res);
                              /*                             jsonObject.forEach((element: any) => {
                                                            console.log("\n" + element + "\n");
                                                          });
                               */
                              // GetFinanceUnliquidityAssetByUserID
                              this.apiService.GetFinanceUnliquidityAssetByUserID(UserID).subscribe((data: any) => {
                                console.log(data.res);
                                jsonGetFinanceUnliquidityAssetByUserID = data.res;
                                const jsonObject = JSON.parse(data.res);
                                /*                            jsonObject.forEach((element: any) => {
                                                             console.log("\n" + element + "\n");
                                                           });
                              */
                                // GetCommitmentsByUserID
                                this.apiService.GetCommitmentsByUserID(UserID).subscribe((data: any) => {
                                  console.log(data.res);
                                  jsonGetCommitmentsByUserID = data.res;
                                  const jsonObject = JSON.parse(data.res);
                                  /*                                 jsonObject.forEach((element: any) => {
                                                                    console.log("\n" + element + "\n");
                                                                  });
                                   */

                                  this.apiService.GetCurrentFlowByUserID(UserID).subscribe((data: any) => {
                                    console.log(data.res);
                                    jsonGetCurrentFlowByUserID = data.res;
                                    const jsonObject = JSON.parse(data.res);

                                    // GetMortgagesByUserID
                                    this.apiService.GetMortgagesByUserID(UserID).subscribe((data: any) => {
                                      console.log(data.res);
                                      jsonGetMortgagesByUserID = data.res;
                                      const jsonObject = JSON.parse(data.res);
                                      /*                                jsonObject.forEach((element: any) => {
                                                                       console.log("\n" + element + "\n");
                                                                     });
                                    */
                                      // GetLifeInsuranceByPersonID
                                      this.apiService.GetLifeInsuranceByPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                        console.log(data.res);
                                        jsonGetLifeInsuranceByPersonID = data.res;
                                        const jsonObject = JSON.parse(data.res);
                                        /*                                     jsonObject.forEach((element: any) => {
                                                                              console.log("\n" + element + "\n");
                                                                            });
                                         */

                                        // GetOldPensionFundUserID
                                        this.apiService.GetOldPensionFundPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                          console.log(data.res);
                                          jsonGetOldPensionFundPersonID = data.res;
                                          const jsonObject = JSON.parse(data.res);
                                          /*                                       jsonObject.forEach((element: any) => {
                                                                                  console.log("\n" + element + "\n");
                                                                                });
                                           */
                                          // GetSocialSecurityBenefitsPersonID
                                          this.apiService.GetSocialSecurityBenefitsPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                            console.log(data.res);
                                            jsonGetSocialSecurityBenefitsPersonID = data.res;
                                            const jsonObject = JSON.parse(data.res);
                                            /*                                         jsonObject.forEach((element: any) => {
                                                                                      console.log("\n" + element + "\n");
                                                                                    });
                                             */
                                            // GetPensionJointUserID
                                            this.apiService.GetPensionJointUserID(UserID).subscribe((data: any) => {
                                              console.log(data.res);
                                              jsonGetPensionJointUserID = data.res;
                                              const jsonObject = JSON.parse(data.res);
                                              /*                                           jsonObject.forEach((element: any) => {
                                                                                          console.log("\n" + element + "\n");
                                                                                        });
                                               */
                                              // GetPensionFundPersonID
                                              this.apiService.GetPensionFundPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                                console.log(data.res);
                                                jsonGetPensionFundPersonID = data.res;
                                                const jsonObject = JSON.parse(data.res);

                                                this.apiService.GetGemelPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                                  console.log(data.res);
                                                  jsonGetGemelPersonID = data.res;
                                                  const jsonObject = JSON.parse(data.res);
                                                  /*                                             jsonObject.forEach((element: any) => {
                                                                                                console.log("\n" + element + "\n");
                                                                                              });
                                                   */
                                                  // GetManagerInsurancePersonID
                                                  this.apiService.GetManagerInsurancePersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                                    console.log(data.res);
                                                    jsonGetManagerInsurancePersonID = data.res;
                                                    const jsonObject = JSON.parse(data.res);
                                                    /*                                               jsonObject.forEach((element: any) => {
                                                                                                    console.log("\n" + element + "\n");
                                                                                                  });
                                                     */
                                                    // GetVariableExpensesByUserID
                                                    this.apiService.GetVariableExpensesByUserID(UserID).subscribe((data: any) => {
                                                      console.log(data.res);
                                                      jsonGetVariableExpensesByUserID = data.res;
                                                      console.log("jsonGetVariableExpensesByUserID - " + jsonGetVariableExpensesByUserID);
                                                      const jsonObject = JSON.parse(data.res);
                                                      /*                                                 jsonObject.forEach((element: any) => {
                                                                                                        console.log("\n" + element + "\n");
                                                                                                      });
                                                       */
                                                      // GetLifeLongCareInsurancesInHealthByPersonID
                                                      this.apiService.GetLifeLongCareInsurancesInHealthByPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                                        console.log(data.res);
                                                        jsonGetLifeLongCareInsurancesInHealthByPersonID = data.res;
                                                        const jsonObject = JSON.parse(data.res);
                                                        /* jsonObject.forEach((element: any) => {
                                                          console.log("\n" + element + "\n");
                                                        }); */

                                                        // GetLifeLongCareInsurancesInInsuranceCompanyByPersonID
                                                        this.apiService.GetLifeLongCareInsurancesInInsuranceCompanyByPersonID(Person1ID, Person2ID).subscribe((data: any) => {
                                                          console.log(data.res);
                                                          jsonGetLifeLongCareInsurancesInInsuranceCompanyByPersonID = data.res;
                                                          const jsonObject = JSON.parse(data.res);
                                                          /* jsonObject.forEach((element: any) => {
                                                            console.log("\n" + element + "\n");
                                                          }); */

                                                          // LifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID
                                                          this.apiService.GetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID(UserID).subscribe((data: any) => {
                                                            console.log(data.res);
                                                            jsonGetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID = data.res;
                                                            const jsonObject = JSON.parse(data.res);
                                                            /* jsonObject.forEach((element: any) => {
                                                              console.log("\n" + element + "\n");
                                                            }); */

                                                            // GetHealthInsuranceByUserID
                                                            this.apiService.GetHealthInsuranceByUserID(UserID).subscribe((data: any) => {
                                                              console.log(data.res);
                                                              jsonGetHealthInsuranceByUserID = data.res;
                                                              const jsonObject = JSON.parse(data.res);
                                                              /* jsonObject.forEach((element: any) => {
                                                                console.log("\n" + element + "\n");
                                                              }); */

                                                              this.apiService.GetRepetitiveGoalsByUserID(UserID).subscribe((data: any) => {
                                                                console.log(data.res);
                                                                jsonGetRepetitiveGoalsByUserID = data.res;
                                                                const jsonObject = JSON.parse(data.res);
                                                                /* jsonObject.forEach((element: any) => {
                                                                  console.log("\n" + element + "\n");
                                                                }); */

                                                                this.apiService.GetEconomicalStabilityByUserID(UserID).subscribe((data: any) => {
                                                                  console.log("EconomicalStability - " + data.res);
                                                                  jsonGetEconomicalStabilityByUserID = data.res;
                                                                  const jsonObject = JSON.parse(data.res);
                                                                  /* jsonObject.forEach((element: any) => {
                                                                    console.log("\n" + element + "\n");
                                                                  }); */

                                                                  this.apiService.GetIncomesGoalByUserID(UserID).subscribe((data: any) => {
                                                                    console.log(data.res);
                                                                    jsonGetIncomesGoalByUserID = data.res;
                                                                    const jsonObject = JSON.parse(data.res);
                                                                    /*  jsonObject.forEach((element: any) => {
                                                                       console.log("\n" + element + "\n");
                                                                     }); */

                                                                    this.apiService.GetOneOffFamilyGoalByUserID(UserID).subscribe((data: any) => {
                                                                      console.log(data.res);
                                                                      jsonGetOneOffFamilyGoalByUserID = data.res;
                                                                      const jsonObject = JSON.parse(data.res);

                                                                      let mergedJson = this.jsonStringsService.MergeJsonStrings({
                                                                        FinanceAdvisor: jsonGetFinanceAdvisorByUser,
                                                                        PersonalData: jsonGetPersonalDataByUser,
                                                                        Children: jsonGetChildrenByPersonID,
                                                                        Relatives: jsonGetRelativesByParentsID,
                                                                        Incomes: jsonGetIncomesByPersonID,
                                                                        IncomesEx: jsonGetIncomesExByPersonID,
                                                                        FixedExpenses: jsonGetFixedExpensesByUserID,
                                                                        Saving: jsonGetSavingByUserID,
                                                                        RealEstates: jsonGetRealEstatesByUserID,
                                                                        Vehicles: jsonGetVehiclesByUserID,
                                                                        FinanceLiquidityAsset: jsonGetFinanceLiquidityAssetByUserID,
                                                                        FinanceUnliquidityAsset: jsonGetFinanceUnliquidityAssetByUserID,
                                                                        Commitments: jsonGetCommitmentsByUserID,
                                                                        CurrentFlow: jsonGetCurrentFlowByUserID,
                                                                        Mortgages: jsonGetMortgagesByUserID,
                                                                        LifeInsurance: jsonGetLifeInsuranceByPersonID,
                                                                        LifeLongCareInsurancesInHealth: jsonGetLifeLongCareInsurancesInHealthByPersonID,
                                                                        LifeLongCareInsurancesInInsuranceCompany: jsonGetLifeLongCareInsurancesInInsuranceCompanyByPersonID,
                                                                        VariableExpenses: jsonGetVariableExpensesByUserID,
                                                                        ManagerInsurance: jsonGetManagerInsurancePersonID,
                                                                        PensionFund: jsonGetPensionFundPersonID,
                                                                        Gemel: jsonGetGemelPersonID,
                                                                        OldPensionFund: jsonGetOldPensionFundPersonID,
                                                                        SocialSecurityBenefits: jsonGetSocialSecurityBenefitsPersonID,
                                                                        PensionJoint: jsonGetPensionJointUserID,
                                                                        LifeLongCareInsurancesInInsuranceCompany4Childrens: jsonGetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID,
                                                                        HealthInsurance: jsonGetHealthInsuranceByUserID,
                                                                        RepetitiveGoals: jsonGetRepetitiveGoalsByUserID,
                                                                        EconomicalStability: jsonGetEconomicalStabilityByUserID,
                                                                        IncomesGoal: jsonGetIncomesGoalByUserID,
                                                                        OneOffFamilyGoals: jsonGetOneOffFamilyGoalByUserID,
                                                                        LossOfWorkingCapacity: jsonGetLossOfWorkingCapacityPersonID
                                                                      });

                                                                      //console.log("merge json - " + mergedJson);

                                                                      resolve(mergedJson);
                                                                    });
                                                                  });
                                                                });
                                                              });
                                                            });
                                                          });
                                                        });
                                                      });
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  Save2DB() {

    return new Promise((resolve, reject) => {

      var variableExpensesCategoryRowObj: VariableExpensesRows4Json[] = [];
      for (let c = 0; c < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; c++) {
        for (let s = 0; s < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj.length; s++) {
          let variableExpensesRow = new VariableExpensesRows4Json();
          variableExpensesRow.Anchor = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].Anchor;
          variableExpensesRow.CategoryIndex = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].CategoryIndex;
          variableExpensesRow.CategoryName = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].CategoryName;
          variableExpensesRow.CurrExpense = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].CurrExpense;
          variableExpensesRow.DefferenceExpense = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].DefferenceExpense;
          variableExpensesRow.Flexible = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].Flexible;
          variableExpensesRow.GoodToBe = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].GoodToBe;
          variableExpensesRow.SatisfactionExpense = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].SatisfactionExpense;
          variableExpensesRow.SubCategoryIndex = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].SubCategoryIndex;
          variableExpensesRow.SubType = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].SubType;
          variableExpensesRow.Type = this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[c].VariableExpensesRowObj[s].Type;
          variableExpensesCategoryRowObj.push(variableExpensesRow);
        }
      }

      let incomesGoalsRowsObj = new Array<IncomesGoalsRowsObj>();
      this.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.forEach(element => {
        let incomesGoalsRowObj = new IncomesGoalsRowsObj();
        incomesGoalsRowObj.IncomeSrc = element.IncomeSrc;
        incomesGoalsRowObj.ReturnOnSavings = this.AllInfo.IncomesGoalsViewInfo.ReturnOnSavings;
        element.AmountInYear.forEach((element2, idx) => {
          incomesGoalsRowObj.AmountInYear += `|${idx}@${element2}|`;
        });
        incomesGoalsRowsObj.push(incomesGoalsRowObj);
      });

/*  */      console.log("incomesGoalsRowsObj - " + incomesGoalsRowsObj);
      const incomesGoalClean = JSON.stringify(incomesGoalsRowsObj);
/*  */      console.log("incomesGoalClean - " + incomesGoalClean);
      /*  */
      let oneOffFamilyGoalsRowsObj = new Array<OneOffFamilyGoalsRowsObj>();
      this.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows.forEach((element, idx) => {
        let oneOffFamilyGoalsRowObj = new OneOffFamilyGoalsRowsObj();
        oneOffFamilyGoalsRowObj.CumulativeReturnOnInvestment = "";
        oneOffFamilyGoalsRowObj.PutAside = "";
        oneOffFamilyGoalsRowObj.SavingsExistForChildren = "";
        oneOffFamilyGoalsRowObj.DepositFromFundsOneOffFamilyGoalsRow = "";
        oneOffFamilyGoalsRowObj.AdditionalDepositOneOffFamilyGoalsRow = "";
        element.AmountInYear.forEach((element2, idx2) => {
          if (element2 != "") {
            oneOffFamilyGoalsRowObj.AmountInYear += `|${idx}@${idx2}@${element2}|`;
          }
        });
        oneOffFamilyGoalsRowsObj.push(oneOffFamilyGoalsRowObj);
      });

      let oneOffFamilyGoalsRowObj = new OneOffFamilyGoalsRowsObj();
      oneOffFamilyGoalsRowObj.CumulativeReturnOnInvestment = this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment;
      oneOffFamilyGoalsRowObj.PutAside = this.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside;
      oneOffFamilyGoalsRowObj.SavingsExistForChildren = this.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren;
      oneOffFamilyGoalsRowObj.AdditionalDepositOneOffFamilyGoalsRow = "";
      oneOffFamilyGoalsRowObj.AmountInYear = "";
      this.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear.forEach((element, idx) => {
        oneOffFamilyGoalsRowObj.DepositFromFundsOneOffFamilyGoalsRow += `|${idx}@${element}|`;
      });
      oneOffFamilyGoalsRowsObj.push(oneOffFamilyGoalsRowObj);

      /*       console.log("oneOffFamilyGoalsRowsObj - " + oneOffFamilyGoalsRowsObj);
            let oneOffFamilyGoalsClean = JSON.stringify(oneOffFamilyGoalsRowsObj);
            console.log("oneOffFamilyGoalsClean - " + oneOffFamilyGoalsClean);
       */
      oneOffFamilyGoalsRowObj = new OneOffFamilyGoalsRowsObj();
      oneOffFamilyGoalsRowObj.CumulativeReturnOnInvestment = this.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment;
      oneOffFamilyGoalsRowObj.PutAside = this.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside;
      oneOffFamilyGoalsRowObj.SavingsExistForChildren = this.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren;
      oneOffFamilyGoalsRowObj.DepositFromFundsOneOffFamilyGoalsRow = "";
      oneOffFamilyGoalsRowObj.AmountInYear = "";
      this.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear.forEach((element, idx) => {
        oneOffFamilyGoalsRowObj.AdditionalDepositOneOffFamilyGoalsRow += `|${idx}@${element}|`;
      });
      oneOffFamilyGoalsRowsObj.push(oneOffFamilyGoalsRowObj);

      const oneOffFamilyGoalsClean = JSON.stringify(oneOffFamilyGoalsRowsObj);

      /*     console.log("oneOffFamilyGoalsRowsObj - " + oneOffFamilyGoalsRowsObj);
          oneOffFamilyGoalsClean = JSON.stringify(oneOffFamilyGoalsRowsObj);
          console.log("oneOffFamilyGoalsClean - " + oneOffFamilyGoalsClean);
    
     */

      this.AllInfo.VehiclesViewInfo.VehiclesRows.forEach(element => {
        element.Comment = this.AllInfo.VehiclesViewInfo.PriceOfFuel;
      });

      const personalDataClean = JSON.stringify(this.AllInfo.PersonalDataViewInfo);
      //console.log("PersonalData - " + personalDataClean);
      const relativeClean = JSON.stringify(this.AllInfo.RelativeViewInfo);
      //console.log("Relative - " + relativeClean);
      const lossOfWorkingCapacityClean = JSON.stringify(this.AllInfo.LossOfWorkingCapacity);

      const income1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.IncomesViewInfo.IncomeRows[0]), "Type");
      //console.log("income1 - " + income1Clean);
      const income2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.IncomesViewInfo.IncomeRows[1]), "Type");
      //console.log("income2 - " + income2Clean);
      const incomeExClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.IncomesViewInfo.IncomeExRows), "Type");
      //console.log("incomeEx - " + incomeExClean);
      const fixedExpenseClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows), "Type");
      //console.log("fixedExpense - " + fixedExpenseClean);
      /*       const variableExpensesClean = JSON.stringify(this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj);
       */
      const variableExpensesClean = JSON.stringify(variableExpensesCategoryRowObj);
      //console.log("variableExpenses - " + variableExpensesClean);
      const realEstateClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.RealEstateViewInfo.RealEstateRows), "Description");
      //console.log("RealEstate - " + realEstateClean);
      const vehiclesClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.VehiclesViewInfo.VehiclesRows), "Description");
      //console.log("Vehicles - " + vehiclesClean);
      const financeUnliquidityAssetsClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows), "DescriptionSaving");
      //console.log("FinanceUnliquidityAssets - " + financeUnliquidityAssetsClean);
      const financeLiquidityAssetsClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows), "DescriptionSaving");
      //console.log("FinanceLiquidityAssets - " + financeLiquidityAssetsClean);
      const commitmentsClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.CommitmentsViewInfo.CommitmentsRows), "TheLender");
      //console.log("Commitments - " + commitmentsClean);
      const currentFlowClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.CurrentFlowViewInfo.itemsRows), "Date");

      const savingClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.SavingViewInfo.SavingRows), "Type");
      //console.log("Saving - " + savingClean);
      const mortgagesClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.MortgagesViewInfo.MortgagesRows), "Name");
      //console.log("Mortgages - " + mortgagesClean);
      const lifeInsurance1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0]), "Name");
      //console.log("LifeInsurance1 - " + lifeInsurance1Clean);
      const lifeInsurance2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1]), "Name");
      //console.log("LifeInsurance2 - " + lifeInsurance2Clean);
      const lifeLongCareInsurancesInInsuranceCompany1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0]), "Name");
      //console.log("LifeLongCareInsurancesInInsurance1Company - " + lifeLongCareInsurancesInInsuranceCompany1Clean);
      const lifeLongCareInsurancesInInsuranceCompany2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1]), "Name");
      //console.log("LifeLongCareInsurancesInInsurance2Company - " + lifeLongCareInsurancesInInsuranceCompany2Clean);
      const lifeLongCareInsurancesInInsuranceCompany4ChildrensClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows), "Name");
      //console.log("LifeLongCareInsurancesInInsuranceCompany4Childrens - " + lifeLongCareInsurancesInInsuranceCompany4ChildrensClean);
      const lifeLongCareInsurancesInHealthFundClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund), "Name");
      //console.log("LifeLongCareInsurancesInHealthFundClean - " + lifeLongCareInsurancesInHealthFundClean);
      const healthInsuranceClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows), "NameOfInsured");
      //console.log("HealthInsurance - " + healthInsuranceClean);
      const managerInsurance1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows), "NameOfInsurance");
      ///console.log("ManagerInsurance1 - " + managerInsurance1Clean);
      const managerInsurance2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows), "NameOfInsurance");
      //console.log("ManagerInsurance2 - " + managerInsurance2Clean);
      const pensionFund1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows), "NameOfInsurance");
      //console.log("PensionFund1 - " + pensionFund1Clean);
      const pensionFund2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows), "NameOfInsurance");
      //console.log("ManagerInsurance2 - " + managerInsurance2Clean);
      const gemel1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.Gemel[0].GemelRows), "NameOfInsurance");
      //console.log("PensionFund1 - " + pensionFund1Clean);
      const gemel2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.Gemel[1].GemelRows), "NameOfInsurance");
      //console.log("PensionFund2 - " + pensionFund2Clean);
      const oldPensionFund1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows), "NameOfInsurance");
      //console.log("OldPensionFund1 - " + oldPensionFund1Clean);
      const oldPensionFund2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows), "NameOfInsurance");
      //console.log("OldPensionFund2 - " + oldPensionFund2Clean);
      const socialSecurityBenefits1Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows), "NameOfInsurance");
      //console.log("OldPensionFund1 - " + oldPensionFund1Clean);
      const socialSecurityBenefits2Clean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows), "NameOfInsurance");
      //console.log("OldPensionFund2 - " + oldPensionFund2Clean);
      const pensionJointClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows), "NameOfInsurance");
      //console.log("PensionJoint - " + pensionJointClean);
      const repetitiveGoalsClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows), "NameOfGoal");

      const economicalStabilityClean = JSON.stringify(this.AllInfo.EconomicalStabilityViewInfo);
      //const EconomicalStabilityClean = this.RemoveElementsWithCondition(JSON.stringify(this.AllInfo.EconomicalStabilityViewInfo), "NameOfInsurance");

      let mergedJson = this.jsonStringsService.MergeJsonStrings(
        {
          PersonalData: personalDataClean,
          Relative: relativeClean,
          Income1: income1Clean,
          Income2: income2Clean,
          incomeEx: incomeExClean,
          FixedExpense: fixedExpenseClean,
          VariableExpenses: variableExpensesClean,
          RealEstate: realEstateClean,
          Vehicles: vehiclesClean,
          FinanceUnliquidityAssets: financeUnliquidityAssetsClean,
          FinanceLiquidityAssets: financeLiquidityAssetsClean,
          Commitments: commitmentsClean,
          CurrentFlow: currentFlowClean,
          Saving: savingClean,
          Mortgages: mortgagesClean,
          LifeInsurance1: lifeInsurance1Clean,
          LifeInsurance2: lifeInsurance2Clean,
          LifeLongCareInsurancesInInsurance1Company: lifeLongCareInsurancesInInsuranceCompany1Clean,
          LifeLongCareInsurancesInInsurance2Company: lifeLongCareInsurancesInInsuranceCompany2Clean,
          LifeLongCareInsurancesInInsuranceCompany4Childrens: lifeLongCareInsurancesInInsuranceCompany4ChildrensClean,
          LifeLongCareInsurancesInHealthFund: lifeLongCareInsurancesInHealthFundClean,
          HealthInsurance: healthInsuranceClean,
          ManagerInsurance1: managerInsurance1Clean,
          ManagerInsurance2: managerInsurance2Clean,
          PensionFund1: pensionFund1Clean,
          PensionFund2: pensionFund2Clean,
          Gemel1: gemel1Clean,
          Gemel2: gemel2Clean,
          OldPensionFund1: oldPensionFund1Clean,
          OldPensionFund2: oldPensionFund2Clean,
          SocialSecurityBenefits1: socialSecurityBenefits1Clean,
          SocialSecurityBenefits2: socialSecurityBenefits2Clean,
          PensionJoint: pensionJointClean,
          RepetitiveGoals: repetitiveGoalsClean,
          EconomicalStability: economicalStabilityClean,
          IncomesGoal: incomesGoalClean,
          OneOffFamilyGoals: oneOffFamilyGoalsClean,
          LossOfWorkingCapacity: lossOfWorkingCapacityClean
        });

      //console.log(JSON.stringify(mergedJson).replace(/\\/g, '').replace(/^"/, '').replace(/"$/, ''));

      if (
        this.AllInfo.PersonalDataViewInfo.Mail != "" &&
        this.AllInfo.PersonalDataViewInfo.Id != "" &&
        this.AllInfo.PersonalDataViewInfo.Name1 != "" &&
        this.AllInfo.PersonalDataViewInfo.Age1 != "" &&
        this.AllInfo.PersonalDataViewInfo.SelectedSex1 != "בחר ..." &&
        this.AllInfo.PersonalDataViewInfo.SelectedStatus1 != "בחר ..." &&
        this.AllInfo.PersonalDataViewInfo.RetirementAge1 != "" &&
        this.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome != "" &&
        this.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad != "" &&
        this.AllInfo.PersonalDataViewInfo.AnnualInterest != "" &&
        this.AllInfo.PersonalDataViewInfo.Unplanned != "") {
        if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "נשוי") {
          if (this.AllInfo.PersonalDataViewInfo.Age2 != "" &&
            this.AllInfo.PersonalDataViewInfo.SelectedSex2 != "בחר ..." &&
            this.AllInfo.PersonalDataViewInfo.RetirementAge2 != "") {
            this.apiService.SendCurrProjectToServer(JSON.stringify(mergedJson).replace(/\\/g, '').replace(/^"/, '').replace(/"$/, '')).subscribe((data: any) => {
              console.log("Save information successed1");
              resolve("");
            });
          }
        }
        else {
          this.apiService.SendCurrProjectToServer(JSON.stringify(mergedJson).replace(/\\/g, '').replace(/^"/, '').replace(/"$/, '')).subscribe((data: any) => {
            console.log("Save information successed2");
            resolve("Save information successed2");
          });
        }
      }
      else {
        reject("Information uncomplete.");
      }
    });
  }

  CalcPaymentOfAlimony() {
    for (let element of this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows) {
      if (element.Type == "מזונות") {
        this.AllInfo.CalculateData.PaymentOfAlimony = element.FixedMonthly.replace(',', '');
        return parseInt(element.FixedMonthly.replace(',', ''));
      }
    }
    this.AllInfo.CalculateData.PaymentOfAlimony = "";
    return 0; // Return a default value if the condition is not met
  }





  DoReportEnglish() {

    let incomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
      (this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
      (this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    let allIncomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0));
    this.AllInfo.CalculateData.SumIncomes = (allIncomes - (netIncomes - incomes)).toFixed(0).toString();
    this.AllInfo.CalculateData.SumNetIncomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0)).toFixed(0).toString();

    incomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    netIncomes = ((this.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
      (this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
      (this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    this.AllInfo.CalculateData.IncomesEx = (netIncomes - incomes).toFixed(0).toString();

    this.AllInfo.CalculateData.SumExpenses = (this.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();


    let buildVariableExpensesHebrew = "";
    buildVariableExpensesHebrew = `
#### הוצאות משתנות :####
`;

    this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach(element => {
      if (parseInt(element.CalcSum().replace(',', '')) != 0)
        buildVariableExpensesHebrew += `${element.CategoryName} : ${parseInt(element.CalcSum().replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}
`;
    });

    let buildVariableExpenses = "";
    buildVariableExpenses = `
VARIABLE EXPENSES :
`;

    this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach(element => {
      if (parseInt(element.CalcSum().replace(',', '')) != 0)
        buildVariableExpenses += `${parseInt(element.CalcSum().replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })} :${element.CategoryName}
`;
    });

    this.AllInfo.CalculateData.SumVariableExpenses = (this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();

    this.AllInfo.CalculateData.NetWorths = this.AllInfo.RealEstateViewInfo.NetWorths.toFixed(0).toString();

    let buildFixedExpensesHebrew = "";
    buildFixedExpensesHebrew = `
#### הוצאות קבועות :####
`;

    //let sumRentCostHebrew = 0;
    this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach(element => {
      if (element.FixedMonthly != "")
        buildFixedExpensesHebrew += `${element.Type} : ${parseInt(element.FixedMonthly.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}
`;
      else if (element.MonthlyAverage != "")
        buildFixedExpensesHebrew += `${element.Type} : ${parseInt(element.MonthlyAverage.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}
`;
      /* if (element.Type == "שכר דירה") {
        sumRentCostHebrew += parseInt(element.FixedMonthly.replace(',', ''));
      } */
    });


    let buildFixedExpenses = "";
    buildFixedExpenses = `
FIXED EXPENSES :
`;

    let sumRentCost = 0;
    this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach(element => {
      if (element.FixedMonthly != "")
        buildFixedExpenses += `${parseInt(element.FixedMonthly.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })} :${element.Type}
`;
      else if (element.MonthlyAverage != "")
        buildFixedExpenses += `${parseInt(element.MonthlyAverage.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })} :${element.Type}
`;
      if (element.Type == "שכר דירה") {
        sumRentCost += parseInt(element.FixedMonthly.replace(',', ''));
      }
    });

    this.AllInfo.CalculateData.RentCost = sumRentCost.toFixed(0).toString().replace(',', '');

    let sumManagerInsurance = 0;
    sumManagerInsurance += this.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances : 0;
    sumManagerInsurance += this.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances : 0;
    this.AllInfo.CalculateData.ManagerInsurance = sumManagerInsurance.toFixed(0).toString().replace(',', '')

    let sumSource1 = 0;

    sumSource1 += this.AllInfo.LossOfWorkingCapacity.SocialSecurity[0] != "" ? parseInt(this.AllInfo.LossOfWorkingCapacity.SocialSecurity[0]) : 0;
    sumSource1 += this.AllInfo.LossOfWorkingCapacity.PensionFund[0] != "" ? parseInt(this.AllInfo.LossOfWorkingCapacity.PensionFund[0]) : 0;
    sumSource1 += this.AllInfo.LossOfWorkingCapacity.ManagerInsurance[0] != "" ? parseInt(this.AllInfo.LossOfWorkingCapacity.ManagerInsurance[0]) : 0;
    sumSource1 += this.AllInfo.LossOfWorkingCapacity.PrivateInsurance[0] != "" ? parseInt(this.AllInfo.LossOfWorkingCapacity.PrivateInsurance[0]) : 0;

    this.AllInfo.LossOfWorkingCapacity.SumSource[0] = sumSource1;
    this.AllInfo.CalculateData.LossOfWorkingCapacity = Math.min(this.AllInfo.LossOfWorkingCapacity.SumSource[0], parseInt(this.AllInfo.LossOfWorkingCapacity.MaximumAmount[0] != "" ? this.AllInfo.LossOfWorkingCapacity.MaximumAmount[0] : "0")).toFixed(0).toString().replace(',', '');

    let sumPensia = 0;
    sumPensia += this.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances : 0;
    sumPensia += this.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances : 0;
    this.AllInfo.CalculateData.Pensia = sumPensia.toFixed(0).toString().replace(',', '')

    let sumGemel = 0;
    sumGemel += this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances : 0;
    sumGemel += this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances != 0 ? this.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances : 0;
    this.AllInfo.CalculateData.Gemel = sumGemel.toFixed(0).toString().replace(',', '')


    let sumOld = 0;
    sumOld += this.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts != 0 ? this.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts : 0;
    sumOld += this.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts != 0 ? this.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts : 0;
    this.AllInfo.CalculateData.Old = sumOld.toFixed(0).toString().replace(',', '') != "0" ? sumOld.toFixed(0).toString().replace(',', '') : "";

    let sumSocialSecurityBenefits = 0;
    sumSocialSecurityBenefits += this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts != 0 ? this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts : 0;
    sumSocialSecurityBenefits += this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts != 0 ? this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts : 0;
    this.AllInfo.CalculateData.SocialSecurityBenefits = sumSocialSecurityBenefits.toFixed(0).toString().replace(',', '')

    this.AllInfo.CalculateData.PensionProvisions = this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '');
    this.AllInfo.CalculateData.ProvisionsForFunds = this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '');

    this.AllInfo.CalculateData.Baltam = "";
    for (let element of this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.Comment.includes("בלתי מתוכנן")) {
        this.AllInfo.CalculateData.Baltam = element.CurrentAmount.replace(',', '');
      }
    }

    let sum = 0;
    for (let element of this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.Comment.includes("קרן חירום")) {
        sum += parseInt(element.CurrentAmount.replace(',', ''));
      }
    }
    this.AllInfo.CalculateData.SecurityFund = sum.toFixed(0).toString().replace(',', '');

    this.AllInfo.CalculateData.FutureExpenses = "";
    for (let element of this.AllInfo.SavingViewInfo.SavingRows) {
      if (element.Type == "הוצאות עתידיות") {
        this.AllInfo.CalculateData.FutureExpenses = element.CurrentAmount.replace(',', '');
      }
    }

    this.AllInfo.CalculateData.SumCryptoSaving = "";
    for (let element of this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.DescriptionSaving == "קריפטו") {
        this.AllInfo.CalculateData.SumCryptoSaving = element.CurrentAmount.replace(',', '');
      }
    }

    this.AllInfo.CalculateData.SumForexSaving = "";
    for (let element of this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.DescriptionSaving == "Forex") {
        this.AllInfo.CalculateData.SumForexSaving = element.CurrentAmount.replace(',', '');
      }
    }

    this.AllInfo.CalculateData.General = "";
    for (let element of this.AllInfo.SavingViewInfo.SavingRows) {
      if (element.Type == "חסכון כללי") {
        this.AllInfo.CalculateData.General = element.CurrentAmount.replace(',', '');
      }
    }

    let buildSavingHebrew = "";
    buildSavingHebrew = `
#### חיסכונות בהפקדה חודשית :####
`;

    this.AllInfo.SavingViewInfo.SavingRows.forEach(element => {
      if (element.FixedMonthly != "")
        buildSavingHebrew += `${element.Type} : ${parseInt(element.FixedMonthly.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}
`;
    });


    let buildSaving = "";
    buildSaving = `
SAVING WITH A MONTHLY DEPOSIT :
`;

    this.AllInfo.SavingViewInfo.SavingRows.forEach(element => {
      if (element.FixedMonthly != "")
        buildSaving += `${parseInt(element.FixedMonthly.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })} :${element.Type}
`;
    });


    this.AllInfo.CalculateData.LifeInsurances1 = this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0].toFixed(0);
    this.AllInfo.CalculateData.LifeInsurances2 = this.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1].toFixed(0);
    if (this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0] != undefined)
      this.AllInfo.CalculateData.LongTermCareCompany1 = this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0].toFixed(0);
    if (this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1] != undefined)
      this.AllInfo.CalculateData.LongTermCareCompany2 = this.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1].toFixed(0);

    this.AllInfo.CalculateData.VehiclesNetWorths = this.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString() != "0" ? this.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString() : "";

    this.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets = 0;
    for (let i = 0; i < this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length; i++) {
      this.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets += (this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }
    this.AllInfo.CalculateData.FinanceLiquidityAssets = this.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString() != "0" ? this.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString() : "";

    this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets = 0;
    for (let i = 0; i < this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.length; i++) {
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets += (this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }
    this.AllInfo.CalculateData.FinanceUnliquidityAssets = this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString() != "0" ? this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString() : "";

    this.AllInfo.CommitmentsViewInfo.CurrentAmount = 0;
    for (let i = 0; i < this.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
      this.AllInfo.CommitmentsViewInfo.CurrentAmount += (this.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '')) : 0);
    }
    this.AllInfo.CalculateData.CommitmentAmounts = (this.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();

    this.AllInfo.CalculateData.SumMortgages = (this.AllInfo.MortgagesViewInfo.RemainingMortgages.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.MortgagesViewInfo.RemainingMortgages.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();

    let buildMortgagesHebrew = "";
    buildMortgagesHebrew = `
נתוני משכנתה :
`;

    this.AllInfo.MortgagesViewInfo.MortgagesRows.forEach(element => {
      if (element.YearToEnd != "")
        buildMortgagesHebrew += `מסלול : ${element.Route}, סה"כ קרן : ${parseInt(element.CurrAmount.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}, שיעור ריבית : ${element.Interest}, מספר חודשים לסיום : ${element.YearToEnd}
`;
    });

    let buildMortgages = "";
    buildMortgages = `
MORTGAGE DATA :
`;

    this.AllInfo.MortgagesViewInfo.MortgagesRows.forEach(element => {
      if (element.YearToEnd != "")
        buildMortgages += `Route: ${element.Route}, Principal amount: ${parseInt(element.CurrAmount.replace(',', '')).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}, Interest rate: ${element.Interest}, Number of months until completion: ${element.YearToEnd}
`;
    });

    let currTemplate = "";
    let currTemplateHebrew = "";
    /*   currTemplate = `You are an expert finance advisor
  I am attaching complete financial data about my family.
  `; */

    /* VERY IMPORTANT:
    
    Can you provide guidance on managing my financial situation, particularly when it comes to my fixed expenses and variable expenses breakdown?
    Specifically, I would like to know how to optimize my variable expenses and reduce discretionary spending. 
    Please analyze my current financial data and suggest ways to optimize these specific categories.
    Give me an opinion on the financial situation and suggestions for more correct management if any.
    Please add as much financial data as possible in your answer
    End your answer by giving tasks to be performed that can improve the financial situation according to the data I gave.
    
    `; 
    */

    if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "נשוי") {
      currTemplateHebrew += `זוג בגילאי ${this.AllInfo.PersonalDataViewInfo.Age1} ו ${this.AllInfo.PersonalDataViewInfo.Age2}.`;
    }
    else {
      let status = "";
      if (this.AllInfo.PersonalDataViewInfo.SelectedSex1 == "זכר") {
        if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "רווק")
          status = "רווק";
        else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "גרוש")
          status = "גרוש";
        else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "אלמן")
          status = "אלמן";

        currTemplateHebrew +=
          `${status}, בן ${this.AllInfo.PersonalDataViewInfo.Age1} `;
      }
      else {
        if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "רווק")
          status = "רווקה";
        else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "גרוש")
          status = "גרושה";
        else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "אלמן")
          status = "אלמנה";

        currTemplateHebrew +=
          `${status}, בת ${this.AllInfo.PersonalDataViewInfo.Age1} `;
      }
    }

    if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "נשוי") {
      currTemplate += `A couple aged ${this.AllInfo.PersonalDataViewInfo.Age1} and ${this.AllInfo.PersonalDataViewInfo.Age2}.`;
    }
    else {
      let status = "";
      if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "רווק")
        status = "Single";
      else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "גרוש")
        status = "Divorced";
      else if (this.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "אלמן")
        status = "Widowed";

      currTemplate +=
        `${status}, ${this.AllInfo.PersonalDataViewInfo.Age1} years old`;
    }

    if (parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1) >= 2) {
      currTemplateHebrew += ` עם ${this.AllInfo.PersonalDataViewInfo.NumberOfChildren1} ילדים בגילאי `;
      for (let child of this.AllInfo.PersonalDataViewInfo.Child) {
        currTemplateHebrew += `${child.Age},`;
      }
      currTemplateHebrew = currTemplateHebrew.slice(0, -1);
      currTemplateHebrew += ".";
    }
    else if (parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1) == 1) {
      currTemplateHebrew += ` עם ילד בגיל ${this.AllInfo.PersonalDataViewInfo.Child[0].Age}.`;
    }

    if (parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1) >= 2) {
      currTemplate += ` with ${this.AllInfo.PersonalDataViewInfo.NumberOfChildren1} children aged `;
      for (let child of this.AllInfo.PersonalDataViewInfo.Child) {
        currTemplate += `${child.Age},`;
      }
      currTemplate = currTemplate.slice(0, -1);
      currTemplate += ".";
    }
    else if (parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1) == 1) {
      currTemplate += ` with child aged ${this.AllInfo.PersonalDataViewInfo.Child[0].Age}.`;
    }

    if (this.AllInfo.CalculateData.SumNetIncomes != "0")
      currTemplateHebrew += `
הכנסה נטו ${parseInt(this.AllInfo.CalculateData.SumNetIncomes).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else
      currTemplateHebrew += `
ללא הכנסה.`

    if (this.AllInfo.CalculateData.SumNetIncomes != "0")
      currTemplate += `
Net income of ${parseInt(this.AllInfo.CalculateData.SumNetIncomes).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No incomes.`

    if (this.AllInfo.CalculateData.IncomesEx != "0")
      currTemplateHebrew += `
הכנסה נוספת בסך שך  ${parseInt(this.AllInfo.CalculateData.IncomesEx).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else
      currTemplateHebrew += `
אין הכנסות נוספות.`

    if (this.AllInfo.CalculateData.IncomesEx != "0")
      currTemplate += `
Additional income of ${parseInt(this.AllInfo.CalculateData.IncomesEx).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No additional income.`

    if (this.AllInfo.CalculateData.PensionProvisions != "" && this.AllInfo.CalculateData.ProvisionsForFunds != "") {
      currTemplateHebrew += `
הפקדות לפנסיה מהעבודה בנוסף להכנסות הנטו בסך ${parseInt(this.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל `;
      currTemplateHebrew += `
והפקדות לקרן השתלמות בנוסף להכנסה הנטו בסך ${parseInt(this.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    }
    else if (this.AllInfo.CalculateData.ProvisionsForFunds != "" && this.AllInfo.CalculateData.ProvisionsForFunds == "")
      currTemplateHebrew += `
הפקדות לפנסיה מהעבודה בנוסף להכנסות הנטו בסך ${parseInt(this.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else if (this.AllInfo.CalculateData.ProvisionsForFunds == "" && this.AllInfo.CalculateData.ProvisionsForFunds != "")
      currTemplateHebrew += `
הפקדות לקרן השתלמות בנוסף להכנסה הנטו בסך ${parseInt(this.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else
      currTemplateHebrew += `
אין הפקדות לפנסיה ולקרן השתמות כלל.`;


    if (this.AllInfo.CalculateData.PensionProvisions != "" && this.AllInfo.CalculateData.ProvisionsForFunds != "") {
      currTemplate += `
Pension provisions from work in excess of net income in the amount of ${parseInt(this.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS `;
      currTemplate += `
And appropriations for the continuing education fund from work in excess of the net income 
in the amount of ${parseInt(this.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    }
    else if (this.AllInfo.CalculateData.ProvisionsForFunds != "" && this.AllInfo.CalculateData.ProvisionsForFunds == "")
      currTemplate += `
Pension provisions from work in excess of net income in the amount of ${parseInt(this.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else if (this.AllInfo.CalculateData.ProvisionsForFunds == "" && this.AllInfo.CalculateData.ProvisionsForFunds != "")
      currTemplate += `
Appropriations for the continuing education fund from work in excess of the net income in the amount of ${parseInt(this.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No provisions for pension and further education funds at all.`;


    if (this.AllInfo.CalculateData.ManagerInsurance != "0")
    {
      currTemplateHebrew += `
ביטוח מנהלים עם יכולת לקצבה חודשית בסך ${parseInt(this.AllInfo.CalculateData.ManagerInsurance).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    }
    
   /* else
      currTemplateHebrew += `
אין ביטוח מנהלים.`*/

if (this.AllInfo.CalculateData.Gemel != "0")
  currTemplateHebrew += `
קופת גמל עם יכולת לקצבה חודשית בסך ${parseInt(this.AllInfo.CalculateData.Gemel).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
else
  currTemplateHebrew += `
אין קופת גמל.`

    if (this.AllInfo.CalculateData.ManagerInsurance != "0")
      currTemplate += `
Executive insurance with the potential for a monthly allowance in the amount of  ${parseInt(this.AllInfo.CalculateData.ManagerInsurance).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No executive insurance.`


    if (this.AllInfo.CalculateData.Pensia != "0")
      currTemplateHebrew += `
קרן פנסיה עם פוטנציאל לקבלת קצבה חודשית בסך ${parseInt(this.AllInfo.CalculateData.Pensia).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else
      currTemplateHebrew += `
ללא פנסיה עתידית.`


    if (this.AllInfo.CalculateData.Pensia != "0")
      currTemplate += `
A Pension fund with the potential for a future monthly pension in the amount of  ${parseInt(this.AllInfo.CalculateData.Pensia).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No pension.`

    if (this.AllInfo.CalculateData.SocialSecurityBenefits != "0")
      currTemplateHebrew += `
קצבאות ביטוח לאומי עתידיות בסך ${parseInt(this.AllInfo.CalculateData.SocialSecurityBenefits).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
    else
      currTemplateHebrew += `
אין קצבאות ביטוח לאומי עתידיות`


    if (this.AllInfo.CalculateData.SocialSecurityBenefits != "0")
      currTemplate += `
The future national insurance pension is in the amount of ${parseInt(this.AllInfo.CalculateData.SocialSecurityBenefits).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
    else
      currTemplate += `
No future national insurance pension`;

    if (this.AllInfo.CalculateData.SumExpenses != "0") {
      let totalFixedExpenses = parseInt(this.AllInfo.CalculateData.SumExpenses);
      let alimony = this.CalcPaymentOfAlimony();

      if (this.AllInfo.CalculateData.SumExpenses != "0") {
        let totalFixedExpenses = parseInt(this.AllInfo.CalculateData.SumExpenses);
        let alimony = this.CalcPaymentOfAlimony();

        currTemplateHebrew += `
הוצאות קבועות (כולל מזונות ושכר דירה) בסך ${totalFixedExpenses.toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

        if (alimony != 0) {
          currTemplateHebrew += `
 מתוכן, תשלום מזונות חודשי בסך ${alimony.toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
        }

        if (this.AllInfo.CalculateData.RentCost != "0") {
          currTemplateHebrew += `
 מתוכן, תשלום שכר דירה חודשי בסך ${parseInt(this.AllInfo.CalculateData.RentCost).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
        }
      } 
    }
    else {
        currTemplateHebrew += `
אין הוצאות קבועות`;
      }


      if (this.AllInfo.CalculateData.SumExpenses != "0") {
        currTemplate += `
Fixed expenses in the amount of ${parseInt(this.AllInfo.CalculateData.SumExpenses).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
        if (this.CalcPaymentOfAlimony() != 0) {
          currTemplate = currTemplate.slice(0, -1);
          currTemplate += `, including payment of alimony in the amount of ${this.CalcPaymentOfAlimony().toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
        }
      }
      else
        currTemplate += `
No fixed expenses`

      if (this.AllInfo.CalculateData.SumVariableExpenses != "0")
        currTemplateHebrew += `
הוצאות משתנות בסך ${parseInt(this.AllInfo.CalculateData.SumVariableExpenses).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

      if (this.AllInfo.CalculateData.SumVariableExpenses != "0")
        currTemplate += `
Current expenses in the amount of ${parseInt(this.AllInfo.CalculateData.SumVariableExpenses).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;


      if (this.AllInfo.CalculateData.CommitmentAmounts != '0')
        currTemplateHebrew += `
חובות בסך ${parseInt(this.AllInfo.CalculateData.CommitmentAmounts).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
      else
        currTemplateHebrew += `
אין חובות.`;


      if (this.AllInfo.CalculateData.CommitmentAmounts != '0')
        currTemplate += `
Debts in the amount of ${parseInt(this.AllInfo.CalculateData.CommitmentAmounts).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
      else
        currTemplate += `
No debts.`;

      if (this.AllInfo.CalculateData.SumMortgages != "0")
        currTemplateHebrew += `
משכנתה בסך ${parseInt(this.AllInfo.CalculateData.SumMortgages).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
      else
        currTemplateHebrew += `
אין משכנתה.`;


      if (this.AllInfo.CalculateData.SumMortgages != "0")
        currTemplate += `
A mortgage in the amount of ${parseInt(this.AllInfo.CalculateData.SumMortgages).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
      else
        currTemplate += `
No mortgage.`;

      if (this.AllInfo.CalculateData.RentCost != "0")
        currTemplateHebrew += `
תשלום שכר דירה בסך  ${parseInt(this.AllInfo.CalculateData.RentCost).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;
      else
        currTemplateHebrew += `
אין תשלום שכר דירה,`;

      if (this.AllInfo.CalculateData.RentCost != "0")
        currTemplate += `
Rent payment in the amount of ${parseInt(this.AllInfo.CalculateData.RentCost).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;
      else
        currTemplate += `
Not paying rent,`;

      if (this.AllInfo.CalculateData.Baltam != "")
        currTemplateHebrew += `
חיסכון בלת"ם בסך ${parseInt(this.AllInfo.CalculateData.Baltam).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.Baltam != "")
        currTemplate += `
Savings for unplanned expenses in the amount of ${parseInt(this.AllInfo.CalculateData.Baltam).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.SecurityFund != "0")
        currTemplateHebrew += `
קרן ביטחון בסך ${parseInt(this.AllInfo.CalculateData.SecurityFund).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.SecurityFund != "0")
        currTemplate += `
An emergency fund in the amount of ${parseInt(this.AllInfo.CalculateData.SecurityFund).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.FutureExpenses != "")
        currTemplateHebrew += `
חיסכון להוצאות עתידיות בסך ${parseInt(this.AllInfo.CalculateData.FutureExpenses).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.FutureExpenses != "")
        currTemplate += `
Savings for future expenses in the amount of ${parseInt(this.AllInfo.CalculateData.FutureExpenses).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.General != "")
        currTemplateHebrew += `
חיסכון כללי בסך  ${parseInt(this.AllInfo.CalculateData.General).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

      if (this.AllInfo.CalculateData.General != "")
        currTemplate += `
General savings in the amount of ${parseInt(this.AllInfo.CalculateData.General).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.NetWorths != "0")
        currTemplateHebrew += `
נכסי נדל"ן בסך ${parseInt(this.AllInfo.CalculateData.NetWorths).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.NetWorths != "0")
        currTemplate += `
Real estate assets in the amount of ${parseInt(this.AllInfo.CalculateData.NetWorths).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.VehiclesNetWorths != "")
        currTemplateHebrew += `
מחזיק ברכב במחיר משואר של ${parseInt(this.AllInfo.CalculateData.VehiclesNetWorths).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

      if (this.AllInfo.CalculateData.VehiclesNetWorths != "")
        currTemplate += `
Owns a car with a current value of ${parseInt(this.AllInfo.CalculateData.VehiclesNetWorths).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.FinanceLiquidityAssets != "") {
        let financeLiquidity = parseInt(this.AllInfo.CalculateData.FinanceLiquidityAssets).toLocaleString('he-IL', { minimumFractionDigits: 0 });
        currTemplateHebrew += `
נכסים פיננסיים נזילים בסך ${financeLiquidity} שקל.`;

        if (this.AllInfo.CalculateData.SumCryptoSaving != "") {
          let cryptoSaving = parseInt(this.AllInfo.CalculateData.SumCryptoSaving).toLocaleString('he-IL', { minimumFractionDigits: 0 });
          currTemplateHebrew += ` כולל השקעה בקריפטו בסך ${cryptoSaving} שקל.`;
        }

        if (this.AllInfo.CalculateData.SumForexSaving != "") {
          let forexSaving = parseInt(this.AllInfo.CalculateData.SumForexSaving).toLocaleString('he-IL', { minimumFractionDigits: 0 });
          currTemplateHebrew += ` כולל השקעה ב-FOREX בסך ${forexSaving} שקל.`;
        }
      }

      if (this.AllInfo.CalculateData.FinanceLiquidityAssets != "")
        currTemplate += `
Liquid financial assets in the amount of ${parseInt(this.AllInfo.CalculateData.FinanceLiquidityAssets).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.FinanceUnliquidityAssets != "")
        currTemplateHebrew += `
נכסים פיננסים לא נזילים בסך ${parseInt(this.AllInfo.CalculateData.FinanceUnliquidityAssets).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.FinanceUnliquidityAssets != "")
        currTemplate += `
Illiquid financial assets in the amount of ${parseInt(this.AllInfo.CalculateData.FinanceUnliquidityAssets).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.LifeInsurances1 != "0")
        currTemplateHebrew += `
ביטוח חיים בסך של ${parseInt(this.AllInfo.CalculateData.LifeInsurances1).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;


      if (this.AllInfo.CalculateData.LifeInsurances1 != "0")
        currTemplate += `
Life insurance in the amount of ${parseInt(this.AllInfo.CalculateData.LifeInsurances1).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.LongTermCareCompany1 != "0")
        currTemplateHebrew += `
ביטוח סעודי בסך ${parseInt(this.AllInfo.CalculateData.LongTermCareCompany1).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

      //console.log("LongTermCareCompany1 = " + this.AllInfo.CalculateData.LongTermCareCompany1);
      if (this.AllInfo.CalculateData.LongTermCareCompany1 != "0")
        currTemplate += `
Long-term care insurance in the amount of ${parseInt(this.AllInfo.CalculateData.LongTermCareCompany1).toLocaleString('he-IL', { minimumFractionDigits: 0 })} NIS.`;

      if (this.AllInfo.CalculateData.LossOfWorkingCapacity != "0")
        currTemplateHebrew += `
אובדן כושר עבודה בסך ${parseInt(this.AllInfo.CalculateData.LossOfWorkingCapacity).toLocaleString('he-IL', { minimumFractionDigits: 0 })} שקל.`;

      if (this.AllInfo.PersonalDataViewInfo.CreditRating != "") {
        currTemplate += `
BDI israel credit rating of ${this.AllInfo.PersonalDataViewInfo.CreditRating}.`;

        currTemplateHebrew += `
דירוג אשראי ישראלי BDI של ${this.AllInfo.PersonalDataViewInfo.CreditRating}.`;
      }


      //currTemplateHebrew = currTemplateHebrew.slice(0, -1);
      currTemplateHebrew += `
`;


      //currTemplate = currTemplate.slice(0, -1);
      currTemplate += `
`;


      /*   currTemplate += `
    
    Please give a detailed opinion based on the data I gave you, and divide the answer into different categories
    For each subject, please indicate:
    * My financial figure you are basing it on.
    * Percentage of family income.
    * Statistics in Israel and a comparison with moderates I provided you about myself.
    * Analysis (numerical data) that can give a more accurate explanation in the specific category and ways to improve/optimize.
        
    Finally, answer me the following questions:
    Is my financial management correct?
    What can be improved in my financial management?
        
    End your answer by providing tasks to be performed that can improve the financial situation according to the data I gave and provide instructions regarding the management of the financial situations, especially when it comes to my fixed expenses and the breakdown of variable expenses?
    Specifically, I would like to know how to optimize my variable expenses and reduce discretionary expenses.` */

      /*
      Please give a detailed opinion based on this data, and divide the answer into different topics, add for each topic: percent of incomes, statistics, and analysis (numeric data)  
      Please detail the financial situations in each of the categories
      Please answer for me about these questions:
      Is my financial management correct? 
      What can be improved in my financial management?
      
      Please add to each category the statistics in Israel and a comparison with the data I provided you about myself`;
      */


      if (this.AllInfo.CalculateData.SumExpenses != "0")
        currTemplateHebrew += buildFixedExpensesHebrew;

      if (this.AllInfo.CalculateData.SumVariableExpenses != "0")
        currTemplateHebrew += buildVariableExpensesHebrew;

      if (this.AllInfo.CalculateData.Baltam != "" || this.AllInfo.CalculateData.FutureExpenses != "")
        currTemplateHebrew += buildSavingHebrew;

      if (this.AllInfo.CalculateData.SumMortgages != "0")
        currTemplateHebrew += buildMortgagesHebrew;

      if (this.AllInfo.CalculateData.SumExpenses != "0")
        currTemplate += buildFixedExpenses;

      if (this.AllInfo.CalculateData.SumVariableExpenses != "0")
        currTemplate += buildVariableExpenses;

      if (this.AllInfo.CalculateData.Baltam != "" || this.AllInfo.CalculateData.FutureExpenses != "")
        currTemplate += buildSaving;

      if (this.AllInfo.CalculateData.SumMortgages != "0")
        currTemplate += buildMortgages;

      this.AllInfo.GptAIQuestionEnglish = currTemplate;//.replace(/\t/g, '');

      //const reportGenerator = new FinancialReportGenerator();
      //const financialReport = reportGenerator.generateComprehensiveFinancialReport(this.AllInfo);

      // עכשיו אפשר לשים את התוכן ב-textarea
      //this.AllInfo.GptAIQuestion = financialReport;


      this.AllInfo.GptAIQuestion = currTemplateHebrew;//.replace(/\t/g, '');

      console.log(this.AllInfo.GptAIQuestion);


      //this.TanslateWithChangedUA('Ich muss Deutsch lernen!','he');
      //this.TranslateSimple(this.AllInfo.GptAIQuestionEnglish,'he');
    }

    /*   async TanslateWithChangedUA(sourceText: string,lang:string) {
        console.log(`Translating: ${sourceText}`);
        const fetchOptions = {
          headers: {
            'Access-Control-Allow-Origin': "https://shilmanlior2608.ddns.net",
            'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
            'Access-Control-Allow-Private-Network': 'true',
            'Access-Control-Allow-Methods': "GET, POST, DELETE,OPTIONS",
          },
        } as Partial<RequestInit>;
        const { text } = await translate(sourceText, { fetchOptions,to: lang});
        console.log(`Result: ${text}`);
      } */

    Fill4Test() {

      // PersonalDatas
      //this.AllInfo.PersonalDataViewInfo.Mail = "shilmanlior@gmail.com";
      //this.AllInfo.PersonalDataViewInfo.Id = "031507726";
      /*  this.AllInfo.PersonalDataViewInfo.Name1 = "ליאור";
       this.AllInfo.PersonalDataViewInfo.Age1 = "45";
       this.AllInfo.PersonalDataViewInfo.SelectedSex1 = "זכר";
       this.AllInfo.PersonalDataViewInfo.SelectedStatus1 = "נשוי";
       this.AllInfo.PersonalDataViewInfo.Name2 = "שרה";
       this.AllInfo.PersonalDataViewInfo.Age2 = "40";
       this.AllInfo.PersonalDataViewInfo.SelectedSex2 = "נקבה";
       this.AllInfo.PersonalDataViewInfo.RetirementAge1 = "67";
       this.AllInfo.PersonalDataViewInfo.RetirementAge2 = "62";
       this.AllInfo.PersonalDataViewInfo.NumberOfChildren1 = "2";
       this.onNumberOfChildrenChange(parseInt(this.AllInfo.PersonalDataViewInfo.NumberOfChildren1)); */


      /*   this.AllInfo.PersonalDataViewInfo.Child[0].Name = "עמית";
       this.AllInfo.PersonalDataViewInfo.Child[0].Age = "17";
       this.AllInfo.PersonalDataViewInfo.Child[0].SelectedSex = "זכר";
       this.AllInfo.PersonalDataViewInfo.Child[1].Name = "מעין";
       this.AllInfo.PersonalDataViewInfo.Child[1].Age = "14";
       this.AllInfo.PersonalDataViewInfo.Child[1].SelectedSex = "זכר"; */
      //this.AllInfo.PersonalDataViewInfo.Marride = true;

      // Relatives
      /*  this.AllInfo.RelativeViewInfo.MotherAge1 = "73";
       this.AllInfo.RelativeViewInfo.MotherCanHelp1 = 3;
       this.AllInfo.RelativeViewInfo.MotherNeedHelp1 = 1;
       this.AllInfo.RelativeViewInfo.MotherGetF1 = "150,000";
       this.AllInfo.RelativeViewInfo.CommentMother1 = "חלק בדירה , בעוד הרבה שנים";
     
       this.AllInfo.RelativeViewInfo.FatherAge2 = "75";
       this.AllInfo.RelativeViewInfo.FatherCanHelp2 = 10;
       this.AllInfo.RelativeViewInfo.FatherNeedHelp2 = 1;
       this.AllInfo.RelativeViewInfo.FatherGetF2 = "";
       this.AllInfo.RelativeViewInfo.CommentFather2 = "גרושים";
     
       this.AllInfo.RelativeViewInfo.MotherAge2 = "72";
       this.AllInfo.RelativeViewInfo.MotherCanHelp2 = 1;
       this.AllInfo.RelativeViewInfo.MotherNeedHelp2 = 8;
       this.AllInfo.RelativeViewInfo.MotherGetF2 = "";
       this.AllInfo.RelativeViewInfo.CommentMother2 = "גרושים , מצב כלכלי גרוע"; */

      // Incomes
      /* this.AllInfo.IncomesViewInfo.IncomeRows[0] = new Array<IncomeRowObj>(4);
      for (let j = 0; j < 4; j++) {
        this.AllInfo.IncomesViewInfo.IncomeRows[0][j] = new IncomeRowObj();
      } */
      /* this.AllInfo.IncomesViewInfo.IncomeRows[0][0].Type = "משכורת";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].FixedMonthly = "24,000";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].MonthlyRevenue1 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].MonthlyRevenue2 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].MonthlyRevenue3 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].MonthlyAverage = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[0][0].Comment = "כולל כ - 50 שעות נוספות";
    */

      /* 
          this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg = "6,105";
          this.AllInfo.IncomesViewInfo.IncomeExRows[0].Comment = "פנסיה (מנורה) + ביטוח מנהלים (מגדל)";
      
          this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg = "2,413";
          this.AllInfo.IncomesViewInfo.IncomeExRows[1].Comment = "קרן השתלמות - ילין לפידות";
      
      
          this.AllInfo.IncomesViewInfo.IncomeExRows[2].Type = "קרן דולרית";
          this.AllInfo.IncomesViewInfo.IncomeExRows[2].MonthlyAvg = "800";
          this.AllInfo.IncomesViewInfo.IncomeExRows[2].Comment = "משיכה פעם בשנה של 5,000 דולר"; */

      /* this.AllInfo.IncomesViewInfo.IncomeRows[1] = new Array<IncomeRowObj>(4);
      for (let j = 0; j < 4; j++) {
        this.AllInfo.IncomesViewInfo.IncomeRows[1][j] = new IncomeRowObj();
      }
     
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].Type = "משכורת";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].FixedMonthly = "9,000";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].MonthlyRevenue1 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].MonthlyRevenue2 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].MonthlyRevenue3 = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].MonthlyAverage = "";
      this.AllInfo.IncomesViewInfo.IncomeRows[1][0].Comment = "";
    */

      /*     this.AllInfo.IncomesViewInfo.IncomeEx = (parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) + parseInt(this.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', ''))).toString();
       */
      /*     this.AllInfo.SavingViewInfo.SavingRows[0].Type = "בלת\"מ";
          this.AllInfo.SavingViewInfo.SavingRows[0].FixedMonthly = "";
          this.AllInfo.SavingViewInfo.SavingRows[0].CurrentAmount = "10,250";
          this.AllInfo.SavingViewInfo.SavingRows[0].Comment = "פסגות כספית פטורה";
      
          this.AllInfo.SavingViewInfo.SavingRows[1].Type = "קרן ביטחון";
          this.AllInfo.SavingViewInfo.SavingRows[1].FixedMonthly = "";
          this.AllInfo.SavingViewInfo.SavingRows[1].CurrentAmount = "40,900";
          this.AllInfo.SavingViewInfo.SavingRows[1].Comment = "מגדל כספית + איילון כספית";
       */
      /*     this.AllInfo.SavingViewInfo.SavingRows[0].Type = "הוצאות עתידיות";
          this.AllInfo.SavingViewInfo.SavingRows[0].FixedMonthly = "4,000";
          this.AllInfo.SavingViewInfo.SavingRows[0].CurrentAmount = "62,500";
          this.AllInfo.SavingViewInfo.SavingRows[0].Comment = "מיטב דש - מניות + סנופי";
      
          this.AllInfo.SavingViewInfo.SavingRows[1].Type = "חסכון כללי";
          this.AllInfo.SavingViewInfo.SavingRows[1].FixedMonthly = "2,000";
          this.AllInfo.SavingViewInfo.SavingRows[1].CurrentAmount = "10,000";
          this.AllInfo.SavingViewInfo.SavingRows[1].Comment = "מור - כללי + מניות + סנופי";
      
      
          this.AllInfo.SavingViewInfo.SavingMonthly = 0; */

      /* for (let i = 0; i < 10; i++) {
        this.AllInfo.SavingViewInfo.SavingMonthly += (this.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '')) : 0);
      }
    */
      /*    this.AllInfo.SavingViewInfo.CurrAmounts = 0;
     
         for (let i = 0; i < 10; i++) {
           this.AllInfo.SavingViewInfo.CurrAmounts += (this.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '')) : 0);
         } */

      /* this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].Type = "הוט";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].FixedMonthly = "284";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[0].Comment = "טריפל + סיב אופטי 1000 גיגה";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].Type = "חיסכון ילדים";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].FixedMonthly = "750";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[1].Comment = "משותף - 250 + עצמי - 500";
     
      // Fixed Expenses
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].Type = "דמי שכירות";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].FixedMonthly = "3,600";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[2].Comment = "חוזה לאופציה לשנה נוספת - 31.07.25 ";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].Type = "מזונות";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].FixedMonthly = "5,550";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[3].Comment = "2024 - 3,333 , 2027 - 2,750 , 2030 מסתיים";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].Type = "ועד בית";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].FixedMonthly = "180";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[4].Comment = "";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].Type = "ארנונה";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].FixedMonthly = "550";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[5].Comment = "";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].Type = "טלפון סללולרי";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].FixedMonthly = "58";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[6].Comment = "שלי + חצי מתשלום על הילדים";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].Type = "הגנות כלליות";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].FixedMonthly = "850";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[7].Comment = "תאונות אישית,ביטוח חיים,סעודי";
     
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].Type = "תמי 4";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].FixedMonthly = "107";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].MonthlyExpense1 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].MonthlyExpense2 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].MonthlyExpense3 = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].MonthlyAverage = "";
      this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[8].Comment = "מסתיים ב - 2026";
     
     
     
      var expenses = 0;
     
      for (let i = 0; i < 20; i++) {
        expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '')) : 0);
      }
     
      this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg = expenses.toFixed(0).toString();
     
      expenses = 0;
     
      for (let i = 0; i < 20; i++) {
        expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '')) : 0);
      }
     
      this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();
     
      expenses = 0;
     
      for (let i = 0; i < 20; i++) {
        expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '')) : 0);
      }
     
      this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = expenses.toFixed(0).toString();
     
      expenses = 0;
     
      for (let i = 0; i < 20; i++) {
        expenses += (this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '')) : 0);
      }
     
      this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg = expenses.toFixed(0).toString();
     
      this.AllInfo.FixedExpensesViewInfo.Expenses = ((this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '')) : 0) +
        (((this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '')) : 0) +
          (this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '')) : 0) +
          (this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '') != "" ? parseFloat(this.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '')) : 0)) / 3)).toFixed(0).toString();
    */
      /* this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[0].CurrExpense = "2,000";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[0].SatisfactionExpense = "1,800"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[1].CurrExpense = "200";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[1].SatisfactionExpense = "250"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[2].CurrExpense = "500";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[2].SatisfactionExpense = "300"
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[3].CurrExpense = "120";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[3].SatisfactionExpense = "120"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[4].CurrExpense = "750";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[4].SatisfactionExpense = "750"
     
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[1].CurrExpense = "300";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[1].SatisfactionExpense = "300"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[6].CurrExpense = "300";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[6].SatisfactionExpense = "300"
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[0].CurrExpense = "50";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[0].SatisfactionExpense = "50"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[2].CurrExpense = "40";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[2].SatisfactionExpense = "40"
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[0].CurrExpense = "250";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[0].SatisfactionExpense = "250"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[3].CurrExpense = "50";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[3].SatisfactionExpense = "50"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[5].CurrExpense = "10";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[5].SatisfactionExpense = "10"
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[1].CurrExpense = "105";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[1].SatisfactionExpense = "90"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[2].CurrExpense = "100";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[2].SatisfactionExpense = "100"
     
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[3].CurrExpense = "1,200";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[3].SatisfactionExpense = "1,200"
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[5].CurrExpense = "200";
      this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[5].SatisfactionExpense = "200"
     
      this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses = 0;
     
      for (let i = 0; i < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
        for (let j = 0; j < this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
          this.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses += ((this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '') != "" ? parseFloat(this.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '')) : 0));
        }
      } */


      /* this.AllInfo.RealEstateViewInfo.RealEstateRows[0].Description = "דירה בבאר שבע";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[0].AssetValue = "1200000";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[0].NortgageBalance = "550000";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[0].Description = "דירה מגורים - 4 חדרים";
     
      this.AllInfo.RealEstateViewInfo.RealEstateRows[1].Description = "דירה בדימונה";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[1].AssetValue = "950000";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[1].NortgageBalance = "350000";
      this.AllInfo.RealEstateViewInfo.RealEstateRows[1].Description = "דירה להשקעה - 2 חדרים";
     
      var assetValue = 0;
     
      for (let i = 0; i < 10; i++) {
        assetValue += (this.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '')) : 0);
      }
     
      this.AllInfo.RealEstateViewInfo.AssetValues = assetValue.toFixed(0).toString();
    */
      /*   var nortgageBalances = 0;
     
        for (let i = 0; i < 10; i++) {
          nortgageBalances += (this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '') != "" ? parseFloat(this.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '')) : 0);
        }
     
        this.AllInfo.RealEstateViewInfo.NortgageBalances = nortgageBalances.toFixed(0).toString(); */

      /* this.AllInfo.VehiclesViewInfo.VehiclesRows[0].Description = "קיה פיקנטו";
      this.AllInfo.VehiclesViewInfo.VehiclesRows[0].YearOfProduction = "2015";
      this.AllInfo.VehiclesViewInfo.VehiclesRows[0].VehicleWorth = "37000"; */

      /* this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[0].DescriptionSaving = "פסגות כספית פטורה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[0].WhereSaving = "Fair";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[0].CurrentAmount = "10,177";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[0].Comment = "בלתי מתוכנן";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[1].DescriptionSaving = "מגדל כספית";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[1].WhereSaving = "Fair";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[1].CurrentAmount = "20,338";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[1].Comment = "קרן ביטחון";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[2].DescriptionSaving = "איילון כספית";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[2].WhereSaving = "Fair";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[2].CurrentAmount = "20,340";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[2].Comment = "קרן ביטחון";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[3].DescriptionSaving = "קרן השתלמות";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[3].WhereSaving = "מיטב דש";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[3].CurrentAmount = "140,300";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[3].Comment = "דמי ניהול - 0.8%";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[4].DescriptionSaving = "קופת גמל להשקעה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[4].WhereSaving = "מיטב דש";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[4].CurrentAmount = "52,000";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[4].Comment = "דמי ניהול - 0.65%";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[5].DescriptionSaving = "קופת גמל להשקעה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[5].WhereSaving = "מור";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[5].CurrentAmount = "10,000";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[5].Comment = "דמי ניהול - 0.75%";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[6].DescriptionSaving = "קרן ריט - אירופה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[6].WhereSaving = "RealtyBoundle";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[6].CurrentAmount = "12,800";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[6].Comment = "מטבע EUR";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[7].DescriptionSaving = "קרן ריט - שוודיה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[7].WhereSaving = "RealtyBoundle";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[7].CurrentAmount = "5,700";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[7].Comment = "מטבע SEK";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[8].DescriptionSaving = "Forex";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[8].WhereSaving = "Fxcm";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[8].CurrentAmount = "2,420";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[8].Comment = "מטבע USD";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[9].DescriptionSaving = "עובר ושב";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[9].WhereSaving = "בנק אוצר החייל";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[9].CurrentAmount = "20,000";
      this.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[9].Comment = "מטבע ILS";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[0].DescriptionSaving = "קרן השתלמות";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[0].WhereSaving = "ילין לפידות";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[0].CurrentAmount = "119,500";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[0].Comment = "דמי ניהול - 0.8%";
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[1].DescriptionSaving = "קרן השתלמות";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[1].WhereSaving = "מנורה";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[1].CurrentAmount = "1,730";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[1].Comment = "דמי ניהול - 0.9% , מסלול מניות";
     
     
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[2].DescriptionSaving = "יחידות השתתפות";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[2].WhereSaving = "RealtyBoundle";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[2].CurrentAmount = "5,000";
      this.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[2].Comment = "989 מניות";
    */
      /*     this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].TheLender = "בנק אוצר החייל";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].ExecutionDate = "01.10.2018";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].OriginalAmount = "100,000";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].CurrAmount = "35,000";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].MonthlyPayment = "1,500";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].EndDate = "01.10.2024";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].Interest = "3.5";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[0].Comment = "סגירת מינוס";
      
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].TheLender = "בנק אוצר החייל";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].ExecutionDate = "18.02.2022";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].OriginalAmount = "100,000";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].CurrAmount = "40,000";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].MonthlyPayment = "750";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].EndDate = "18.11.2026";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].Interest = "2.25";
          this.AllInfo.CommitmentsViewInfo.CommitmentsRows[1].Comment = "שיפוץ מטבח"; */

      /*  this.AllInfo.MortgagesViewInfo.MortgagesRows[0].Name = "דירה בבאר שבע 4 חדרים";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].Route = "קבועה לא צמודה";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].OriginalAmount = "400,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].CurrAmount = "400,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].Interest = "4.69";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].YearToEnd = "30";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].MonthlyPayment = this.AllInfo.MortgagesViewInfo.MortgagesRows[0].calculateLoanDetails().monthlyPayment;
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].RemainingMortgage = (this.AllInfo.MortgagesViewInfo.MortgagesRows[0].calculateLoanDetails().totalInterest + this.AllInfo.MortgagesViewInfo.MortgagesRows[0].calculateLoanDetails().totalPrincipal);
       this.AllInfo.MortgagesViewInfo.MortgagesRows[0].CostOfFinancing = this.AllInfo.MortgagesViewInfo.MortgagesRows[0].calculateLoanDetails().financingCost;
     
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].Name = "דירה בבאר שבע 4 חדרים";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].Route = "פריים";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].OriginalAmount = "275,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].CurrAmount = "275,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].Interest = "5.65";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].YearToEnd = "30";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].MonthlyPayment = this.AllInfo.MortgagesViewInfo.MortgagesRows[1].calculateLoanDetails().monthlyPayment;
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].RemainingMortgage = (this.AllInfo.MortgagesViewInfo.MortgagesRows[1].calculateLoanDetails().totalInterest + this.AllInfo.MortgagesViewInfo.MortgagesRows[1].calculateLoanDetails().totalPrincipal);
       this.AllInfo.MortgagesViewInfo.MortgagesRows[1].CostOfFinancing = this.AllInfo.MortgagesViewInfo.MortgagesRows[1].calculateLoanDetails().financingCost;
     
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].Name = "דירה בבאר שבע 4 חדרים";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].Route = "משתנה לא צמודה";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].OriginalAmount = "325,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].CurrAmount = "325,000";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].Interest = "4.74";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].YearToEnd = "25";
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].MonthlyPayment = this.AllInfo.MortgagesViewInfo.MortgagesRows[2].calculateLoanDetails().monthlyPayment;
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].RemainingMortgage = (this.AllInfo.MortgagesViewInfo.MortgagesRows[2].calculateLoanDetails().totalInterest + this.AllInfo.MortgagesViewInfo.MortgagesRows[2].calculateLoanDetails().totalPrincipal);
       this.AllInfo.MortgagesViewInfo.MortgagesRows[2].CostOfFinancing = this.AllInfo.MortgagesViewInfo.MortgagesRows[2].calculateLoanDetails().financingCost;
    */
      // life Insurance

      /*     this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][0].Name = "מנורה - 892";
          this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][0].CapitalAmount = "1415000";
      
          var nortgageBalances = 0;
      
          for (let i = 0; i < 4; i++) {
            nortgageBalances += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
          }
      
          this.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[0] = nortgageBalances
      
      
       */

      /*  this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][0].Name = "מגדל - 4433";
       this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][0].CapitalAmount = "200,000";
     
       nortgageBalances = 0;
     
       for (let i = 0; i < 4; i++) {
         nortgageBalances += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
       }
     
       this.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[1] = nortgageBalances
     
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].Name = "מאוחדת";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].HomeAmount = "5,500";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[1].SeudiAmount = "10,500";
     
       // Long Time Care Insurance
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][0].Name = "מנורה - 9004";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][0].First5YearHomeAmount = "13,500";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][0].Over6YearHomeAmount = "13,500";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][0].First5YearSeudiAmount = "13,500";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0][0].Over6YearSeudiAmount = "13,500";
     
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].ChildName = "עמית";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].Name = "הראל - 089";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].First5YearHomeAmount = "10,000";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].Over6YearHomeAmount = "10,000";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].First5YearSeudiAmount = "10,000";
       this.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[0].Over6YearSeudiAmount = "10,000";
     
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[0].NameOfInsured = "ליאור";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[0].NameOfHealthInsurance = "מכבי";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[0].SupplementaryInsurance = true;
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[0].PrivateInsurancDescription = "הראל + מנורה";
     
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[1].NameOfInsured = "עמית";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[1].NameOfHealthInsurance = "כללית";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[1].SupplementaryInsurance = true;
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[1].PrivateInsurancDescription = "הראל";
     
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[2].NameOfInsured = "מעין";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[2].NameOfHealthInsurance = "כללית";
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[2].SupplementaryInsurance = true;
       this.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows[2].PrivateInsurancDescription = "הראל";
    */
      /* var nortgageBalances = 0;
     
      for (let i = 0; i < 4; i++) {
        nortgageBalances += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0][i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
      }
     
      this.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[0] = nortgageBalances */
      /*  nortgageBalances = 0;
     
       for (let i = 0; i < 4; i++) {
         nortgageBalances += (this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1][i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
       }
     
       this.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[1] = nortgageBalances */

      /*     this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[0].NameOfInsurance = "מגדל - 366";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[0].CurrentCapitalAmount = "496,500";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[0].MonthlyDepositAmount = "2,700";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[0].LumpSum = "495,000";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows[0].AllowanceFactor = "192";
      
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[0].NameOfInsurance = "מגדל מוקפאת 332";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[0].CurrentCapitalAmount = "100,000";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[0].MonthlyDepositAmount = "";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[0].LumpSum = "";
          this.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows[0].AllowanceFactor = "220";
      
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].NameOfInsurance = "מנורה - 168";
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].CurrentCapitalAmount = "548,500";
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].MonthlyDepositAmount = "3,150";
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].EndDate = "";
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].WidowsAllowance = "9,000";
          this.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows[0].OrphanAllowance = "6,000";
      
      
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].NameOfInsurance = "מגדל חדשה 666";
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].CurrentCapitalAmount = "80,000";
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].MonthlyDepositAmount = "1,200";
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].EndDate = "";
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].WidowsAllowance = "2,500";
          this.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows[0].OrphanAllowance = "1,500";
      
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[0].NameOfInsurance = "צהל";
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[0].AllowanceAmount = "4,000";
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[0].WidowsAllowance = "5,000";
          this.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows[0].OrphanAllowance = "2,000";
      
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[0].Amount = "4,470";
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[1].Amount = "725";
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].SocialSecurityBenefitsRows[2].Amount = "2,300";
      
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[0].Amount = "4,470";
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[1].Amount = "725";
          this.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].SocialSecurityBenefitsRows[2].Amount = "2,300";
      
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[0].NameOfInsurance = "שכר דירה מודיעין";
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[0].Amount = "5,200";
          this.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[0].Comment = "ימשיכו לגור בשכירות?";
       */
      this.subUpdateAllInfo.next("");
    }
  }
