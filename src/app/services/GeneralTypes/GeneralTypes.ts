import { EconomicalStabilityComponent } from "src/app/components/economical-stability/economical-stability.component";
import { GeneralInfoService } from "../general-info.service";

const Status1 = ["רווק", "נשוי", "גרוש", "אלמן"];
const Status2 = ["רווק", "נשוי", "גרוש", "אלמן"];
const Sex1 = ["זכר", "נקבה"];
const Sex2 = ["זכר", "נקבה"];

export class AllInfoObj {
  UserListInfo: UserListInfoViewObj;
  PersonalDataViewInfo: PersonalDataInfoViewObj;
  RelativeViewInfo: RelativeViewInfoObj;
  IncomesViewInfo: IncomesViewInfoObj;
  FixedExpensesViewInfo: FixedExpensesViewInfoObj;
  VariableExpensesViewInfo: VariableExpensesViewInfoObj;
  RealEstateViewInfo: RealEstateViewInfoObj;
  VehiclesViewInfo: VehiclesViewInfoObj;
  FinanceAssetsViewInfo: FinanceAssetsViewInfoObj;
  CommitmentsViewInfo: CommitmentsViewInfoObj;
  SavingViewInfo: SavingViewInfoObj;
  MortgagesViewInfo: MortgagesViewInfoObj;
  LifeInsurancesViewInfo: LifeInsurancesViewInfoObj;
  LifeLongCareInsurancesViewInfo: LifeLongCareInsurancesViewInfoObj;
  HealthInsuranceViewInfo: HealthInsuranceViewInfoObj;
  PensiaViewInfo: PensiaViewInfoObj;
  EconomicalStabilityViewInfo: EconomicalStabilityViewInfoObj;
  RepetitiveGoalsViewInfo: RepetitiveGoalsViewInfoObj;
  IncomesGoalsViewInfo: IncomesGoalsViewInfoObj;
  OneOffFamilyGoalsViewInfo: OneOffFamilyGoalsViewInfoObj;
  CurrentFlowViewInfo: CurrentFlowViewInfoObj;
  CalculateData: CalculateDataObj;
  LossOfWorkingCapacity: LossOfWorkingCapacityViewInfoObj;
  GptAIQuestion: string;
  GptAIQuestionEnglish: string;

  constructor(public generalInfoService: GeneralInfoService) {
    this.UserListInfo = new UserListInfoViewObj();
    this.PersonalDataViewInfo = new PersonalDataInfoViewObj();
    this.RelativeViewInfo = new RelativeViewInfoObj();
    this.IncomesViewInfo = new IncomesViewInfoObj();
    this.FixedExpensesViewInfo = new FixedExpensesViewInfoObj();
    this.VariableExpensesViewInfo = new VariableExpensesViewInfoObj();
    this.RealEstateViewInfo = new RealEstateViewInfoObj();
    this.VehiclesViewInfo = new VehiclesViewInfoObj();
    this.FinanceAssetsViewInfo = new FinanceAssetsViewInfoObj();
    this.CommitmentsViewInfo = new CommitmentsViewInfoObj();
    this.SavingViewInfo = new SavingViewInfoObj();
    this.MortgagesViewInfo = new MortgagesViewInfoObj();
    this.LifeInsurancesViewInfo = new LifeInsurancesViewInfoObj();
    this.LifeLongCareInsurancesViewInfo = new LifeLongCareInsurancesViewInfoObj();
    this.HealthInsuranceViewInfo = new HealthInsuranceViewInfoObj();
    this.PensiaViewInfo = new PensiaViewInfoObj();
    this.EconomicalStabilityViewInfo = new EconomicalStabilityViewInfoObj();
    this.RepetitiveGoalsViewInfo = new RepetitiveGoalsViewInfoObj();
    this.IncomesGoalsViewInfo = new IncomesGoalsViewInfoObj();
    this.OneOffFamilyGoalsViewInfo = new OneOffFamilyGoalsViewInfoObj();
    this.CurrentFlowViewInfo = new CurrentFlowViewInfoObj();
    this.CalculateData = new CalculateDataObj();
    this.LossOfWorkingCapacity = new LossOfWorkingCapacityViewInfoObj();
    this.GptAIQuestion = "";
    this.GptAIQuestionEnglish = "";
  }
}

export class UserListInfoViewObj {
  UsersRows: UserRowObj[];
  constructor() {
    this.UsersRows = [];
  }
}

export class UserRowObj {
  UserID: number;
  FirstName: string;
  Mail: string;
  Identification: string;


  constructor() {
    this.UserID = 0;
    this.FirstName = "";
    this.Mail = "";
    this.Identification = "";
  }
}


export class PersonalDataInfoViewObj {
  Mail: string
  Id: string
  Name1: string;
  Age1: string;
  NumberOfChildren1: string;
  Child: ChildObj[];
  Name2: string;
  Age2: string;
  Marride: boolean;
  RetirementAge1: string;
  RetirementAge2: string;
  SelectedStatus1: string;
  SelectedSex1: string;
  SelectedSex2: string;
  SaudiInsuranceInHome: string;
  SaudiinsuranceInMossad: string;
  AnnualInterest: string;
  Unplanned: string;
  CreditRating: string;

  constructor() {
    this.Id = "";
    this.Mail = "";
    this.Child = [];
    this.Name1 = "";
    this.Age1 = "";
    this.NumberOfChildren1 = "0";
    this.SelectedStatus1 = "בחר ...";
    this.SelectedSex1 = "בחר ...";
    this.Marride = false;
    this.RetirementAge1 = "";
    this.SaudiInsuranceInHome = "8,000";
    this.SaudiinsuranceInMossad = "15,000";
    this.AnnualInterest = "3.74";
    this.Unplanned = "5";
    this.CreditRating = "";
    this.Name2 = "";
    this.Age2 = "";
    this.RetirementAge2 = "";
    this.SelectedSex2 = "בחר ...";
  }
}


export class ChildObj {
  Name: string;
  Age: string;
  SelectedSex: string;

  constructor() {
    this.Name = "";
    this.Age = "";
    this.SelectedSex = "בחר ...";
  }

  GetClassValidation(val: string) {
    switch (val) {
      case 'Name':
        if (this.Name == "")
          return 'is-invalid';
        else
          return 'is-valid';
      case 'Age':
        if (this.Age == "")
          return 'is-invalid';
        else
          return 'is-valid';
      case 'Sex':
        if (this.SelectedSex == "בחר ...")
          return 'is-invalid';
        else
          return 'is-valid';
    }

    return '';
  }
}

export class RelativeViewInfoObj {
  FatherAge1: string;
  MotherAge1: string;
  FatherCanHelp1: number;
  MotherCanHelp1: number;
  FatherNeedHelp1: number;
  MotherNeedHelp1: number;
  FatherGetF1: string;
  MotherGetF1: string;
  CommentFather1: string;
  CommentMother1: string;

  FatherAge2: string;
  MotherAge2: string;
  FatherCanHelp2: number;
  MotherCanHelp2: number;
  FatherNeedHelp2: number;
  MotherNeedHelp2: number;
  FatherGetF2: string;
  MotherGetF2: string;
  CommentFather2: string;
  CommentMother2: string;

  constructor() {
    this.FatherAge1 = "";
    this.MotherAge1 = "";
    this.FatherCanHelp1 = 1;
    this.MotherCanHelp1 = 1;
    this.FatherNeedHelp1 = 1;
    this.MotherNeedHelp1 = 1;
    this.FatherGetF1 = "";
    this.MotherGetF1 = "";
    this.CommentFather1 = "";
    this.CommentMother1 = "";

    this.FatherAge2 = "";
    this.MotherAge2 = "";
    this.FatherCanHelp2 = 1;
    this.MotherCanHelp2 = 1;
    this.FatherNeedHelp2 = 1;
    this.MotherNeedHelp2 = 1;
    this.FatherGetF2 = "";
    this.MotherGetF2 = "";
    this.CommentFather2 = "";
    this.CommentMother2 = "";
  }
}

export class IncomesViewInfoObj {
  IncomeRows: IncomeRowObj[][];
  IncomeExRows: IncomeExRowObj[];

  FixedMonthlyAvg: string[];
  MonthlyRevenue1Avg: string[];
  MonthlyRevenue2Avg: string[];
  MonthlyRevenue3Avg: string[];
  MonthlyAverageAvg: string[];
  Income: string[];
  IncomeEx: string;
  SumIncomes: number;
  SumNetIncomes: number;
  TotalIncomes: number;

  constructor() {
    this.FixedMonthlyAvg = new Array<string>(2);
    this.MonthlyRevenue1Avg = new Array<string>(2);
    this.MonthlyRevenue2Avg = new Array<string>(2);
    this.MonthlyRevenue3Avg = new Array<string>(2);
    this.MonthlyAverageAvg = new Array<string>(2);
    this.IncomeEx = "";
    this.Income = new Array<string>(2);

    this.SumIncomes = 0;
    this.SumNetIncomes = 0;
    this.TotalIncomes = 0;
    this.IncomeRows = new Array<Array<IncomeRowObj>>(2);
    for (let i = 0; i < 2; i++) {
      this.IncomeRows[i] = [];/* new Array<IncomeRowObj>(4);
      for (let j = 0; j < 4; j++) {
        this.IncomeRows[i][j] = new IncomeRowObj();
      } */
    }

    this.IncomeExRows = new Array<IncomeExRowObj>(2);
    for (let i = 0; i < 2; i++) {
      this.IncomeExRows[i] = new IncomeExRowObj();
    }

    this.IncomeExRows[0].Type = "הפרשות לפנסיה";
    this.IncomeExRows[0].MonthlyAvg = "";
    this.IncomeExRows[0].Comment = "";

    this.IncomeExRows[1].Type = "הפרשות לקרנות";
    this.IncomeExRows[1].MonthlyAvg = "";
    this.IncomeExRows[1].Comment = "";



    for (let i = 0; i < 2; i++) {
      this.FixedMonthlyAvg[i] = "";
      this.MonthlyRevenue1Avg[i] = "";
      this.MonthlyRevenue2Avg[i] = "";
      this.MonthlyRevenue3Avg[i] = "";
      this.MonthlyAverageAvg[i] = "";
      this.Income[i] = "";
    }
  }
}

export class IncomeRowObj {
  [x: string]: any;
  Type: string;
  FixedMonthly: string;
  MonthlyRevenue1: string;
  MonthlyRevenue2: string;
  MonthlyRevenue3: string;
  MonthlyAverage: string;
  Comment: string;

  constructor() {
    this.Type = "";
    this.FixedMonthly = "";
    this.MonthlyRevenue1 = "";
    this.MonthlyRevenue2 = "";
    this.MonthlyRevenue3 = "";
    this.MonthlyAverage = "";
    this.Comment = "";
  }


  CalcMonthlyAverage(num: number) {
    return (((this.MonthlyRevenue1.replace(',', '') != "" ? parseFloat(this.MonthlyRevenue1.replace(',', '')) : 0) +
      (this.MonthlyRevenue2.replace(',', '') != "" ? parseFloat(this.MonthlyRevenue2.replace(',', '')) : 0) +
      (this.MonthlyRevenue3.replace(',', '') != "" ? parseFloat(this.MonthlyRevenue3.replace(',', '')) : 0)) / 3.0).toFixed(0).toString();
  }
}

