export class FinancialReportGenerator {

  // פונקציית עזר לעיצוב מספרים עם פרדת אלפים
  private formatNumber(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '')) : value;
    return num.toLocaleString('he-IL', { minimumFractionDigits: 0 });
  }

  // פונקציית עזר לעיצוב מטבע
  private formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '')) : value;
    return num.toLocaleString('he-IL', { 
      style: 'currency', 
      currency: 'ILS', 
      minimumFractionDigits: 0 
    });
  }

  // פונקציית עזר ליצירת קו מפריד מעוצב
  private createSeparator(title: string, icon: string = '◆'): string {
    const line = '─'.repeat(Math.max(0, 60 - title.length));
    return `\n${icon} ${title} ${line}\n`;
  }

  // פונקציית עזר ליצירת כותרת ראשית
  private createMainHeader(title: string): string {
    const stars = '★'.repeat(5);
    const line = '═'.repeat(50);
    return `\n${stars} ${title} ${stars}\n${line}\n`;
  }

  // פונקציית עזר ליצירת תיבת הדגשה
  private createHighlightBox(content: string): string {
    const border = '▓'.repeat(60);
    return `\n${border}\n${content}\n${border}\n`;
  }

  // פונקציה מקבילה ל-DoReportEnglish המקורית
  generateAdvancedFinancialReport(AllInfo: any): string {
    
    // חישובי נתונים בסיסיים
    const incomes = this.calculateIncomes(AllInfo);
    const netIncomes = this.calculateNetIncomes(AllInfo);
    const allIncomes = this.calculateAllIncomes(AllInfo);
    
    // עדכון נתוני החישוב
    this.updateCalculatedData(AllInfo, incomes, netIncomes, allIncomes);

    let report = '';

    // כותרת ראשית מעוצבת
    report += this.createMainHeader('📊 דוח ניתוח פיננסי מתקדם 📊');
    
    // מידע אישי מעוצב
    report += this.generatePersonalInfo(AllInfo);
    
    // סיכום מנהלים - תיבת הדגשה
    report += this.generateExecutiveSummary(AllInfo);
    
    // פירוט הכנסות
    report += this.generateIncomeSection(AllInfo);
    
    // פירוט הוצאות
    report += this.generateExpensesSection(AllInfo);
    
    // נכסים וחיסכונות
    report += this.generateAssetsSection(AllInfo);
    
    // ביטוחים ופנסיה
    report += this.generateInsuranceSection(AllInfo);
    
    // חובות ומשכנתאות
    report += this.generateDebtsSection(AllInfo);
    
    // ניתוח פיננסי מתקדם
    report += this.generateAdvancedAnalysis(AllInfo);
    
    // המלצות והמשך טיפול
    report += this.generateRecommendations(AllInfo);
    
    // חתימה מקצועית
    report += this.generateReportFooter();

    return report;
  }

  private calculateIncomes(AllInfo: any): number {
    const income1 = AllInfo.IncomesViewInfo.Income[0].replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0;
    const income2 = AllInfo.IncomesViewInfo.Income[1].replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0;
    return income1 + income2;
  }

  private calculateNetIncomes(AllInfo: any): number {
    const basicIncome = this.calculateIncomes(AllInfo);
    const additionalIncome = AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0;
    const pension = AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0;
    const fund = AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0;
    
    return basicIncome + additionalIncome - pension - fund;
  }

  private calculateAllIncomes(AllInfo: any): number {
    const basicIncome = this.calculateIncomes(AllInfo);
    const additionalIncome = AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') !== "" ? 
      parseFloat(AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0;
    return basicIncome + additionalIncome;
  }

  private updateCalculatedData(AllInfo: any, incomes: number, netIncomes: number, allIncomes: number): void {
    AllInfo.CalculateData.SumIncomes = (allIncomes - (netIncomes - incomes)).toFixed(0).toString();
    AllInfo.CalculateData.SumNetIncomes = incomes.toFixed(0).toString();
    AllInfo.CalculateData.IncomesEx = (netIncomes - incomes).toFixed(0).toString();
    AllInfo.CalculateData.SumExpenses = AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') !== "" ? 
      parseFloat(AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')).toFixed(0).toString() : "0";
    AllInfo.CalculateData.SumVariableExpenses = 
      AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString();
    
    // חישובים נוספים...
    this.calculateAdditionalData(AllInfo);
  }

  private calculateAdditionalData(AllInfo: any): void {
    // חישוב נכסים נזילים
    AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets = 0;
    for (let i = 0; i < AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length; i++) {
      AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets += 
        AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '') !== "" ? 
          parseFloat(AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0;
    }
    AllInfo.CalculateData.FinanceLiquidityAssets = 
      AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString();

    // חישובי ביטוחים ופנסיה
    this.calculateInsuranceData(AllInfo);
    this.calculatePensionData(AllInfo);
  }

  private calculateInsuranceData(AllInfo: any): void {
    AllInfo.CalculateData.LifeInsurances1 = AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0].toFixed(0);
    if (AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0] !== undefined) {
      AllInfo.CalculateData.LongTermCareCompany1 = 
        AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0].toFixed(0);
    }
  }

  private calculatePensionData(AllInfo: any): void {
    let sumPensia = 0;
    sumPensia += AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances !== 0 ? 
      AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances : 0;
    sumPensia += AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances !== 0 ? 
      AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances : 0;
    AllInfo.CalculateData.Pensia = sumPensia.toFixed(0).toString();

    let sumGemel = 0;
    sumGemel += AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances !== 0 ? 
      AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances : 0;
    sumGemel += AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances !== 0 ? 
      AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances : 0;
    AllInfo.CalculateData.Gemel = sumGemel.toFixed(0).toString();
  }

  private generatePersonalInfo(AllInfo: any): string {
    let section = this.createSeparator('👨‍👩‍👧‍👦 פרטים אישיים', '🔹');
    
    // מידע בסיסי על המשפחה
    if (AllInfo.PersonalDataViewInfo.SelectedStatus1 === "נשוי") {
      section += `👫 זוג בגילאי ${AllInfo.PersonalDataViewInfo.Age1} ו-${AllInfo.PersonalDataViewInfo.Age2}\n`;
    } else {
      const status = this.getMaritalStatus(AllInfo);
      section += `👤 ${status}, בן/בת ${AllInfo.PersonalDataViewInfo.Age1}\n`;
    }

    // מידע על ילדים
    if (parseInt(AllInfo.PersonalDataViewInfo.NumberOfChildren1) > 0) {
      section += `👶 מספר ילדים: ${AllInfo.PersonalDataViewInfo.NumberOfChildren1}\n`;
      section += `🎂 גילאי הילדים: `;
      for (let child of AllInfo.PersonalDataViewInfo.Child) {
        section += `${child.Age}, `;
      }
      section = section.slice(0, -2) + '\n';
    }

    // דירוג אשראי
    if (AllInfo.PersonalDataViewInfo.CreditRating !== "") {
      section += `💳 דירוג אשראי BDI: ${AllInfo.PersonalDataViewInfo.CreditRating}\n`;
    }

    return section + '\n';
  }

  private getMaritalStatus(AllInfo: any): string {
    const status = AllInfo.PersonalDataViewInfo.SelectedStatus1;
    const gender = AllInfo.PersonalDataViewInfo.SelectedSex1;
    
    if (gender === "זכר") {
      return status === "רווק" ? "רווק" : status === "גרוש" ? "גרוש" : "אלמן";
    } else {
      return status === "רווק" ? "רווקה" : status === "גרוש" ? "גרושה" : "אלמנה";
    }
  }

  private generateExecutiveSummary(AllInfo: any): string {
    const totalIncome = parseInt(AllInfo.CalculateData.SumNetIncomes) + 
                       (AllInfo.CalculateData.IncomesEx !== "0" ? parseInt(AllInfo.CalculateData.IncomesEx) : 0);
    const totalExpenses = parseInt(AllInfo.CalculateData.SumExpenses) + 
                         parseInt(AllInfo.CalculateData.SumVariableExpenses);
    const monthlyBalance = totalIncome - totalExpenses;
    const totalAssets = this.calculateTotalAssets(AllInfo);

    let summary = this.createSeparator('🎯 תמצית מנהלים', '📈');
    
    summary += this.createHighlightBox(
      `💰 סה"כ הכנסות חודשיות: ${this.formatCurrency(totalIncome)}\n` +
      `💸 סה"כ הוצאות חודשיות: ${this.formatCurrency(totalExpenses)}\n` +
      `${monthlyBalance >= 0 ? '✅' : '⚠️'} מאזן חודשי: ${this.formatCurrency(monthlyBalance)}\n` +
      `🏦 סה"כ נכסים: ${this.formatCurrency(totalAssets)}\n` +
      `📊 יחס חיסכון: ${((monthlyBalance / totalIncome) * 100).toFixed(1)}%`
    );

    return summary;
  }

  private calculateTotalAssets(AllInfo: any): number {
    let total = 0;
    
    // נכסים נזילים
    if (AllInfo.CalculateData.FinanceLiquidityAssets !== "") {
      total += parseInt(AllInfo.CalculateData.FinanceLiquidityAssets);
    }
    
    // נכסים לא נזילים
    if (AllInfo.CalculateData.FinanceUnliquidityAssets !== "") {
      total += parseInt(AllInfo.CalculateData.FinanceUnliquidityAssets);
    }
    
    // נדל"ן
    if (AllInfo.CalculateData.NetWorths !== "0") {
      total += parseInt(AllInfo.CalculateData.NetWorths);
    }
    
    // רכבים
    if (AllInfo.CalculateData.VehiclesNetWorths !== "") {
      total += parseInt(AllInfo.CalculateData.VehiclesNetWorths);
    }
    
    return total;
  }

  private generateIncomeSection(AllInfo: any): string {
    let section = this.createSeparator('💰 מבנה ההכנסות', '💵');
    
    section += `📊 פירוט ההכנסות:\n`;
    section += `─────────────────────────────────────\n`;
    
    if (AllInfo.CalculateData.SumNetIncomes !== "0") {
      section += `💼 הכנסה נטו: ${this.formatCurrency(AllInfo.CalculateData.SumNetIncomes)}\n`;
    }
    
    if (AllInfo.CalculateData.IncomesEx !== "0") {
      section += `➕ הכנסה נוספת: ${this.formatCurrency(AllInfo.CalculateData.IncomesEx)}\n`;
    }
    
    // הפקדות למעבד
    if (AllInfo.CalculateData.PensionProvisions !== "" || AllInfo.CalculateData.ProvisionsForFunds !== "") {
      section += `\n🏦 הפקדות למעבד (נוסף להכנסה הנטו):\n`;
      section += `─────────────────────────────────────\n`;
      
      if (AllInfo.CalculateData.PensionProvisions !== "") {
        section += `🏛️ הפקדות פנסיה: ${this.formatCurrency(AllInfo.CalculateData.PensionProvisions)}\n`;
      }
      
      if (AllInfo.CalculateData.ProvisionsForFunds !== "") {
        section += `📚 קרן השתלמות: ${this.formatCurrency(AllInfo.CalculateData.ProvisionsForFunds)}\n`;
      }
    }

    return section + '\n';
  }

  private generateExpensesSection(AllInfo: any): string {
    let section = this.createSeparator('💸 מבנה ההוצאות', '🧾');
    
    // הוצאות קבועות
    if (AllInfo.CalculateData.SumExpenses !== "0") {
      section += `🔒 הוצאות קבועות:\n`;
      section += `─────────────────────────────────────\n`;
      
      const totalFixed = parseInt(AllInfo.CalculateData.SumExpenses);
      section += `💼 סה"כ הוצאות קבועות: ${this.formatCurrency(totalFixed)}\n`;
      
      // פירוט הוצאות קבועות
      section += this.generateFixedExpensesDetail(AllInfo);
      
      // הדגשת מזונות ושכר דירה
      const alimony = this.calculateAlimony(AllInfo);
      if (alimony > 0) {
        section += `👨‍👩‍👧‍👦 תשלום מזונות: ${this.formatCurrency(alimony)}\n`;
      }
      
      if (AllInfo.CalculateData.RentCost !== "0") {
        section += `🏠 שכר דירה: ${this.formatCurrency(AllInfo.CalculateData.RentCost)}\n`;
      }
    }
    
    // הוצאות משתנות
    if (AllInfo.CalculateData.SumVariableExpenses !== "0") {
      section += `\n🔄 הוצאות משתנות:\n`;
      section += `─────────────────────────────────────\n`;
      section += `💳 סה"כ הוצאות משתנות: ${this.formatCurrency(AllInfo.CalculateData.SumVariableExpenses)}\n`;
      
      // פירוט הוצאות משתנות
      section += this.generateVariableExpensesDetail(AllInfo);
    }

    return section + '\n';
  }

  private generateFixedExpensesDetail(AllInfo: any): string {
    let detail = `\n📋 פירוט הוצאות קבועות:\n`;
    
    AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach((element: any) => {
      if (element.FixedMonthly !== "" || element.MonthlyAverage !== "") {
        const amount = element.FixedMonthly !== "" ? element.FixedMonthly : element.MonthlyAverage;
        detail += `   • ${element.Type}: ${this.formatCurrency(amount)}\n`;
      }
    });
    
    return detail;
  }

  private generateVariableExpensesDetail(AllInfo: any): string {
    let detail = `\n📋 פירוט הוצאות משתנות:\n`;
    
    AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach((element: any) => {
      if (parseInt(element.CalcSum().replace(',', '')) !== 0) {
        detail += `   • ${element.CategoryName}: ${this.formatCurrency(element.CalcSum())}\n`;
      }
    });
    
    return detail;
  }

  private calculateAlimony(AllInfo: any): number {
    let alimony = 0;
    AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach((element: any) => {
      if (element.Type === "מזונות" && element.FixedMonthly !== "") {
        alimony += parseInt(element.FixedMonthly.replace(',', ''));
      }
    });
    return alimony;
  }

  private generateAssetsSection(AllInfo: any): string {
    let section = this.createSeparator('🏦 נכסים וחיסכונות', '💎');
    
    // נכסים נזילים
    if (AllInfo.CalculateData.FinanceLiquidityAssets !== "") {
      section += `💧 נכסים נזילים:\n`;
      section += `─────────────────────────────────────\n`;
      section += `🏦 סה"כ נכסים נזילים: ${this.formatCurrency(AllInfo.CalculateData.FinanceLiquidityAssets)}\n`;
      
      // פירוט השקעות ספציפיות
      if (AllInfo.CalculateData.SumCryptoSaving !== "") {
        section += `   • 🪙 קריפטו: ${this.formatCurrency(AllInfo.CalculateData.SumCryptoSaving)}\n`;
      }
      
      if (AllInfo.CalculateData.SumForexSaving !== "") {
        section += `   • 💱 FOREX: ${this.formatCurrency(AllInfo.CalculateData.SumForexSaving)}\n`;
      }
    }
    
    // נכסים לא נזילים
    if (AllInfo.CalculateData.FinanceUnliquidityAssets !== "") {
      section += `\n🔒 נכסים לא נזילים:\n`;
      section += `─────────────────────────────────────\n`;
      section += `🏛️ סה"כ נכסים לא נזילים: ${this.formatCurrency(AllInfo.CalculateData.FinanceUnliquidityAssets)}\n`;
    }
    
    // חיסכונות מטרתיים
    section += this.generateTargetSavings(AllInfo);
    
    // נדל"ן ורכבים
    section += this.generatePhysicalAssets(AllInfo);

    return section + '\n';
  }

  private generateTargetSavings(AllInfo: any): string {
    let savings = `\n🎯 חיסכונות מטרתיים:\n`;
    savings += `─────────────────────────────────────\n`;
    
    if (AllInfo.CalculateData.SecurityFund !== "0") {
      savings += `🛡️ קרן ביטחון: ${this.formatCurrency(AllInfo.CalculateData.SecurityFund)}\n`;
    }
    
    if (AllInfo.CalculateData.FutureExpenses !== "") {
      savings += `🔮 הוצאות עתידיות: ${this.formatCurrency(AllInfo.CalculateData.FutureExpenses)}\n`;
    }
    
    if (AllInfo.CalculateData.General !== "") {
      savings += `💼 חיסכון כללי: ${this.formatCurrency(AllInfo.CalculateData.General)}\n`;
    }
    
    if (AllInfo.CalculateData.Baltam !== "") {
      savings += `⚡ בלתי מתוכנן: ${this.formatCurrency(AllInfo.CalculateData.Baltam)}\n`;
    }
    
    return savings;
  }

  private generatePhysicalAssets(AllInfo: any): string {
    let assets = ``;
    
    if (AllInfo.CalculateData.NetWorths !== "0") {
      assets += `\n🏘️ נדל"ן:\n`;
      assets += `─────────────────────────────────────\n`;
      assets += `🏠 שווי נכסי נדל"ן: ${this.formatCurrency(AllInfo.CalculateData.NetWorths)}\n`;
    }
    
    if (AllInfo.CalculateData.VehiclesNetWorths !== "") {
      assets += `\n🚗 רכבים:\n`;
      assets += `─────────────────────────────────────\n`;
      assets += `🚙 שווי רכבים: ${this.formatCurrency(AllInfo.CalculateData.VehiclesNetWorths)}\n`;
    }
    
    return assets;
  }

  private generateInsuranceSection(AllInfo: any): string {
    let section = this.createSeparator('🛡️ ביטוחים ופנסיה', '🔐');
    
    // ביטוחי חיים וסיעוד
    section += `🔒 כיסוי ביטוחי:\n`;
    section += `─────────────────────────────────────\n`;
    
    if (AllInfo.CalculateData.LifeInsurances1 !== "0") {
      section += `❤️ ביטוח חיים: ${this.formatCurrency(AllInfo.CalculateData.LifeInsurances1)}\n`;
    }
    
    if (AllInfo.CalculateData.LongTermCareCompany1 !== "0") {
      section += `🏥 ביטוח סיעודי: ${this.formatCurrency(AllInfo.CalculateData.LongTermCareCompany1)}\n`;
    }
    
    if (AllInfo.CalculateData.LossOfWorkingCapacity !== "0") {
      section += `⚕️ אובדן כושר עבודה: ${this.formatCurrency(AllInfo.CalculateData.LossOfWorkingCapacity)}\n`;
    }
    
    // קצבאות פרישה צפויות
    section += `\n💰 קצבאות פרישה צפויות (חודשי):\n`;
    section += `─────────────────────────────────────\n`;
    
    if (AllInfo.CalculateData.Pensia !== "0") {
      section += `🏛️ קרן פנסיה: ${this.formatCurrency(AllInfo.CalculateData.Pensia)}\n`;
    }
    
    if (AllInfo.CalculateData.Gemel !== "0") {
      section += `💼 קופת גמל: ${this.formatCurrency(AllInfo.CalculateData.Gemel)}\n`;
    }
    
    if (AllInfo.CalculateData.ManagerInsurance !== "0") {
      section += `👔 ביטוח מנהלים: ${this.formatCurrency(AllInfo.CalculateData.ManagerInsurance)}\n`;
    }
    
    if (AllInfo.CalculateData.SocialSecurityBenefits !== "0") {
      section += `🏛️ ביטוח לאומי: ${this.formatCurrency(AllInfo.CalculateData.SocialSecurityBenefits)}\n`;
    }
    
    // סיכום קצבאות
    const totalPension = parseInt(AllInfo.CalculateData.Pensia || "0") + 
                        parseInt(AllInfo.CalculateData.Gemel || "0") + 
                        parseInt(AllInfo.CalculateData.ManagerInsurance || "0") + 
                        parseInt(AllInfo.CalculateData.SocialSecurityBenefits || "0");
    
    if (totalPension > 0) {
      section += `\n✨ סה"כ קצבה חודשית צפויה: ${this.formatCurrency(totalPension)}\n`;
    }

    return section + '\n';
  }

  private generateDebtsSection(AllInfo: any): string {
    let section = this.createSeparator('💳 חובות והתחייבויות', '⚠️');
    
    // חובות כלליים
    if (AllInfo.CalculateData.CommitmentAmounts !== "0") {
      section += `💸 חובות כלליים: ${this.formatCurrency(AllInfo.CalculateData.CommitmentAmounts)}\n`;
    } else {
      section += `✅ אין חובות כלליים\n`;
    }
    
    // משכנתאות
    if (AllInfo.CalculateData.SumMortgages !== "0") {
      section += `🏠 יתרת משכנתאות: ${this.formatCurrency(AllInfo.CalculateData.SumMortgages)}\n`;
      section += this.generateMortgageDetails(AllInfo);
    } else {
      section += `✅ אין משכנתאות\n`;
    }

    return section + '\n';
  }

  private generateMortgageDetails(AllInfo: any): string {
    let details = `\n📋 פירוט מסלולי משכנתה:\n`;
    details += `─────────────────────────────────────\n`;
    
    AllInfo.MortgagesViewInfo.MortgagesRows.forEach((element: any) => {
      if (element.YearToEnd !== "") {
        details += `   • מסלול: ${element.Route}\n`;
        details += `     יתרת קרן: ${this.formatCurrency(element.CurrAmount)}\n`;
        details += `     ריבית: ${element.Interest}%\n`;
        details += `     חודשים לסיום: ${element.YearToEnd}\n\n`;
      }
    });
    
    return details;
  }

  private generateAdvancedAnalysis(AllInfo: any): string {
    let section = this.createSeparator('📈 ניתוח פיננסי מתקדם', '🔬');
    
    const totalIncome = parseInt(AllInfo.CalculateData.SumNetIncomes) + 
                       (AllInfo.CalculateData.IncomesEx !== "0" ? parseInt(AllInfo.CalculateData.IncomesEx) : 0);
    const totalExpenses = parseInt(AllInfo.CalculateData.SumExpenses) + 
                         parseInt(AllInfo.CalculateData.SumVariableExpenses);
    const monthlyBalance = totalIncome - totalExpenses;
    const totalAssets = this.calculateTotalAssets(AllInfo);
    const totalDebts = parseInt(AllInfo.CalculateData.CommitmentAmounts || "0") + 
                      parseInt(AllInfo.CalculateData.SumMortgages || "0");
    const netWorth = totalAssets - totalDebts;
    
    // יחסים פיננסיים מרכזיים
    section += `🔍 מדדים פיננסיים מרכזיים:\n`;
    section += `─────────────────────────────────────\n`;
    
    // יחס חיסכון
    const savingsRate = totalIncome > 0 ? ((monthlyBalance / totalIncome) * 100).toFixed(1) : "0";
    section += `💹 שיעור חיסכון חודשי: ${savingsRate}%\n`;
    
    // יחס הוצאות קבועות להכנסה
    const fixedExpenseRatio = totalIncome > 0 ? 
      ((parseInt(AllInfo.CalculateData.SumExpenses) / totalIncome) * 100).toFixed(1) : "0";
    section += `🔒 יחס הוצאות קבועות: ${fixedExpenseRatio}% מההכנסה\n`;
    
    // יחס הוצאות משתנות להכנסה
    const variableExpenseRatio = totalIncome > 0 ? 
      ((parseInt(AllInfo.CalculateData.SumVariableExpenses) / totalIncome) * 100).toFixed(1) : "0";
    section += `🔄 יחס הוצאות משתנות: ${variableExpenseRatio}% מההכנסה\n`;
    
    // שווי נטו
    section += `💎 שווי נטו (נכסים פחות חובות): ${this.formatCurrency(netWorth)}\n`;
    
    // יחס חוב לנכסים
    const debtToAssetsRatio = totalAssets > 0 ? ((totalDebts / totalAssets) * 100).toFixed(1) : "0";
    section += `⚖️ יחס חוב לנכסים: ${debtToAssetsRatio}%\n`;
    
    // ניתוח מעמיק
    section += `\n🎯 ניתוח מצב:\n`;
    section += `─────────────────────────────────────\n`;
    
    // הערכת יכולת החיסכון
    if (monthlyBalance > 0) {
      section += `✅ מצב חיובי: עודף חודשי של ${this.formatCurrency(monthlyBalance)}\n`;
      const annualSavings = monthlyBalance * 12;
      section += `📅 פוטנציאל חיסכון שנתי: ${this.formatCurrency(annualSavings)}\n`;
    } else {
      section += `⚠️ גירעון חודשי: ${this.formatCurrency(Math.abs(monthlyBalance))}\n`;
      section += `🔄 נדרשת התאמת הוצאות או הגדלת הכנסות\n`;
    }
    
    // הערכת קרן חירום
    const emergencyFund = parseInt(AllInfo.CalculateData.SecurityFund || "0");
    const monthsOfExpenses = totalExpenses > 0 ? (emergencyFund / totalExpenses).toFixed(1) : "0";
    section += `🛡️ כיסוי קרן חירום: ${monthsOfExpenses} חודשי הוצאות\n`;
    
    if (parseFloat(monthsOfExpenses) < 3) {
      section += `⚠️ מומלץ להגדיל קרן חירום ל-6 חודשי הוצאות\n`;
    } else if (parseFloat(monthsOfExpenses) >= 6) {
      section += `✅ קרן חירום בגודל מומלץ\n`;
    }
    
    // הכנה לפרישה
    const totalPensionExpected = parseInt(AllInfo.CalculateData.Pensia || "0") + 
                                parseInt(AllInfo.CalculateData.Gemel || "0") + 
                                parseInt(AllInfo.CalculateData.ManagerInsurance || "0") + 
                                parseInt(AllInfo.CalculateData.SocialSecurityBenefits || "0");
    
    if (totalPensionExpected > 0) {
      const replacementRatio = totalIncome > 0 ? ((totalPensionExpected / totalIncome) * 100).toFixed(1) : "0";
      section += `🏖️ שיעור החלפת הכנסה בפרישה: ${replacementRatio}%\n`;
      
      if (parseFloat(replacementRatio) >= 70) {
        section += `✅ הכנה טובה לפרישה\n`;
      } else if (parseFloat(replacementRatio) >= 50) {
        section += `⚠️ הכנה מספקת לפרישה, אך ניתן לשפר\n`;
      } else {
        section += `🔴 נדרש חיסכון נוסף לפרישה\n`;
      }
    }

    return section + '\n';
  }

  private generateRecommendations(AllInfo: any): string {
    let section = this.createSeparator('💡 המלצות לאופטימיזציה', '🚀');
    
    const totalIncome = parseInt(AllInfo.CalculateData.SumNetIncomes) + 
                       (AllInfo.CalculateData.IncomesEx !== "0" ? parseInt(AllInfo.CalculateData.IncomesEx) : 0);
    const totalExpenses = parseInt(AllInfo.CalculateData.SumExpenses) + 
                         parseInt(AllInfo.CalculateData.SumVariableExpenses);
    const monthlyBalance = totalIncome - totalExpenses;
    
    section += `🎯 המלצות מותאמות אישית:\n`;
    section += `─────────────────────────────────────\n`;
    
    // המלצות לפי מצב הנזילות
    if (monthlyBalance > totalIncome * 0.2) {
      section += `✨ מצב מצוין! עודף גבוה מ-20% מההכנסה\n`;
      section += `🔹 שקלו הגדלת השקעות לטווח ארוך\n`;
      section += `🔹 בחנו אפשרויות השקעה במגזר הנדל"ן\n`;
      section += `🔹 הגדילו הפקדות פנסיוניות לחיסכון במס\n`;
    } else if (monthlyBalance > 0) {
      section += `👍 מצב יציב עם אפשרות לשיפור\n`;
      section += `🔹 בחנו אופטימיזציה של הוצאות משתנות\n`;
      section += `🔹 הגדילו חיסכון חודשי בצורה הדרגתית\n`;
    } else {
      section += `⚠️ נדרשת התייעלות דחופה\n`;
      section += `🔹 נתחו והפחיתו הוצאות לא הכרחיות\n`;
      section += `🔹 בחנו מקורות הכנסה נוספים\n`;
    }
    
    // המלצות לגבי הוצאות קבועות
    const fixedExpenseRatio = totalIncome > 0 ? 
      (parseInt(AllInfo.CalculateData.SumExpenses) / totalIncome) * 100 : 0;
    
    if (fixedExpenseRatio > 60) {
      section += `\n💸 הוצאות קבועות גבוהות (${fixedExpenseRatio.toFixed(1)}%):\n`;
      section += `🔹 בחנו הקטנת דירה/מעבר לאזור זול יותר\n`;
      section += `🔹 נגשו מחדש לספקי שירותים (ביטוחים, תקשורת)\n`;
      section += `🔹 שקלו איחוד הלוואות לריבית נמוכה יותר\n`;
    }
    
    // המלצות השקעות
    const liquidAssets = parseInt(AllInfo.CalculateData.FinanceLiquidityAssets || "0");
    const monthsOfLiquidAssets = totalExpenses > 0 ? liquidAssets / totalExpenses : 0;
    
    if (monthsOfLiquidAssets > 12) {
      section += `\n💰 נזילות גבוהה - הזדמנויות השקעה:\n`;
      section += `🔹 השקיעו עודפי נזילות בתיק מגוון\n`;
      section += `🔹 שקלו השקעות אלטרנטיביות (נדל"ן, סחורות)\n`;
      section += `🔹 בחנו קרנות מדד בעלות נמוכה\n`;
    }
    
    // המלצות פנסיוניות
    const currentAge = parseInt(AllInfo.PersonalDataViewInfo.Age1);
    if (currentAge < 50) {
      section += `\n🏖️ תכנון פרישה (גיל ${currentAge}):\n`;
      section += `🔹 הגדילו הפקדות פנסיוניות לניצול מלא ההטבות\n`;
      section += `🔹 שקלו השקעות ארוכות טווח בעלות סיכון מבוקר\n`;
      section += `🔹 עדכנו תכנית פנסיונית כל 3-5 שנים\n`;
    } else {
      section += `\n🏖️ התכוננות לפרישה (גיל ${currentAge}):\n`;
      section += `🔹 הגדילו חיסכון פנסיוני באופן משמעותי\n`;
      section += `🔹 הפחיתו הדרגתי השקעות בסיכון גבוה\n`;
      section += `🔹 תכננו מקורות הכנסה לפרישה\n`;
    }

    return section + '\n';
  }

  private generateSavingsBreakdown(AllInfo: any): string {
    let section = `\n💰 פירוט חיסכונות חודשיים:\n`;
    section += `─────────────────────────────────────\n`;
    
    let totalMonthlySavings = 0;
    
    AllInfo.SavingViewInfo.SavingRows.forEach((element: any) => {
      if (element.FixedMonthly !== "") {
        const amount = parseInt(element.FixedMonthly.replace(',', ''));
        section += `💼 ${element.Type}: ${this.formatCurrency(amount)}\n`;
        totalMonthlySavings += amount;
      }
    });
    
    if (totalMonthlySavings > 0) {
      section += `\n✨ סה"כ חיסכון חודשי קבוע: ${this.formatCurrency(totalMonthlySavings)}\n`;
    }
    
    return section;
  }

  private generateReportFooter(): string {
    const currentDate = new Date().toLocaleDateString('he-IL');
    
    let footer = this.createSeparator('📋 סיכום הדוח', '✅');
    
    footer += `📅 תאריך הדוח: ${currentDate}\n`;
    footer += `🔍 הדוח מבוסס על נתונים פיננסיים מעודכנים\n`;
    footer += `⚠️ המלצות מותאמות למצב האישי הנוכחי\n`;
    footer += `📞 מומלץ להתייעץ עם יועץ פיננסי מוסמך\n`;
    footer += `🔄 עדכון הדוח מומלץ כל 6-12 חודשים\n`;
    
    footer += `\n${'═'.repeat(60)}\n`;
    footer += `🏆 דוח ניתוח פיננסי מתקדם - מערכת ניהול פיננסי\n`;
    footer += `${'═'.repeat(60)}\n`;

    return footer;
  }

  private generateFinancialHealthScore(AllInfo: any): string {
    let score = 0;
    let maxScore = 100;
    let section = this.createSeparator('🏆 ציון בריאות פיננסית', '📊');
    
    const totalIncome = parseInt(AllInfo.CalculateData.SumNetIncomes) + 
                       (AllInfo.CalculateData.IncomesEx !== "0" ? parseInt(AllInfo.CalculateData.IncomesEx) : 0);
    const totalExpenses = parseInt(AllInfo.CalculateData.SumExpenses) + 
                         parseInt(AllInfo.CalculateData.SumVariableExpenses);
    const monthlyBalance = totalIncome - totalExpenses;
    
    // הערכת יחס חיסכון (25 נקודות)
    const savingsRate = totalIncome > 0 ? (monthlyBalance / totalIncome) * 100 : 0;
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 5) score += 10;
    else if (savingsRate > 0) score += 5;
    
    // הערכת קרן חירום (20 נקודות)
    const emergencyFund = parseInt(AllInfo.CalculateData.SecurityFund || "0");
    const monthsOfExpenses = totalExpenses > 0 ? emergencyFund / totalExpenses : 0;
    if (monthsOfExpenses >= 6) score += 20;
    else if (monthsOfExpenses >= 3) score += 15;
    else if (monthsOfExpenses >= 1) score += 10;
    else if (monthsOfExpenses > 0) score += 5;
    
    // הערכת חובות (20 נקודות)
    const totalDebts = parseInt(AllInfo.CalculateData.CommitmentAmounts || "0");
    if (totalDebts === 0) score += 20;
    else if (totalDebts < totalIncome * 2) score += 15;
    else if (totalDebts < totalIncome * 5) score += 10;
    else score += 5;
    
    // הערכת גיוון השקעות (15 נקודות)
    const liquidAssets = parseInt(AllInfo.CalculateData.FinanceLiquidityAssets || "0");
    const illiquidAssets = parseInt(AllInfo.CalculateData.FinanceUnliquidityAssets || "0");
    if (liquidAssets > 0 && illiquidAssets > 0) score += 15;
    else if (liquidAssets > 0 || illiquidAssets > 0) score += 10;
    
    // הערכת הכנה לפרישה (20 נקודות)
    const totalPension = parseInt(AllInfo.CalculateData.Pensia || "0") + 
                        parseInt(AllInfo.CalculateData.Gemel || "0") + 
                        parseInt(AllInfo.CalculateData.ManagerInsurance || "0");
    if (totalPension > totalIncome * 0.7) score += 20;
    else if (totalPension > totalIncome * 0.5) score += 15;
    else if (totalPension > totalIncome * 0.3) score += 10;
    else if (totalPension > 0) score += 5;
    
    // הצגת התוצאה
    section += `📊 ציון בריאות פיננסית: ${score}/${maxScore} (${((score/maxScore)*100).toFixed(0)}%)\n\n`;
    
    if (score >= 80) {
      section += `🏆 מעולה! מצב פיננסי יציב וחזק\n`;
    } else if (score >= 60) {
      section += `👍 טוב! מצב פיננסי סביר עם אפשרות לשיפור\n`;
    } else if (score >= 40) {
      section += `⚠️ בינוני! נדרשים שיפורים במספר תחומים\n`;
    } else {
      section += `🔴 חלש! נדרש תכנון פיננסי מקיף ודחוף\n`;
    }
    
    return section + '\n';
  }

  // פונקציה ראשית מעודכנת שכוללת את כל הרכיבים
  generateComprehensiveFinancialReport(AllInfo: any): string {
    // חישובי נתונים בסיסיים
    const incomes = this.calculateIncomes(AllInfo);
    const netIncomes = this.calculateNetIncomes(AllInfo);
    const allIncomes = this.calculateAllIncomes(AllInfo);
    
    // עדכון נתוני החישוב
    this.updateCalculatedData(AllInfo, incomes, netIncomes, allIncomes);

    let report = '';

    // בניית הדוח המלא
    report += this.createMainHeader('📊 דוח ניתוח פיננסי מתקדם 📊');
    report += this.generatePersonalInfo(AllInfo);
    report += this.generateFinancialHealthScore(AllInfo);
    report += this.generateExecutiveSummary(AllInfo);
    report += this.generateIncomeSection(AllInfo);
    report += this.generateExpensesSection(AllInfo);
    report += this.generateAssetsSection(AllInfo);
    report += this.generateInsuranceSection(AllInfo);
    report += this.generateDebtsSection(AllInfo);
    report += this.generateSavingsBreakdown(AllInfo);
    report += this.generateAdvancedAnalysis(AllInfo);
    report += this.generateRecommendations(AllInfo);
    report += this.generateReportFooter();

    return report;
  }
}