export class IncomeExRowObj {
  Type: string;
  MonthlyAvg: string;
  Comment: string;

  constructor() {
    this.Type = "";
    this.MonthlyAvg = "";
    this.Comment = "";
  }
}

export class FixedExpensesViewInfoObj {
  FixedExpenseRows: FixedExpensesRowObj[];

  FixedMonthlyAvg: string;
  MonthlyExpense1Avg: string;
  MonthlyExpense2Avg: string;
  MonthlyExpense3Avg: string;
  MonthlyAverageAvg: string;
  Expenses: string;


  constructor() {
    this.FixedMonthlyAvg = "";
    this.MonthlyExpense1Avg = "";
    this.MonthlyExpense2Avg = "";
    this.MonthlyExpense3Avg = "";
    this.MonthlyAverageAvg = "";
    this.Expenses = "";


    this.FixedExpenseRows = new Array<FixedExpensesRowObj>(4);
    for (let i = 0; i < 4; i++) {
      this.FixedExpenseRows[i] = new FixedExpensesRowObj();
    }

    this.FixedExpenseRows[0].Type = "חיסכון בלתי מתוכנן";

    this.FixedExpenseRows[1].Type = "קרן חירום";

    this.FixedExpenseRows[2].Type = "חיסכון להוצאות עתידיות";

    this.FixedExpenseRows[3].Type = "חיסכון כללי";

    this.FixedMonthlyAvg = "";
    this.MonthlyExpense1Avg = "";
    this.MonthlyExpense2Avg = "";
    this.MonthlyExpense3Avg = "";
    this.MonthlyAverageAvg = "";
    this.Expenses = "";
  }
}

export class FixedExpensesRowObj {
  Type: string;
  FixedMonthly: string;
  MonthlyExpense1: string;
  MonthlyExpense2: string;
  MonthlyExpense3: string;
  MonthlyAverage: string;
  Comment: string;

  constructor() {
    this.Type = "";
    this.FixedMonthly = "";
    this.MonthlyExpense1 = "";
    this.MonthlyExpense2 = "";
    this.MonthlyExpense3 = "";
    this.MonthlyAverage = "";
    this.Comment = "";
  }


  CalcMonthlyAverage() {
    return (((this.MonthlyExpense1.replace(',', '') != "" ? parseFloat(this.MonthlyExpense1.replace(',', '')) : 0) +
      (this.MonthlyExpense2.replace(',', '') != "" ? parseFloat(this.MonthlyExpense2.replace(',', '')) : 0) +
      (this.MonthlyExpense3.replace(',', '') != "" ? parseFloat(this.MonthlyExpense3.replace(',', '')) : 0)) / 3.0).toFixed(0).toString();
  }
}

export class SavingViewInfoObj {
  SavingRows: SavingRowObj[];

  SavingMonthly: number;
  CurrAmounts: number;


  constructor() {
    this.SavingMonthly = 0;
    this.CurrAmounts = 0;

    this.SavingRows = [];
    /*     this.SavingRows = new Array<SavingRowObj>(10);
        for (let i = 0; i < 10; i++) {
          this.SavingRows[i] = new SavingRowObj();
        } */
  }
}

export class SavingRowObj {
  Type: string;
  FixedMonthly: string;
  CurrentAmount: string;
  Comment: string;

  constructor() {
    this.Type = "";
    this.FixedMonthly = "";
    this.CurrentAmount = "";
    this.Comment = "";
  }


  /* CalcMonthlyAverage() {
    return (((this.MonthlyExpense1.replace(',', '') != "" ? parseFloat(this.MonthlyExpense1.replace(',', '')) : 0) +
      (this.MonthlyExpense2.replace(',', '') != "" ? parseFloat(this.MonthlyExpense2.replace(',', '')) : 0) +
      (this.MonthlyExpense3.replace(',', '') != "" ? parseFloat(this.MonthlyExpense3.replace(',', '')) : 0)) / 3.0).toFixed(0).toString();
  } */
}


export class VariableExpensesViewInfoObj {
  DiffExpenses: number;
  SatisfactionExpenses: number;
  VariableExpensesCategoryRowObj: VariableExpensesCategoryRowObj[];

  constructor() {

    this.DiffExpenses = 0;
    this.SatisfactionExpenses = 0;
    this.VariableExpensesCategoryRowObj = new Array<VariableExpensesCategoryRowObj>(9);
    for (let i = 0; i < 9; i++) {
      this.VariableExpensesCategoryRowObj[i] = new VariableExpensesCategoryRowObj();
    }

    this.VariableExpensesCategoryRowObj[0].CategoryName = "אוכל";
    this.VariableExpensesCategoryRowObj[0].SubType = 3;
    this.VariableExpensesCategoryRowObj[0].CategoryIndex = 0;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[0].SubType; i++) {
      this.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[0].Type = "מזון ומכולת";
    this.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[1].Type = "הזמנת אוכל הביתה";
    this.VariableExpensesCategoryRowObj[0].VariableExpensesRowObj[2].Type = "בילוי ומסעדות";

    this.VariableExpensesCategoryRowObj[1].CategoryName = "חשבונות דיור";
    this.VariableExpensesCategoryRowObj[1].SubType = 7;
    this.VariableExpensesCategoryRowObj[1].CategoryIndex = 1;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[1].SubType; i++) {
      this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[0].Type = "מיסי ישוב (שמירה)";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[1].Type = "משכנתא/שכר דירה";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[2].Type = "ארנונה";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[3].Type = "מים";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[4].Type = "חשמל";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[5].Type = "גז";
    this.VariableExpensesCategoryRowObj[1].VariableExpensesRowObj[6].Type = "וועד בית";

    this.VariableExpensesCategoryRowObj[2].CategoryName = "תקשורת";
    this.VariableExpensesCategoryRowObj[2].SubType = 5;
    this.VariableExpensesCategoryRowObj[2].CategoryIndex = 2;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[2].SubType; i++) {
      this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[0].Type = "טלפון סלולרי";
    this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[1].Type = "טלפון קווי";
    this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[2].Type = "מוצרי חשמל ותקשורת";
    this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[3].Type = "אינטרנט";
    this.VariableExpensesCategoryRowObj[2].VariableExpensesRowObj[4].Type = "טלויזיה (ערוצים ונטפליקס)";

    this.VariableExpensesCategoryRowObj[3].CategoryName = "לבית";
    this.VariableExpensesCategoryRowObj[3].SubType = 5;
    this.VariableExpensesCategoryRowObj[3].CategoryIndex = 3;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[3].SubType; i++) {
      this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[0].Type = "דברים לבית (תמי 4)";
    this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[1].Type = "החזקת הבית (כולל תיקונים)";
    this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[2].Type = "נקיון";
    this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[3].Type = "גינון";
    this.VariableExpensesCategoryRowObj[3].VariableExpensesRowObj[4].Type = "בעלי חיים";

    this.VariableExpensesCategoryRowObj[4].CategoryName = "ילדים";
    this.VariableExpensesCategoryRowObj[4].SubType = 7;
    this.VariableExpensesCategoryRowObj[4].CategoryIndex = 4;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[4].SubType; i++) {
      this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[0].Type = "שיעורים פרטיים";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[1].Type = "גן \ בית ספר וחמרי לימוד";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[2].Type = "הסעות";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[3].Type = "חוגים";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[4].Type = "בייביסיטר";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[5].Type = "ביגוד והנהלה - ילדים";
    this.VariableExpensesCategoryRowObj[4].VariableExpensesRowObj[6].Type = "דמי כיס";

    this.VariableExpensesCategoryRowObj[5].CategoryName = "טיפוח";
    this.VariableExpensesCategoryRowObj[5].SubType = 4;
    this.VariableExpensesCategoryRowObj[5].CategoryIndex = 5;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[5].SubType; i++) {
      this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[0].Type = "ביגוד והנהלה";
    this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[1].Type = "קוסמטיקה";
    this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[2].Type = "מספרה";
    this.VariableExpensesCategoryRowObj[5].VariableExpensesRowObj[3].Type = "מוצרי פארם";

    this.VariableExpensesCategoryRowObj[6].CategoryName = "רכבים ונסיעות";
    this.VariableExpensesCategoryRowObj[6].SubType = 7;
    this.VariableExpensesCategoryRowObj[6].CategoryIndex = 6;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[6].SubType; i++) {
      this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[0].Type = "דלק";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[1].Type = "ביטוחי רכב (מקיף + חובה)";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[2].Type = "רישיון רכב וטסט";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[3].Type = "תיקוני רכבים וטיפולים שוטפים";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[4].Type = "קנסות";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[5].Type = "חניה";
    this.VariableExpensesCategoryRowObj[6].VariableExpensesRowObj[6].Type = "איטוראן - כביש 6";

    this.VariableExpensesCategoryRowObj[7].CategoryName = "פנאי";
    this.VariableExpensesCategoryRowObj[7].SubType = 9;
    this.VariableExpensesCategoryRowObj[7].CategoryIndex = 7;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[7].SubType; i++) {
      this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[0].Type = "בריכה ומכון כושר";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[1].Type = "עיתונים ומנויים";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[2].Type = "מתנות (משפחה,אירועים)";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[3].Type = "חוגים ותחביבים להורים";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[4].Type = "ספרים";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[5].Type = "תרבות ופנאי";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[6].Type = "קפה";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[7].Type = "ציוד טיפוס ואימון";
    this.VariableExpensesCategoryRowObj[7].VariableExpensesRowObj[8].Type = "טיסות וחופשות";

    this.VariableExpensesCategoryRowObj[8].CategoryName = "שונות";
    this.VariableExpensesCategoryRowObj[8].SubType = 6;
    this.VariableExpensesCategoryRowObj[8].CategoryIndex = 8;
    for (let i = 0; i < this.VariableExpensesCategoryRowObj[8].SubType; i++) {
      this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[i] = new VariableExpensesRowObj();
      this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[i].SubCategoryIndex = i;
    }
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[0].Type = "הוצאות ריפוי , וטיפולים";
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[1].Type = "תרופות";
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[2].Type = "שיפוצים לבית";
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[3].Type = "שונות";
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[4].Type = "עמלות בנק וכ.אשראי";
    this.VariableExpensesCategoryRowObj[8].VariableExpensesRowObj[5].Type = "מזומן ללא מעקב";
  }
}

export class VariableExpensesRows4Json {
  CategoryName: string;
  CategoryIndex: number;
  SubType: number;
  Type: string;
  SubCategoryIndex: number;
  CurrExpense: string;
  SatisfactionExpense: string;
  DefferenceExpense: number;
  Anchor: boolean;
  Flexible: boolean;
  GoodToBe: boolean;

  constructor() {
    this.CategoryName = "";
    this.CategoryIndex = 0;
    this.SubCategoryIndex = 0;
    this.SubType = 1;
    this.Type = "";
    this.CurrExpense = "";
    this.SatisfactionExpense = "";
    this.DefferenceExpense = 0;
    this.Anchor = false;
    this.Flexible = false;
    this.GoodToBe = false;
  }
}

export class VariableExpensesCategoryRowObj {
  CategoryName: string;
  CategoryIndex: number;
  SubType: number;
  VariableExpensesRowObj: VariableExpensesRowObj[] = [];


  constructor() {
    this.CategoryName = "";
    this.CategoryIndex = 0;
    this.SubType = 1;
  }

  CalcSum() {

    var sum = 0;

    for (let i = 0; i < this.VariableExpensesRowObj.length; i++) {
      sum += ((this.VariableExpensesRowObj[i].SatisfactionExpense.replace(',', '') != "" ? parseFloat(this.VariableExpensesRowObj[i].SatisfactionExpense.replace(',', '')) : 0));
    }

    //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = satisfactionExpenses.toFixed(0).toString();
    return sum.toFixed(0).toString();
  }
}

export class VariableExpensesRowObj {
  Type: string;
  SubCategoryIndex: number;
  CurrExpense: string;
  SatisfactionExpense: string;
  DefferenceExpense: number;
  Anchor: boolean;
  Flexible: boolean;
  GoodToBe: boolean;

  constructor() {
    this.Type = "";
    this.SubCategoryIndex = 0;
    this.CurrExpense = "";
    this.SatisfactionExpense = "";
    this.DefferenceExpense = 0;
    this.Anchor = false;
    this.Flexible = false;
    this.GoodToBe = false;
  }


}

export class RealEstateViewInfoObj {
  RealEstateRows: RealEstateRowObj[];

  AssetValues: string;
  NortgageBalances: string;
  NetWorths: number;


  constructor() {
    this.AssetValues = "";
    this.NortgageBalances = "";
    this.NetWorths = 0;


    this.RealEstateRows = [];
    /*     this.RealEstateRows = new Array<RealEstateRowObj>(10);
        for (let i = 0; i < 10; i++) {
          this.RealEstateRows[i] = new RealEstateRowObj();
        }
     */
    this.AssetValues = "";
    this.NortgageBalances = "";
    this.NetWorths = 0;
  }
}

export class RealEstateRowObj {
  Description: string;
  AssetValue: string;
  NortgageBalance: string;
  NetWorth: number;
  Comment: string;

  constructor() {
    this.Description = "";
    this.AssetValue = "";
    this.NortgageBalance = "";
    this.NetWorth = 0;
    this.Comment = "";
  }


  CalcNetNetWorth() {

    this.NetWorth = ((this.AssetValue.replace(',', '') != "" ? parseFloat(this.AssetValue.replace(',', '')) : 0) -
      (this.NortgageBalance.replace(',', '') != "" ? parseFloat(this.NortgageBalance.replace(',', '')) : 0));

    return ((this.AssetValue.replace(',', '') != "" ? parseFloat(this.AssetValue.replace(',', '')) : 0) -
      (this.NortgageBalance.replace(',', '') != "" ? parseFloat(this.NortgageBalance.replace(',', '')) : 0)).toFixed(0).toString();
  }
}

export class VehiclesViewInfoObj {
  VehicleWorths: number;
  PriceOfFuel: string;
  VehiclesRows: VehiclesRowObj[];

  constructor() {

    this.VehicleWorths = 0;
    this.PriceOfFuel = "";
    this.VehiclesRows = [];
/*     this.VehiclesRows = new Array<VehiclesRowObj>(10);
    for (let i = 0; i < 10; i++) {
      this.VehiclesRows[i] = new VehiclesRowObj();
    }
 */  }
}

export class VehiclesRowObj {
  Description: string;
  YearOfProduction: string;
  VehicleWorth: string;
  KmPerYear: string;
  FuelConsumption: string;
  Test: string;
  Insurance: string;
  Treatments: string;
  Comment: string;

  constructor() {
    this.Description = "";
    this.YearOfProduction = "";
    this.VehicleWorth = "";
    this.KmPerYear = "";
    this.FuelConsumption = "";
    this.Test = "";
    this.Insurance = "";
    this.Treatments = "";
    this.Comment = "";
  }

  CalcAnalysis(priceOfFuel: string) {
    const nf = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0
    });

    if (this.KmPerYear != "")
      return `אחזקת הרכב עולה לנו ${nf.format((((parseInt(this.KmPerYear) / parseFloat(this.FuelConsumption)) * parseFloat(priceOfFuel)) + parseInt(this.Test) + parseInt(this.Insurance) + parseInt(this.Treatments)))} בשנה`;
    else
      return "";
  }
}

export class FinanceAssetsViewInfoObj {
  FinanceLiquidityAssets: number;
  FinanceUnliquidityAssets: number;
  FinanceliquidityAssetsRows: FinanceAssetRowObj[];
  FinanceUnliquidityAssetsRows: FinanceAssetRowObj[];
  SumFinance: number;

  constructor() {

    this.FinanceLiquidityAssets = 0;
    this.FinanceUnliquidityAssets = 0;
    this.FinanceliquidityAssetsRows = [];
    this.FinanceUnliquidityAssetsRows = [];
    this.SumFinance = 0;
    /*    this.FinanceliquidityAssetsRows = new Array<FinanceAssetRowObj>(12);
       for (let i = 0; i < 12; i++) {
         this.FinanceliquidityAssetsRows[i] = new FinanceAssetRowObj();
       }
       this.FinanceUnliquidityAssetsRows = new Array<FinanceAssetRowObj>(12);
       for (let i = 0; i < 12; i++) {
         this.FinanceUnliquidityAssetsRows[i] = new FinanceAssetRowObj();
       } */
  }
}

export class FinanceAssetRowObj {
  DescriptionSaving: string;
  WhereSaving: string;
  CurrentAmount: string;
  Comment: string;

  constructor() {
    this.DescriptionSaving = "";
    this.WhereSaving = "";
    this.CurrentAmount = "";
    this.Comment = "";
  }
}

export class CurrentFlowViewInfoObj {
  itemsRows: itemsRowObj[];
  CurrCash: string;
  RecommendedAdd2Cash: number;
  RecommendedAdd2CashDate:string;
  constructor() {
    this.itemsRows = [];
    this.CurrCash = "";
    this.RecommendedAdd2Cash = 0;
    this.RecommendedAdd2CashDate = "";
  }

  CalcNetSum(idx: number) {

    let netSum = 0;
    for (let i = 0; i <= idx; i++) {
      if (this.itemsRows[i].Type == "הוצאה")
        netSum -= parseInt(this.itemsRows[i].CurrAmount.replace(',', ''));
      else if (this.itemsRows[i].Type == "הכנסה")
        netSum += parseInt(this.itemsRows[i].CurrAmount.replace(',', ''));
      else
        netSum -= parseInt(this.itemsRows[i].CurrAmount.replace(',', ''));
      //this.EndDate = (this.CurrAmount.replace(',', '') != "" && this.MonthlyPayment.replace(',', '') != "") ? ((parseInt(this.CurrAmount.replace(',', '')) / (parseInt(this.MonthlyPayment.replace(',', ''))) / 12)) : 0;
      //console.log(this.EndDate);

      this.itemsRows[i].NetSum = netSum.toString();
    }
    return netSum;
  }

  CalcNeedInFirstDay() {
    let minSum = 9999999;

    for (let i = 0; i < this.itemsRows.length; i++) {
      if (parseInt(this.itemsRows[i].NetSum) < minSum) {
        minSum = parseInt(this.itemsRows[i].NetSum);
      }
    }

    if (minSum < 0)
      return Math.abs(minSum) + 3000;
    else
      return Math.min(3000, minSum);
  }

  CheckExistCash() 
{
    let currCash = parseFloat(this.CurrCash.replace(',', ''));

    // Get the current date
    const currentDate = new Date();

    // Get the day and month
    const day = currentDate.getDate(); // Returns the day of the month (1-31)
    const month = currentDate.getMonth() + 1; // Returns the month (0-11), so we add 1 to get the actual month (1-12)

    const dateOfSalery = parseInt(this.itemsRows.find(item => item.Comment === "משכורת")?.Date ?? "0");

    let sum = currCash;
    let problemDay = "";

    if (day < dateOfSalery) {
      this.itemsRows.forEach(element => {
        if (parseInt(element.Date) >= day && parseInt(element.Date) <= dateOfSalery) {
          if (element.Comment != "משכורת") {
            if (element.Type != "הכנסה") {
              sum -= parseFloat(element.CurrAmount.replace(',', ''));
            }
            else
              sum += parseFloat(element.CurrAmount.replace(',', ''));
          }
        }

        if (sum <= 0 && problemDay == "")
        {
           if (parseInt(element.Date) >= day) 
            problemDay = ` - ${element.Date.padStart(2,'0')}/${String(month).padStart(2,'0')}`;
           else
            problemDay = ` - ${element.Date.padStart(2,'0')}/${String(month + 1).padStart(2,'0')}`;
        }
      });
    }
    else {
      this.itemsRows.forEach(element => {
        if (parseInt(element.Date) >= day || parseInt(element.Date) < dateOfSalery) {
          if (element.Comment != "משכורת") {
            if (element.Type != "הכנסה") {
              sum -= parseFloat(element.CurrAmount.replace(',', ''));
            }
            else
              sum += parseFloat(element.CurrAmount.replace(',', ''));
          }
        }

        if (sum <= 0 && problemDay == "")
        {
           if (parseInt(element.Date) >= day) 
            problemDay = ` - ${element.Date.padStart(2,'0')}/${String(month).padStart(2,'0')}`;
           else
            problemDay = ` - ${element.Date.padStart(2,'0')}/${String(month + 1).padStart(2,'0')}`;
        }
      });
    }

    
    if (sum < 0)
    {
      console.debug(`problemDay = ${problemDay}`);
      this.RecommendedAdd2Cash  = (Math.ceil(Math.abs(sum) / 1000) * 1000) + 1000;
      this.RecommendedAdd2CashDate = problemDay
    }
    else
    {
      this.RecommendedAdd2Cash  = 0;
      this.RecommendedAdd2CashDate  = "";
    }
  }
}

export class itemsRowObj {
  Date: string;
  Type: string;
  CurrAmount: string;
  Comment: string;
  NetSum: string;

  constructor() {
    this.Date = "";
    this.Type = "";
    this.CurrAmount = "";
    this.NetSum = "";
    this.Comment = "";
  }
}

export class CommitmentsViewInfoObj {
  CommitmentsRows: CommitmentsRowObj[];
  CurrentAmount: number;
  MonthlyPayment: number;
  MaxYearsPayment: number;
  LiquidationOfCommitments: LiquidationOfCommitmentsObj;

  constructor() {
    this.CurrentAmount = 0;
    this.MonthlyPayment = 0;
    this.MaxYearsPayment = 0;

    this.CommitmentsRows = [];

    /* this.CommitmentsRows = new Array<CommitmentsRowObj>(10);
    for (let i = 0; i < 10; i++) {
      this.CommitmentsRows[i] = new CommitmentsRowObj();
    }
 */
    this.LiquidationOfCommitments = new LiquidationOfCommitmentsObj();
    this.LiquidationOfCommitments.SumOfYearsPayment = 0;
    this.LiquidationOfCommitments.Add2Payment = 1000;
  }

  RoundToDecimalPlace(number: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  BuildingASstrategyOfLiquidationOfCommitments() {
    //console.log(this.LiquidationOfCommitments.Add2Payment);
    //console.log(this.CommitmentsRows);
    let numOfCommitments = this.GetNumOfCommitments();
    let CommitmentsIdx = 0;
    //console.log(numOfCommitments);
    this.LiquidationOfCommitments.LiquidationOfCommitmentsRows = new Array<Array<LiquidationOfCommitmentsRowsObj>>(numOfCommitments);
    for (let i = 0; i < numOfCommitments; i++) {
      this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i] = new Array<LiquidationOfCommitmentsRowsObj>(numOfCommitments);
      for (let j = 0; j < this.CommitmentsRows.length; j++) {
        if (this.CommitmentsRows[j].MonthlyPayment != "" && this.CommitmentsRows[j].CurrAmount != "") {
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][CommitmentsIdx] = new LiquidationOfCommitmentsRowsObj();
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][CommitmentsIdx].CurrAmount = parseInt(this.CommitmentsRows[j].CurrAmount.replace(',', ''));
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][CommitmentsIdx].EndDate = this.CommitmentsRows[j].EndDate;
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][CommitmentsIdx].MonthlyPayment = parseInt(this.CommitmentsRows[j].MonthlyPayment.replace(',', ''));
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][CommitmentsIdx].TheLender = this.CommitmentsRows[j].TheLender;
          CommitmentsIdx++;
        }
      }
      this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i].sort((a, b) => a.CurrAmount - b.CurrAmount);
    }

    //console.log(this.LiquidationOfCommitments.LiquidationOfCommitmentsRows);

    let firstYearsPayment = 0;
    this.LiquidationOfCommitments.SumOfYearsPayment = 0;

    for (let i = 0; i < numOfCommitments; i++) {
      if (i == 0)
        this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][i].MonthlyPayment = parseInt(this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][i].MonthlyPayment.toString()) + parseInt(this.LiquidationOfCommitments.Add2Payment.toString());
      else {
        this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][i].MonthlyPayment = parseInt(this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][i].MonthlyPayment.toString()) + parseInt(this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i - 1][i - 1].MonthlyPayment.toString());

      }

      for (let j = 0; j < numOfCommitments; j++) {
        if (j < i) {
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].MonthlyPayment = 0;
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].EndDate = 0;
        }
        else {
          this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].EndDate = this.RoundToDecimalPlace((this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].CurrAmount / this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].MonthlyPayment) / 12, 1);
          if (j == i)
            firstYearsPayment = this.LiquidationOfCommitments.LiquidationOfCommitmentsRows[i][j].EndDate;
        }
      }
      this.LiquidationOfCommitments.SumOfYearsPayment = this.LiquidationOfCommitments.SumOfYearsPayment + this.RoundToDecimalPlace(firstYearsPayment, 1);
      //console.log(`maxYearsPayment - ${firstYearsPayment} `);
      //console.log(`sumOfYearsPayment - ${this.SumOfYearsPayment} `);


    }
    return this.RoundToDecimalPlace(this.LiquidationOfCommitments.SumOfYearsPayment, 1);
  }

  GetNumOfCommitments() {
    let numOfCommitments = 0;

    for (let i = 0; i < this.CommitmentsRows.length; i++) {
      if (this.CommitmentsRows[i].MonthlyPayment.replace(',', '') != "" && this.CommitmentsRows[i].CurrAmount.replace(',', '') != "") {
        numOfCommitments++;
      }
    }

    return numOfCommitments;
  }
}

export class LiquidationOfCommitmentsObj {
  LiquidationOfCommitmentsRows: LiquidationOfCommitmentsRowsObj[][];
  SumOfYearsPayment: number;
  Add2Payment: number;
  constructor() {
    this.LiquidationOfCommitmentsRows = [];
    this.SumOfYearsPayment = 0;
    this.Add2Payment = 0;;
  }
}

export class LiquidationOfCommitmentsRowsObj {
  TheLender: string;
  CurrAmount: number;
  MonthlyPayment: number;
  EndDate: number;

  constructor() {
    this.TheLender = "";
    this.CurrAmount = 0;
    this.MonthlyPayment = 0;
    this.EndDate = 0;
  }
}


export class CommitmentsRowObj {
  TheLender: string;
  ExecutionDate: string;
  OriginalAmount: string;
  CurrAmount: string;
  MonthlyPayment: string;
  EndDate: number;
  Interest: string;
  Comment: string;

  constructor() {
    this.TheLender = "";
    this.ExecutionDate = "";
    this.OriginalAmount = "";
    this.CurrAmount = "";
    this.MonthlyPayment = "";
    this.EndDate = 0;
    this.Interest = "";
    this.Comment = "";
  }

  CalcEndDate() {
    //console.log("CalcEndDate");
    this.EndDate = (this.CurrAmount.replace(',', '') != "" && this.MonthlyPayment.replace(',', '') != "") ? ((parseInt(this.CurrAmount.replace(',', '')) / (parseInt(this.MonthlyPayment.replace(',', ''))) / 12)) : 0;
    //console.log(this.EndDate);

    return this.EndDate.toFixed(1).toString();
  }

}

export class MortgagesViewInfoObj {
  MortgagesRows: MortgagesRowObj[];
  CurrentAmounts: number;
  MonthlyPayments: number;
  MaxMonthlyPayments: number;
  RemainingMortgages: number;
  CostOfFinancings: number;

  constructor() {
    this.CurrentAmounts = 0;
    this.MonthlyPayments = 0;
    this.MaxMonthlyPayments = 0;
    this.RemainingMortgages = 0;
    this.CostOfFinancings = 0;


    this.MortgagesRows = [];
    /* this.MortgagesRows = new Array<MortgagesRowObj>(10);
    for (let i = 0; i < 10; i++) {
      this.MortgagesRows[i] = new MortgagesRowObj();
    } */
  }
}


export class MortgagesRowObj {
  Name: string;
  Route: string;
  OriginalAmount: string;
  CurrAmount: string;
  Interest: string;
  YearToEnd: string;
  Linkage: string;
  MonthlyPayment: string;
  RemainingMortgage: string;
  CostOfFinancing: string;

  constructor() {
    this.Name = "";
    this.Route = "";
    this.OriginalAmount = "";
    this.CurrAmount = "";
    this.Interest = "";
    this.YearToEnd = "";
    this.Linkage = "";
    this.MonthlyPayment = "";
    this.RemainingMortgage = "";
    this.CostOfFinancing = "";
  }

  calculateRate(
    paymentsPerYear: number,
    paymentAmount: number,
    presentValue: number,
    futureValue: number
  ) {
    //If interest, futureValue, dueEndorBeginning was not set, set now

    let interest = 0.01;

    if (futureValue == null) futureValue = 0;

    let dueEndOrBeginning = 0;

    var FINANCIAL_MAX_ITERATIONS = 1280; //Bet accuracy with 128
    var FINANCIAL_PRECISION = 0.0000001; //1.0e-8

    var y,
      y0,
      y1,
      x0,
      x1 = 0,
      f = 0,
      i = 0;
    var rate = interest;
    if (Math.abs(rate) < FINANCIAL_PRECISION) {
      y =
        presentValue * (1 + paymentsPerYear * rate) +
        paymentAmount * (1 + rate * dueEndOrBeginning) * paymentsPerYear +
        futureValue;
    } else {
      f = Math.exp(paymentsPerYear * Math.log(1 + rate));
      y =
        presentValue * f +
        paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
        futureValue;
    }
    y0 = presentValue + paymentAmount * paymentsPerYear + futureValue;
    y1 =
      presentValue * f +
      paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
      futureValue;

    // find root by Newton secant method
    i = x0 = 0.0;
    x1 = rate;
    while (
      Math.abs(y0 - y1) > FINANCIAL_PRECISION &&
      i < FINANCIAL_MAX_ITERATIONS
    ) {
      rate = (y1 * x0 - y0 * x1) / (y1 - y0);
      x0 = x1;
      x1 = rate;

      if (Math.abs(rate) < FINANCIAL_PRECISION) {
        y =
          presentValue * (1 + paymentsPerYear * rate) +
          paymentAmount *
          (1 + rate * dueEndOrBeginning) *
          paymentsPerYear +
          futureValue;
      } else {
        f = Math.exp(paymentsPerYear * Math.log(1 + rate));
        y =
          presentValue * f +
          paymentAmount * (1 / rate + dueEndOrBeginning) * (f - 1) +
          futureValue;
      }

      y0 = y1;
      y1 = y;
      ++i;
    }
    return rate * 100;
  }

  /* let numberOfPeriods = 12;
  let payment = 0;
  let presentValue = 1;
  let futureValue = -1.035;
  let type = 1;
  let guess = 0;
  
  let keren = 250000;
  let linkageYearly = 3.5;
  let interestYearly = 3.2;
  let numOfMonths = 360;
  let linkage = 1.035; // 3.5% linkage
  let baseIndex = 100;
  let lastMadadEndOfMount = 100;
   */
  calculateLoanDetails() {

    let baseIndex = 100;
    let lastMadadEndOfMount = 100;
    let keren = parseInt(this.CurrAmount.replace(',', ''));

    if (this.Interest == "" || this.YearToEnd == "" || this.CurrAmount == "" || this.Linkage == "" || this.Route == "") {

      //const monthlyInterestRate = (parseFloat(this.Interest.replace(',', '')) / 100) / 12;
      //const numberOfMonths = parseInt(this.YearToEnd) * 12;

      // Calculate monthly payment
      const monthlyPayment = "0";
      // Calculate total principal
      const totalPrincipalWithLinkage = "0";
      // Calculate total interest
      //const totalInterest = "0";

      // Calculate financing cost
      const financingCost = "0";

      //const totalAmount = "0";

      const maxMonthlyPayment = "0";

      return {
        monthlyPayment,
        maxMonthlyPayment,
        totalPrincipalWithLinkage,
        financingCost,
      };
    }
    else {

      let linkage = 1 + parseFloat(this.Linkage.replace(',', '')) / 100;

      let currMonthlyInterest = parseFloat(this.Interest.replace(',', '')) / 100 / 12;
      const numberOfMonths = parseInt(this.YearToEnd);
      //console.log(numberOfMonths);
      // Calculate monthly payment
      const monthlyPayment = (
        (keren * currMonthlyInterest) /
        (1 - Math.pow(1 + currMonthlyInterest, -numberOfMonths))
      ).toFixed(0);
      //console.log(monthlyPayment);
      // Calculate total principal
      const totalPrincipal = keren.toFixed(0);
      // Calculate total interest

      //console.log(`totalInterest: ${totalInterest}`);
      const totalAmount = (
        keren +
        (parseInt(monthlyPayment) * numberOfMonths - keren)
      ).toFixed(0);

      // Calculate financing cost


      const monthlyInterestRate = this.calculateRate(12, 0, 1, 0 - linkage);
      //console.log(`Monthly Interest Rate: ${monthlyInterestRate}`);
      //const monthlyPayment = calculateLoanDetails();
      //console.log(`Monthly Payment: ${monthlyPayment.monthlyPayment}`);
      //console.log(CalculateYearsToFinancialIndependence(20000,18000,2000,0,0,0,0.04,0.07).NumberOfYears);
      //console.log(CalculateYearsToFinancialIndependence(20000,18000,2000,0,0,0,0.04,0.07).Amount);

      //console.log(`Monthly Inter calculated: ${interestYearly}`);
      //console.log(`Monthly Inter calculated2: ${interestYearly / 100}`);
      //console.log(`Monthly Inter calculated2: ${monthlyInterest}`);

      let maxNMonthlyPayment = -1;
      let maxNMonthlyPayment1 = -1;
      let totalNPrincipalWithLinkage = 0;
      let totalNPrincipalWithLinkage1 = 0;
      for (let i = 1; i <= numberOfMonths; i++) {
        //console.log(`monthly - ${i}`);
        let inter = (keren * currMonthlyInterest).toFixed(2);
        let mountlyKeren = (
          parseFloat(monthlyPayment) - parseFloat(inter)
        ).toFixed(0);

        //console.log(`Monthly Inter calculated: ${inter}`);
        //console.log(`Monthly Keren calculated: ${mountlyKeren}`);
        keren = keren - parseFloat(mountlyKeren);
        //console.log(`Curr Keren calculated: ${keren}`);
        if (i == 1) {
          lastMadadEndOfMount += monthlyInterestRate;
          //console.log(`Last Madad End Of Mount calculated: ${lastMadadEndOfMount}`);
        } else {
          lastMadadEndOfMount =
            lastMadadEndOfMount +
            (monthlyInterestRate * lastMadadEndOfMount) / 100;
          //console.log(`Last Madad End Of Mount calculated: ${lastMadadEndOfMount}`);
        }

        let endMonthlyKeren = (lastMadadEndOfMount / baseIndex) * keren;
        //console.log(`End Monthly Keren calculated: ${endMonthlyKeren}`);
        let sumMonthlyPayment =
          (lastMadadEndOfMount / baseIndex) * parseFloat(monthlyPayment);

        let sumMonthlyPayment1 =
          (lastMadadEndOfMount / baseIndex) * parseFloat((parseInt(this.CurrAmount.replace(',','')) *  currMonthlyInterest).toFixed(0).toString());


        if (sumMonthlyPayment > maxNMonthlyPayment)
          maxNMonthlyPayment = sumMonthlyPayment;

          if (sumMonthlyPayment1 > maxNMonthlyPayment1)
          maxNMonthlyPayment1 = sumMonthlyPayment1;


        //console.log(`Sum Monthly Payment calculated: ${sumMonthlyPayment} - ${i}`);
        totalNPrincipalWithLinkage += sumMonthlyPayment;
        //console.log(`TotalPrincipalWithLinkage: ${totalNPrincipalWithLinkage} - ${i}`);
        totalNPrincipalWithLinkage1 += sumMonthlyPayment1;
      }

      const totalInterest = (
        totalNPrincipalWithLinkage - keren
      ).toFixed(0);
     
      let maxMonthlyPayment = maxNMonthlyPayment.toFixed(0).toString();
      let totalPrincipalWithLinkage = totalNPrincipalWithLinkage.toFixed(0).toString();
      let financingCost = (parseInt(totalPrincipalWithLinkage.replace(',','')) - parseInt(this.CurrAmount.replace(',',''))).toFixed(0).toString();

      if (this.Route == "בוליט חלקי")
    {
        let monthlyPayment =  (parseInt(this.CurrAmount.replace(',','')) *  currMonthlyInterest).toFixed(0).toString();
        let maxMonthlyPayment =  ((parseInt(this.CurrAmount.replace(',','')) *  currMonthlyInterest) + totalNPrincipalWithLinkage1 + parseInt(this.CurrAmount.replace(',',''))).toFixed(0).toString();
       
        //console.debug(totalNPrincipalWithLinkage1);

        //console.debug(this.CurrAmount);
        //console.debug(currMonthlyInterest);
        //console.debug(monthlyPayment);

        let totalPrincipalWithLinkage =  (totalNPrincipalWithLinkage1 - parseInt(monthlyPayment.replace(',','')) + parseInt(this.CurrAmount.replace(',','')) +  (parseInt(monthlyPayment.replace(',','')) * parseInt(this.YearToEnd.replace(',','')))).toFixed(0).toString();
        let financingCost = (totalNPrincipalWithLinkage1 - parseInt(monthlyPayment.replace(',','')) + parseInt(monthlyPayment.replace(',','')) * parseInt(this.YearToEnd.replace(',',''))).toFixed(0).toString();
        //console.debug(totalPrincipalWithLinkage);
        //console.debug(financingCost);

      return {
        monthlyPayment,
        maxMonthlyPayment,
        totalPrincipalWithLinkage,
        financingCost
      };

    }
    else
    {
      return {
        monthlyPayment,
        maxMonthlyPayment,
        totalPrincipalWithLinkage,
        financingCost
      };
    }


    
    }
  }
}

/* 
  calculateLoanDetails() {
 
    if (this.Interest == "" || this.YearToEnd == "" || this.CurrAmount == "" || this.linkage == "") {
 
      const monthlyInterestRate = (parseFloat(this.Interest.replace(',', '')) / 100) / 12;
      const numberOfMonths = parseInt(this.YearToEnd) * 12;
 
      // Calculate monthly payment
      const monthlyPayment = "0";
      // Calculate total principal
      const totalPrincipal = "0";
      // Calculate total interest
      const totalInterest = "0";
 
      // Calculate financing cost
      const financingCost = "0";
 
      const totalAmount = "0";
 
      return {
        monthlyPayment,
        totalPrincipal,
        totalInterest,
        totalAmount,
        financingCost
      };
 
    }
    else {
 
 
      const linkage = 1 + 0.035; // 3.5% linkage
 
      // Convert annual interest rate to monthly rate and number of months
      const monthlyInterestRate = (parseFloat(this.Interest.replace(',', '')) / 100) / 12;
      //console.log(monthlyInterestRate);
      const numberOfMonths = parseInt(this.YearToEnd) * 12;
      //console.log(numberOfMonths);
      // Calculate monthly payment
      const monthlyPayment = ((parseInt(this.CurrAmount.replace(',', '')) * monthlyInterestRate) /
        (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(0);
      //console.log(numberOfMonths);
      // Calculate total principal
      const totalPrincipal = parseInt(this.CurrAmount.replace(',', '')).toFixed(0);
      // Calculate total interest
      const totalInterest = ((parseInt(monthlyPayment) * numberOfMonths) - parseInt(this.CurrAmount.replace(',', ''))).toFixed(0);
 
      const totalAmount = (parseInt(this.CurrAmount.replace(',', '')) + ((parseInt(monthlyPayment) * numberOfMonths) - parseInt(this.CurrAmount.replace(',', '')))).toFixed(0);
 
      // Calculate financing cost
      const financingCost = parseInt(totalInterest).toFixed(0);
 
      return {
        monthlyPayment,
        totalPrincipal,
        totalInterest,
        totalAmount,
        financingCost
      };
    }
 
  }
 
}
 */
export class LossOfWorkingCapacityViewInfoObj {
  GrossForPension: string[];
  SocialSecurity: string[];
  PensionFund: string[];
  ManagerInsurance: string[];
  PrivateInsurance: string[];
  MaximumAmount: string[];
  SumSource: number[];
  SumGapSource: number[];

  constructor() {
    this.GrossForPension = new Array<string>(2);
    this.SocialSecurity = new Array<string>(2);
    this.PensionFund = new Array<string>(2);
    this.ManagerInsurance = new Array<string>(2);
    this.PrivateInsurance = new Array<string>(2);
    this.MaximumAmount = new Array<string>(2);
    this.SumSource = new Array<number>(2);
    this.SumGapSource = new Array<number>(2);
    for (let i = 0; i < 2; i++) {
      this.GrossForPension[i] = "";
      this.SocialSecurity[i] = "";
      this.PensionFund[i] = "";
      this.ManagerInsurance[i] = "";
      this.PrivateInsurance[i] = "";
      this.MaximumAmount[i] = "";
      this.SumSource[i] = 0;
      this.SumGapSource[i] = 0;
    }
  }
}

export class LifeInsurancesViewInfoObj {
  LifeInsuranceRows: LifeInsuranceRow[][];
  CapitalAmounts: number[];
  MonthlyAllowances: number[];

  constructor() {
    this.CapitalAmounts = new Array<number>(2);
    this.MonthlyAllowances = new Array<number>(2);

    this.LifeInsuranceRows = new Array<Array<LifeInsuranceRow>>(2);
    for (let i = 0; i < 2; i++) {
      this.LifeInsuranceRows[i] = [];

      /*  this.LifeInsuranceRows[i] = new Array<LifeInsuranceRow>(4);
       for (let j = 0; j < 4; j++) {
         this.LifeInsuranceRows[i][j] = new LifeInsuranceRow();
       } */
    }

    for (let i = 0; i < 2; i++) {
      this.CapitalAmounts[i] = 0;
      this.MonthlyAllowances[i] = 0;
    }
  }
}

export class LifeInsuranceRow {
  Name: string;
  CapitalAmount: string;
  MonthlyAllowance: number;
  Comment: string;

  constructor() {
    this.Name = "";
    this.CapitalAmount = "";
    this.MonthlyAllowance = 0;
    this.Comment = "";
  }


  CalcMonthlyAllowance(partnerAge: string, annualInterestRate: string) {
    if (this.CapitalAmount != "") {
      // חישוב ריבית חודשית
      const monthlyInterestRate = (parseFloat(annualInterestRate) / 12) / 100;

      // חישוב מספר התשלומים הכוללים
      const numberOfPayments = (90 - parseInt(partnerAge)) * 12;

      // חישוב הקצבה החודשית באמצעות הנוסחה
      const monthlyPayment = parseInt(((parseInt(this.CapitalAmount.replace(',', '')) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)).toFixed(0).toString());

      this.MonthlyAllowance = monthlyPayment;
      return monthlyPayment;
    }
    return 0;
  }
}

export class LifeLongCareInsurancesViewInfoObj {
  LifeLongCareInsurancesInHealthFund: LifeLongCareInsurancesInHealthFundObj[];
  LifeLongCareInsurancesInInsuranceCompanyRows: LifeLongCareInsurancesInInsuranceCompanyRowObj[][];
  LifeLongCareInsurancesInInsuranceCompany4ChildrensRows: LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj[];
  First5YearHomeAmounts: number[];
  Over6YearHomeAmounts: number[];
  First5YearSeudiAmounts: number[];
  Over6YearSeudiAmounts: number[];
  constructor() {

    this.First5YearHomeAmounts = new Array<number>(2);
    this.Over6YearHomeAmounts = new Array<number>(2);
    this.First5YearSeudiAmounts = new Array<number>(2);
    this.Over6YearSeudiAmounts = new Array<number>(2);

    this.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows = [];
    /*     this.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows = new Array<LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj>(8);
        for (let i = 0; i < 8; i++) {
          this.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows[i] = new LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj();
        }
     */
    this.LifeLongCareInsurancesInHealthFund = new Array<LifeLongCareInsurancesInHealthFundObj>(2);
    for (let i = 0; i < 2; i++) {
      this.LifeLongCareInsurancesInHealthFund[i] = new LifeLongCareInsurancesInHealthFundObj();
    }

    this.LifeLongCareInsurancesInInsuranceCompanyRows = new Array<Array<LifeLongCareInsurancesInInsuranceCompanyRowObj>>(2);
    for (let i = 0; i < 2; i++) {
      this.LifeLongCareInsurancesInInsuranceCompanyRows[i] = [];
/*       this.LifeLongCareInsurancesInInsuranceCompanyRows[i] = new Array<LifeLongCareInsurancesInInsuranceCompanyRowObj>(4);
      for (let j = 0; j < 4; j++) {
        this.LifeLongCareInsurancesInInsuranceCompanyRows[i][j] = new LifeLongCareInsurancesInInsuranceCompanyRowObj();
      }
 */    }
  }
}

export class LifeLongCareInsurancesInHealthFundObj {
  Name: string;
  HomeAmount: string;
  SeudiAmount: string;

  constructor() {
    this.Name = "";
    this.HomeAmount = "";
    this.SeudiAmount = "";
  }
}


export class LifeLongCareInsurancesInInsuranceCompanyRowObj {
  Name: string;
  First5YearHomeAmount: string;
  Over6YearHomeAmount: string;
  First5YearSeudiAmount: string;
  Over6YearSeudiAmount: string;

  constructor() {
    this.Name = "";
    this.First5YearHomeAmount = "";
    this.Over6YearHomeAmount = "";
    this.First5YearSeudiAmount = "";
    this.Over6YearSeudiAmount = "";
  }


  /*   CalcMonthlyAllowance(partnerAge: string, annualInterestRate: string) {
      if (this.CapitalAmount != "") {
        // חישוב ריבית חודשית
        const monthlyInterestRate = (parseFloat(annualInterestRate) / 12) / 100;
  
        // חישוב מספר התשלומים הכוללים
        const numberOfPayments = (90 - parseInt(partnerAge)) * 12;
  
        // חישוב הקצבה החודשית באמצעות הנוסחה
        const monthlyPayment = parseInt(((parseInt(this.CapitalAmount.replace(',', '')) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)).toFixed(0).toString());
  
        this.MonthlyAllowance = monthlyPayment;
        return monthlyPayment;
      }
      return 0;
    } */
}

export class LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj {
  ChildName: string;
  Name: string;
  First5YearHomeAmount: string;
  Over6YearHomeAmount: string;
  First5YearSeudiAmount: string;
  Over6YearSeudiAmount: string;

  constructor() {
    this.ChildName = "";
    this.Name = "";
    this.First5YearHomeAmount = "";
    this.Over6YearHomeAmount = "";
    this.First5YearSeudiAmount = "";
    this.Over6YearSeudiAmount = "";
  }

  /*   CalcMonthlyAllowance(partnerAge: string, annualInterestRate: string) {
      if (this.CapitalAmount != "") {
        // חישוב ריבית חודשית
        const monthlyInterestRate = (parseFloat(annualInterestRate) / 12) / 100;
  
        // חישוב מספר התשלומים הכוללים
        const numberOfPayments = (90 - parseInt(partnerAge)) * 12;
  
        // חישוב הקצבה החודשית באמצעות הנוסחה
        const monthlyPayment = parseInt(((parseInt(this.CapitalAmount.replace(',', '')) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)).toFixed(0).toString());
  
        this.MonthlyAllowance = monthlyPayment;
        return monthlyPayment;
      }
      return 0;
    } */
}

export class HealthInsuranceViewInfoObj {
  HealthInsuranceRows: HealthInsuranceRowObj[];

  constructor() {
    this.HealthInsuranceRows = [];
/*     this.HealthInsuranceRows = new Array<HealthInsuranceRowObj>(10);
    for (let i = 0; i < 10; i++) {
      this.HealthInsuranceRows[i] = new HealthInsuranceRowObj();
    }
 */  }
}

export class HealthInsuranceRowObj {
  NameOfInsured: string;
  NameOfHealthInsurance: string;
  SupplementaryInsurance: boolean;
  PrivateInsurancDescription: string;

  constructor() {
    this.NameOfInsured = "";
    this.NameOfHealthInsurance = "";
    this.SupplementaryInsurance = false;
    this.PrivateInsurancDescription = "";
  }
}

export class PensiaViewInfoObj {
  ManagerInsurance: ManagerInsuranceObj[];
  PensionFund: PensionFundObj[];
  Gemel: GemelObj[];
  OldPensionFund: OldPensionFundObj[];
  SocialSecurityBenefits: SocialSecurityBenefitsObj[];
  PensionJoint: PensionJointObj;
  SumMonthlyPensia: number[];
  constructor() {
    this.SumMonthlyPensia = new Array<number>(2);

    this.ManagerInsurance = new Array<ManagerInsuranceObj>(2);
    for (let i = 0; i < 2; i++) {
      this.ManagerInsurance[i] = new ManagerInsuranceObj();
    }

    this.PensionFund = new Array<PensionFundObj>(2);
    for (let i = 0; i < 2; i++) {
      this.PensionFund[i] = new PensionFundObj();
    }

    this.Gemel = new Array<GemelObj>(2);
    for (let i = 0; i < 2; i++) {
      this.Gemel[i] = new GemelObj();
    }


    this.OldPensionFund = new Array<OldPensionFundObj>(2);
    for (let i = 0; i < 2; i++) {
      this.OldPensionFund[i] = new OldPensionFundObj();
    }

    this.SocialSecurityBenefits = new Array<SocialSecurityBenefitsObj>(2);
    for (let i = 0; i < 2; i++) {
      this.SocialSecurityBenefits[i] = new SocialSecurityBenefitsObj();
    }

    this.PensionJoint = new PensionJointObj();
  }
}

export class ManagerInsuranceObj {
  ManagerInsuranceRows: ManagerInsuranceRowObj[];
  CurrentCapitalAmounts: number;
  MonthlyDepositAmounts: number;
  LumpSums: number;
  CapitalAmountInCaseOfDeaths: number;
  CapitalAmountInCasePensions: number;
  MonthlyAllowances: number;
  ManagerInsuranceMonthlyAllowances: number;


  constructor() {
    this.ManagerInsuranceRows = [];
    /*     this.ManagerInsuranceRows = new Array<ManagerInsuranceRowObj>(10);
        for (let i = 0; i < 10; i++) {
          this.ManagerInsuranceRows[i] = new ManagerInsuranceRowObj();
        }
     */
    this.CurrentCapitalAmounts = 0;
    this.MonthlyDepositAmounts = 0;
    this.LumpSums = 0;
    this.CapitalAmountInCaseOfDeaths = 0;
    this.CapitalAmountInCasePensions = 0;
    this.MonthlyAllowances = 0;
    this.ManagerInsuranceMonthlyAllowances = 0;

  }
}

export class ManagerInsuranceRowObj {
  NameOfInsurance: string;
  CurrentCapitalAmount: string;
  MonthlyDepositAmount: string;
  LumpSum: string;
  AllowanceFactor: string;
  CapitalAmountInCaseOfDeath: number;
  CapitalAmountInCasePension: number;
  MonthlyAllowance: number;
  ManagerInsuranceMonthlyAllowance: number;

  constructor() {
    this.NameOfInsurance = "";
    this.CurrentCapitalAmount = "";
    this.MonthlyDepositAmount = "";
    this.LumpSum = "";
    this.AllowanceFactor = "";
    this.CapitalAmountInCaseOfDeath = 0;
    this.CapitalAmountInCasePension = 0;
    this.MonthlyAllowance = 0;
    this.ManagerInsuranceMonthlyAllowance = 0;
  }

  CalcCapitalAmountInCaseOfDeath() {

    let lumpSum = (this.LumpSum.replace(',', '') != "") ? parseFloat(this.LumpSum.replace(',', '')) : 0;
    this.CapitalAmountInCaseOfDeath = ((this.CurrentCapitalAmount.replace(',', '') != "" ? parseFloat(this.CurrentCapitalAmount.replace(',', '')) + lumpSum : 0));

    return this.CapitalAmountInCaseOfDeath.toFixed(0).toString();

  }

  CalcCapitalAmountInCasePension(annualInterestRate: string, RetirementAge: string, age: string) {

    this.CapitalAmountInCasePension = this.CurrentCapitalAmount.replace(',', '') != "" ? this.CalculateFutureValue(parseFloat(annualInterestRate), parseInt(RetirementAge) - parseInt(age)) : 0;

    return this.CapitalAmountInCasePension.toFixed(0).toString();
  }

  CalcMonthlyAllowance() {

    this.MonthlyAllowance = this.CapitalAmountInCasePension / parseInt(this.AllowanceFactor);
    return this.MonthlyAllowance.toFixed(0).toString();
  }


  CalcManagerInsuranceMonthlyAllowance(partnerAge: string) {
    this.ManagerInsuranceMonthlyAllowance = partnerAge != '' ? this.CapitalAmountInCaseOfDeath / (90 - parseInt(partnerAge)) / 12 : 0;
    return this.ManagerInsuranceMonthlyAllowance.toFixed(0).toString();
  }

  CalculateFutureValue(annualInterestRate: number, years: number) {
    // Convert annual interest rate to monthly rate and percentage
    const monthlyInterestRate = (annualInterestRate / 100) / 12;

    // Calculate the number of monthly contributions
    const months = years * 12;

    // Initialize the future value with the initial deposit
    let futureValue = parseInt(this.CurrentCapitalAmount.replace(',', ''));

    // Calculate future value using a loop
    for (let i = 0; i < months; i++) {
      // Add the monthly deposit
      futureValue += (this.MonthlyDepositAmount != "") ? parseInt(this.MonthlyDepositAmount.replace(',', '')) : 0;

      // Add interest for the month
      futureValue *= (1 + monthlyInterestRate);
    }

    return futureValue;
  }
}

export class PensionFundObj {
  PensionFundRows: PensionFundRowObj[];
  CurrentCapitalAmounts: number;
  MonthlyDepositAmounts: number;
  FutureAmounts: number;
  CalculatedMonthlyAllowances: number;
  WidowsAllowances: number;
  OrphanAllowances: number;
  DisabilityFund: number;
  constructor() {
    this.PensionFundRows = [];
    /*     this.PensionFundRows = new Array<PensionFundRowObj>(7);
        for (let i = 0; i < 7; i++) {
          this.PensionFundRows[i] = new PensionFundRowObj();
        }
     */
    this.CurrentCapitalAmounts = 0;
    this.MonthlyDepositAmounts = 0;
    this.FutureAmounts = 0;
    this.CalculatedMonthlyAllowances = 0;
    this.WidowsAllowances = 0;
    this.OrphanAllowances = 0;
    this.DisabilityFund = 0;
  }
}

export class PensionFundRowObj {
  NameOfInsurance: string;
  CurrentCapitalAmount: string;
  MonthlyDepositAmount: string;
  FutureAmount: number;
  CalculatedMonthlyAllowance: number;
  EndDate: string;
  WidowsAllowance: string;
  OrphanAllowance: string;
  DisabilityFund: string;
  constructor() {
    this.NameOfInsurance = "";
    this.CurrentCapitalAmount = "";
    this.MonthlyDepositAmount = "";
    this.FutureAmount = 0;
    this.CalculatedMonthlyAllowance = 0;
    this.EndDate = "";
    this.WidowsAllowance = "";
    this.OrphanAllowance = "";
    this.DisabilityFund = "";
  }

  CalcFutureAmount(annualInterestRate: string, RetirementAge: string, age: string) {

    this.FutureAmount = this.CurrentCapitalAmount.replace(',', '') != "" ? this.CalculateFutureValue(parseFloat(annualInterestRate), parseInt(RetirementAge) - parseInt(age)) : 0;

    return this.FutureAmount.toFixed(0).toString();
  }

  CalcCalculatedMonthlyAllowance() {

    this.CalculatedMonthlyAllowance = this.FutureAmount / 220;
    return this.CalculatedMonthlyAllowance.toFixed(0).toString();

  }

  CalculateFutureValue(annualInterestRate: number, years: number) {
    // Convert annual interest rate to monthly rate and percentage
    const monthlyInterestRate = (annualInterestRate / 100) / 12;

    // Calculate the number of monthly contributions
    const months = years * 12;

    // Initialize the future value with the initial deposit
    let futureValue = parseInt(this.CurrentCapitalAmount.replace(',', ''));

    // Calculate future value using a loop
    for (let i = 0; i < months; i++) {
      // Add the monthly deposit
      futureValue += (this.MonthlyDepositAmount.replace(',', '') != "" ? parseInt(this.MonthlyDepositAmount.replace(',', '')) : 0);

      // Add interest for the month
      futureValue *= (1 + monthlyInterestRate);
    }

    return futureValue;
  }

}

export class GemelObj {
  GemelRows: GemelRowObj[];
  CurrentCapitalAmounts: number;
  MonthlyDepositAmounts: number;
  FutureAmounts: number;
  CalculatedMonthlyAllowances: number;
  constructor() {
    this.GemelRows = [];
    /*     this.PensionFundRows = new Array<PensionFundRowObj>(7);
        for (let i = 0; i < 7; i++) {
          this.PensionFundRows[i] = new PensionFundRowObj();
        }
     */
    this.CurrentCapitalAmounts = 0;
    this.MonthlyDepositAmounts = 0;
    this.FutureAmounts = 0;
    this.CalculatedMonthlyAllowances = 0;
  }
}

export class GemelRowObj {
  NameOfInsurance: string;
  CurrentCapitalAmount: string;
  MonthlyDepositAmount: string;
  FutureAmount: number;
  CalculatedMonthlyAllowance: number;
  EndDate: string;
  constructor() {
    this.NameOfInsurance = "";
    this.CurrentCapitalAmount = "";
    this.MonthlyDepositAmount = "";
    this.FutureAmount = 0;
    this.CalculatedMonthlyAllowance = 0;
    this.EndDate = "";
  }

  CalcFutureAmount(annualInterestRate: string, RetirementAge: string, age: string) {

    this.FutureAmount = this.CurrentCapitalAmount.replace(',', '') != "" ? this.CalculateFutureValue(parseFloat(annualInterestRate), parseInt(RetirementAge) - parseInt(age)) : 0;

    return this.FutureAmount.toFixed(0).toString();
  }

  CalcCalculatedMonthlyAllowance() {

    this.CalculatedMonthlyAllowance = this.FutureAmount / 220;
    return this.CalculatedMonthlyAllowance.toFixed(0).toString();

  }

  CalculateFutureValue(annualInterestRate: number, years: number) {
    // Convert annual interest rate to monthly rate and percentage
    const monthlyInterestRate = (annualInterestRate / 100) / 12;

    // Calculate the number of monthly contributions
    const months = years * 12;

    // Initialize the future value with the initial deposit
    let futureValue = parseInt(this.CurrentCapitalAmount.replace(',', ''));

    // Calculate future value using a loop
    for (let i = 0; i < months; i++) {
      // Add the monthly deposit
      futureValue += (this.MonthlyDepositAmount.replace(',', '') != "" ? parseInt(this.MonthlyDepositAmount.replace(',', '')) : 0);

      // Add interest for the month
      futureValue *= (1 + monthlyInterestRate);
    }

    return futureValue;
  }

}





export class OldPensionFundObj {
  OldPensionFundRows: OldPensionFundRowObj[];
  AllowanceAmounts: number;
  WidowsAllowances: number;
  OrphanAllowances: number;

  constructor() {
    this.OldPensionFundRows = [];
    /*     this.OldPensionFundRows = new Array<OldPensionFundRowObj>(7);
        for (let i = 0; i < 7; i++) {
          this.OldPensionFundRows[i] = new OldPensionFundRowObj();
        }
     */
    this.AllowanceAmounts = 0;
    this.WidowsAllowances = 0;
    this.OrphanAllowances = 0;

  }
}

export class OldPensionFundRowObj {
  NameOfInsurance: string;
  AllowanceAmount: string;
  WidowsAllowance: string;
  OrphanAllowance: string;

  constructor() {
    this.NameOfInsurance = "";
    this.AllowanceAmount = "";
    this.WidowsAllowance = "";
    this.OrphanAllowance = "";
  }

}

export class SocialSecurityBenefitsObj {
  SocialSecurityBenefitsRows: SocialSecurityBenefitsRowObj[];
  Amounts: number;
  constructor() {
    this.SocialSecurityBenefitsRows = new Array<SocialSecurityBenefitsRowObj>(3);
    for (let i = 0; i < 3; i++) {
      this.SocialSecurityBenefitsRows[i] = new SocialSecurityBenefitsRowObj();
    }

    this.SocialSecurityBenefitsRows[0].NameOfInsurance = "קצבת אלמן";
    this.SocialSecurityBenefitsRows[1].NameOfInsurance = "קצבת ילדים";
    this.SocialSecurityBenefitsRows[2].NameOfInsurance = "קצבת זקנה";
    this.Amounts = 0;
  }
}

export class SocialSecurityBenefitsRowObj {
  NameOfInsurance: string;
  Amount: string;

  constructor() {
    this.NameOfInsurance = "";
    this.Amount = "";
  }
}

export class PensionJointObj {
  PensionJointRows: PensionJointRowObj[];
  Amounts: number;
  constructor() {
    this.PensionJointRows = [];
    /*     this.PensionJointRows = new Array<PensionJointRowObj>(5);
        for (let i = 0; i < 5; i++) {
          this.PensionJointRows[i] = new PensionJointRowObj();
        }
     */
    this.Amounts = 0;
  }
}

export class PensionJointRowObj {
  NameOfInsurance: string;
  Amount: string;
  Comment: string;

  constructor() {
    this.NameOfInsurance = "";
    this.Amount = "";
    this.Comment = "";
  }
}

export class EconomicalStabilityViewInfoObj {
  FamilyIncomes: number;
  TheNeed: number;
  CapitalTagged: string;
  HowMuchIsLeft2Saving: number;
  HowManyYears: string;
  MonthlySavings: number;
  constructor() {
    this.FamilyIncomes = 0;
    this.TheNeed = 0;
    this.CapitalTagged = "";
    this.HowMuchIsLeft2Saving = 0;
    this.HowManyYears = "";
    this.MonthlySavings = 0;
  }
}

export class RepetitiveGoalsViewInfoObj {
  RepetitiveGoalsRows: RepetitiveGoalsRowObj[];
  Amounts: number;
  constructor() {
    this.RepetitiveGoalsRows = [];
    /*     this.RepetitiveGoalsRows = new Array<RepetitiveGoalsRowObj>(10);
        for (let i = 0; i < 10; i++) {
          this.RepetitiveGoalsRows[i] = new RepetitiveGoalsRowObj();
        }
     */
    this.Amounts = 0;
  }
}

export class RepetitiveGoalsRowObj {
  NameOfGoal: string;
  EveryFewYears: string;
  Cost: string;
  MonthlySavingsRequired: number;

  constructor() {
    this.NameOfGoal = "";
    this.EveryFewYears = "";
    this.Cost = "";
    this.MonthlySavingsRequired = 0;
  }

  CalcMonthlySavingsRequired() {
    this.MonthlySavingsRequired = (this.EveryFewYears.replace(',', '') != "" && this.Cost.replace(',', '') != "" ? parseInt(this.Cost.replace(',', '')) / (parseInt(this.EveryFewYears.replace(',', '')) * 12) : 0);
    return this.MonthlySavingsRequired.toFixed(0).toString();
  }
}

export class IncomesGoalsViewInfoObj {
  IncomesGoalsRows: IncomesGoalsRowObj[];
  AmountInYear: number[];
  AlreadyInSavings: string;
  ReturnOnSavings: string;
  constructor() {
    this.AmountInYear = [];
    this.IncomesGoalsRows = [];
/*     this.IncomesGoalsRows = new Array<IncomesGoalsRowObj>(13);
    for (let i = 0; i < 13; i++) {
      this.IncomesGoalsRows[i] = new IncomesGoalsRowObj();
    }
 */    this.AlreadyInSavings = "";
    this.ReturnOnSavings = "";
  }
}

export class IncomesGoalsRowObj {
  IncomeSrc: string;
  AmountInYear: string[];
  constructor() {
    this.IncomeSrc = "";
    this.AmountInYear = [];
  }
}

export class IncomesGoalsRowsObj {
  IncomeSrc: string;
  ReturnOnSavings: string;
  AmountInYear: string;
  constructor() {
    this.IncomeSrc = "";
    this.ReturnOnSavings = "";
    this.AmountInYear = "";
  }
}

export class OneOffFamilyGoalsViewInfoObj {
  OneOffFamilyGoalsRows: OneOffFamilyGoalsRowObj[];
  NeedOneOffFamilyGoalsRow: NeedOneOffFamilyGoalsRowObj;
  DepositFromFundsOneOffFamilyGoalsRow: DepositFromFundsOneOffFamilyGoalsRowObj;
  AdditionalDepositOneOffFamilyGoalsRow: AdditionalDepositOneOffFamilyGoalsRowObj;
  TotalMonthlySavingsOneOffFamilyGoalsRow: TotalMonthlySavingsOneOffFamilyGoalsRowObj;
  TotalYearlySavingsOneOffFamilyGoalsRow: TotalYearlySavingsOneOffFamilyGoalsRowObj;
  CumulativeOneOffFamilyGoalsRow: CumulativeOneOffFamilyGoalsRowObj;
  PutAsideOneOffFamilyGoalsRow: PutAsideOneOffFamilyGoalsRowObj;
  SavingsExistForChildrenOneOffFamilyGoalsRow: SavingsExistForChildrenOneOffFamilyGoalsRowObj;
  CumulativeReturnOnInvestmentOneOffFamilyGoalsRow: CumulativeReturnOnInvestmentOneOffFamilyGoalsRowObj;
  TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow: TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRowObj;

  AmountInYear: number[];
  AlreadyInSavings: string;
  ReturnOnSavings: string;
  constructor() {
    this.AmountInYear = [];
    this.NeedOneOffFamilyGoalsRow = new NeedOneOffFamilyGoalsRowObj();
    this.DepositFromFundsOneOffFamilyGoalsRow = new DepositFromFundsOneOffFamilyGoalsRowObj();
    this.AdditionalDepositOneOffFamilyGoalsRow = new AdditionalDepositOneOffFamilyGoalsRowObj();
    this.TotalMonthlySavingsOneOffFamilyGoalsRow = new TotalMonthlySavingsOneOffFamilyGoalsRowObj();
    this.TotalYearlySavingsOneOffFamilyGoalsRow = new TotalYearlySavingsOneOffFamilyGoalsRowObj();
    this.CumulativeOneOffFamilyGoalsRow = new CumulativeOneOffFamilyGoalsRowObj();
    this.CumulativeOneOffFamilyGoalsRow = new CumulativeOneOffFamilyGoalsRowObj();
    this.PutAsideOneOffFamilyGoalsRow = new PutAsideOneOffFamilyGoalsRowObj();
    this.SavingsExistForChildrenOneOffFamilyGoalsRow = new SavingsExistForChildrenOneOffFamilyGoalsRowObj();
    this.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow = new CumulativeReturnOnInvestmentOneOffFamilyGoalsRowObj();
    this.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow = new TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRowObj();

    this.OneOffFamilyGoalsRows = new Array<OneOffFamilyGoalsRowObj>(14);
    for (let i = 0; i < 15; i++) {
      this.OneOffFamilyGoalsRows[i] = new OneOffFamilyGoalsRowObj();
    }
    this.AlreadyInSavings = "";
    this.ReturnOnSavings = "";
  }
}

export class OneOffFamilyGoalsRowObj {
  CommonCostSrc: string;
  Target: string;
  SumOfCategory: number;
  AmountInYear: string[];
  constructor() {
    this.CommonCostSrc = "";
    this.Target = "";
    this.SumOfCategory = 0;
    this.AmountInYear = [];
  }
}

export class OneOffFamilyGoalsRowsObj {
  AmountInYear: string;
  DepositFromFundsOneOffFamilyGoalsRow: string;
  AdditionalDepositOneOffFamilyGoalsRow: string;
  PutAside: string;
  SavingsExistForChildren: string;
  CumulativeReturnOnInvestment: string;
  constructor() {
    this.AmountInYear = "";
    this.DepositFromFundsOneOffFamilyGoalsRow = "";
    this.AdditionalDepositOneOffFamilyGoalsRow = "";
    this.PutAside = "";
    this.SavingsExistForChildren = "";
    this.CumulativeReturnOnInvestment = "";
  }
}


export class NeedOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
  }
}

export class DepositFromFundsOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
  }

  UpdateRow(cnt: number) {
    for (let j = cnt + 1; j < this.AmountInYear.length; j++) {
      this.AmountInYear[j] = this.AmountInYear[cnt];
    }
  }
}

export class AdditionalDepositOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];

  Recomanded: number;
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
    this.Recomanded = 0;
  }

  UpdateRow(cnt: number) {
    for (let j = cnt + 1; j < this.AmountInYear.length; j++) {
      this.AmountInYear[j] = this.AmountInYear[cnt];
    }
  }
}

export class TotalMonthlySavingsOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
  }
}

export class TotalYearlySavingsOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
  }
}

export class CumulativeOneOffFamilyGoalsRowObj {
  Title: string;
  AmountInYear: number[];
  AmountInYearF: number[];
  Exist: number;
  constructor() {
    this.Title = "";
    this.AmountInYear = [];
    this.AmountInYearF = [];
    this.Exist = 0;
  }
}

export class PutAsideOneOffFamilyGoalsRowObj {
  Title: string;
  PutAside: string;
  constructor() {
    this.Title = "";
    this.PutAside = "";
  }
}

export class SavingsExistForChildrenOneOffFamilyGoalsRowObj {
  Title: string;
  SavingsExistForChildren: string;
  constructor() {
    this.Title = "";
    this.SavingsExistForChildren = "";
  }
}

export class CumulativeReturnOnInvestmentOneOffFamilyGoalsRowObj {
  Title: string;
  CumulativeReturnOnInvestment: string;
  constructor() {
    this.Title = "";
    this.CumulativeReturnOnInvestment = "";
  }
}

export class TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRowObj {
  Title: string;
  TotalNominalCapitalNeededForAllGoals: number;
  constructor() {
    this.Title = "";
    this.TotalNominalCapitalNeededForAllGoals = 0;
  }
}

export class CalculateDataObj {
  /*   Name1: string;
    Age1: string;
    NumberOfChildren1: string;
    Child: ChildObj[];
    Name2: string;
    Age2: string;
    SelectedStatus1: string;
    SelectedSex1: string;
    SelectedSex2: string;
   */
  SumIncomes: string;
  PensionProvisions: string;
  ProvisionsForFunds: string;
  SumNetIncomes: string;
  IncomesEx: string;
  SumExpenses: string;
  SumVariableExpenses: string;

  //Saving:string;
  ManagerInsurance: string;
  LossOfWorkingCapacity: string;
  Pensia: string;
  Gemel: string;
  Old: string;
  SocialSecurityBenefits: string;
  CommitmentAmounts: string;
  SumMortgages: string;
  RentCost: string;
  Baltam: string;
  SecurityFund: string;
  FutureExpenses: string;
  General: string;
  NetWorths: string;
  VehiclesNetWorths: string;
  FinanceLiquidityAssets: string;
  FinanceUnliquidityAssets: string;
  SumCryptoSaving: string;
  SumForexSaving: string;
  LifeInsurances1: string;
  LifeInsurances2: string;
  LongTermCareCompany1: string;
  LongTermCareCompany2: string;


  PaymentOfAlimony: string;
  constructor() {
    /*     this.Child = [];
        this.Name1 = "";
        this.Age1 = "";
        this.NumberOfChildren1 = "0";
        this.SelectedStatus1 = "בחר ...";
        this.SelectedSex1 = "בחר ...";
        this.Name2 = "";
        this.Age2 = "";
        this.SelectedSex2 = "בחר ...";
     */
    this.SumIncomes = "";
    this.PensionProvisions = "";
    this.ProvisionsForFunds = "";
    this.SumNetIncomes = "";
    this.IncomesEx = "";
    this.SumExpenses = "";
    this.SumVariableExpenses = "";
    //this.Saving = "";
    this.ManagerInsurance = "";
    this.LossOfWorkingCapacity = "";
    this.Pensia = "";
    this.Gemel = "";
    this.Old = "";
    this.SocialSecurityBenefits = "";
    this.CommitmentAmounts = "";
    this.SumMortgages = "";
    this.RentCost = "";
    this.Baltam = "";
    this.SecurityFund = "";
    this.FutureExpenses = "";
    this.General = "";
    this.NetWorths = "";
    this.VehiclesNetWorths = "";
    this.FinanceLiquidityAssets = "";
    this.SumCryptoSaving = "";
    this.SumForexSaving = "";
    this.FinanceUnliquidityAssets = "";
    this.LifeInsurances1 = "";
    this.LifeInsurances2 = "";
    this.LongTermCareCompany1 = "";
    this.LongTermCareCompany2 = "";
    this.PaymentOfAlimony = "";
  }
}

/* CalcSumNetIncomes() {

  /* return ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0)).toFixed(0).toString(); 

  return ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0)).toFixed(0).toString();

}


CalcIncomesEx() {
  let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

  let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));


  return (netIncomes - incomes).toFixed(0).toString();
}

CalcSumExpenses() {
  return (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
}

CalcSumVariableExpenses() {
  return (this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
}

CalcSumSaving() {

  return (this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts != 0 ? this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts : 0).toFixed(0).toString();
}

CalcNetWorths() {

  this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths = (this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '')) : 0);
  /* 
      for (let i = 0; i < 10; i++) {
        netWorths += (this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '')) : 0);
      }
   
  //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();

  return this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths.toFixed(0).toString();
}

GetRentCost() {
  let sumRentCost = 0;
  this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach(element => {
    if (element.Type == "שכר דירה") {
      sumRentCost += parseInt(element.FixedMonthly.replace(',', ''));
    }
  });

  return sumRentCost;
}

cSocialSecurityBenefitsAmounts(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts = 0;

  for (let i = 0; i < 3; i++) {
    this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts += (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[i].Amount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[i].Amount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts.toFixed(0).toString() : "";
}

CalcSumMonthlyPensia(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] = 0;
  this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] =
    (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances +
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances +
      (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '')) : 0));


  return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num];
}

CalcManagerInsurance() {

  let sumManagerInsurance = 0;
  sumManagerInsurance += this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances : 0;
  sumManagerInsurance += this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances : 0;

  return sumManagerInsurance;
}

CalcPensia() {
  let sumPensia = 0;
  sumPensia += this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances : 0;
  sumPensia += this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances : 0;

  return sumPensia;
}

CalcOld() {
  let sumOld = 0;
  sumOld += this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts : 0;
  sumOld += this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts : 0;

  return sumOld;
}

CalcSocialSecurityBenefits() {
  let sumSocialSecurityBenefits = 0;
  sumSocialSecurityBenefits += this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts : 0;
  sumSocialSecurityBenefits += this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts : 0;

  return sumSocialSecurityBenefits;
}


CalcPensionProvisions() {
  return parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', ''));
}

CalcProvisionsForFunds() {
  return parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', ''));
}

CalcBaltam() {
  for (let element of this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
    if (element.Comment == "בלתי מתוכנן") {
      return parseInt(element.CurrentAmount.replace(',', ''));
    }
  }
  return 0; // Return a default value if the condition is not met
}

CalcSecurityFund() {
  let sum = 0;
  for (let element of this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
    if (element.Comment == "קרן ביטחון") {
      sum += parseInt(element.CurrentAmount.replace(',', ''));
    }
  }
  return sum; // Return a default value if the condition is not met
}


CalcFutureExpenses() {
  for (let element of this.generalInfoService.AllInfo.SavingViewInfo.SavingRows) {
    if (element.Type  == "הוצאות עתידיות") {
      return parseInt(element.CurrentAmount.replace(',', ''));
    }
  }
  return 0; // Return a default value if the condition is not met
}

CalcGeneral() {
  for (let element of this.generalInfoService.AllInfo.SavingViewInfo.SavingRows) {
    if (element.Type  == "חסכון כללי") {
      return parseInt(element.CurrentAmount.replace(',', ''));
    }
  }
  return 0; // Return a default value if the condition is not met
}

CalcLifeInsurances1()
{
  return parseInt(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0].toFixed(0));
}

CalcLifeInsurances2()
{
  return parseInt(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1].toFixed(0));
}

AddRowOld() {
  this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.push(new OldPensionFundRowObj());
}

AddRowManagerInsurance() {
  this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.push(new ManagerInsuranceRowObj());
}

AddRowPensia() {
  this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.push(new PensionFundRowObj());
}


CalcVehiclesNetWorths() {

  this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows.length; i++) {
    this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths += (this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString();
}

CalcFinanceLiquidityAssets() {

  this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length; i++) {
    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString();
}

CalcFinanceUnliquidityAssets() {

  this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.length; i++) {
    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString();
}

CalcAmounts() {
  this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
    this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount += (this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString();

}

CalcSumMortgages() {
  return (this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
}

 */













