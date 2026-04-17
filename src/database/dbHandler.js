const {
  Console
} = require('console');
const fs = require('fs');
const {
  resolve
} = require('path');
const {
  consumers
} = require('stream');

const sqlite3 = require('sqlite3').verbose();

const dbFilePath = './src/database/financial.advisor.db'; // Path to your SQLite database file
/*

// UserT
SELECT u.mail AS mail,u.identification AS ID,p.first_name
FROM UserT AS u
INNER JOIN PersonT AS p ON u.id = p.user_id 
WHERE p.is_primary = 1

// FinanceAdvisorT
SELECT f.saudi_insurance_in_home As SeudiInsuranceInHome,f.saudi_insurance_in_mossad As SeudiInsuranceInMossad,f.annual_interest AS AnnualInterst,f.unplaned AS Unplanned
FROM UserT AS u
INNER JOIN FinanceAdvisorT AS F ON u.id = F.user_id 	
WHERE (u.mail = 'shilmanlior@gmail.com' AND u.identification = '031507726');

// PersonT
SELECT p.first_name AS FirstName,p.age AS Age,p.number_of_children AS NumberOfChildren,p.retirement_age AS RetirementAge,status.status AS Status,sex.sex AS Sex
FROM UserT AS u 
INNER JOIN PersonT AS p,StatusT AS status,FinanceAdvisorT AS f ,SexT AS sex 
  ON u.id = p.user_id AND status.id = p.status_id AND sex.id = p.sex_id AND u.id = f.user_id
	
WHERE (u.mail = 'shilmanlior@gmail.com' AND u.identification = '031507726');

// ChildT
SELECT c.name AS FirstName,c.age AS Age,sex.sex AS Sex
FROM PersonT AS p
INNER JOIN SexT AS sex,ChildT AS c 
  ON sex.id = c.sex_id AND p.id = c.person_id
	
WHERE p.first_name = "ליאור"

// IncomesT
SELECT i.type AS Type,i.fixed_monthly AS FixedMountly,i.monthly_revenue_1 AS MonthlyRevenue1,i.monthly_revenue_2 AS MonthlyRevenue2,i.monthly_revenue_3 AS MonthlyRevenue3,i.comment AS Comment
FROM IncomesT AS i
WHERE i.person_id = (SELECT id FROM PersonT WHERE first_name = 'ליאור')

// IncomesExT
SELECT i.type AS Type,i.monthly_avg AS MonthlyAvg,i.comment AS Comment
FROM IncomesExT AS i
WHERE i.user_id = (SELECT id FROM UserT WHERE mail = 'shilmanlior@gmail.com' AND identification = '031507726');

// FixedExpensesT
SELECT f.type AS Type,f.fixed_monthly AS FixedMonthly,f.monthly_revenue_1 AS MonthlyRevenue1,f.monthly_revenue_2 AS MonthlyRevenue2,f.monthly_revenue_3 AS MonthlyRevenue3,f.comment	AS Comment
FROM FixedExpensesT AS f
WHERE f.user_id = (SELECT id FROM UserT WHERE mail = 'shilmanlior@gmail.com' AND identification = '031507726');








*/


const sexValues = [{
  id: 1,
  sex: 'זכר'
},
{
  id: 2,
  sex: 'נקבה'
}
];

const statusValues = [{
  id: 1,
  status: 'רווק'
},
{
  id: 2,
  status: 'נשוי'
},
{
  id: 3,
  status: 'גרוש'
},
{
  id: 4,
  status: 'אלמן'
}
];

class DbHandler {

  constructor() {

  }

  DeleteDB() {
    if (fs.existsSync(dbFilePath)) {
      // If it exists, delete it
      fs.unlinkSync(dbFilePath);
      console.log(`Database file '${dbFilePath}' has been deleted.`);
    } else {
      console.log(`Database file '${dbFilePath}' does not exist.`);
    }

  }

  CloseDB() {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        console.log("Database closed.");
      }
    });
  }

  RemoveUserByID(id) {
    //console.log("RemoveUserByID");
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.get("PRAGMA foreign_keys = ON");
          this.db.run(`DELETE FROM UserT 
                       WHERE id = ${id}`, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve("");
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetAllUsers() {
    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT u.id AS UserID,u.mail AS Mail,u.Identification AS ID,p.first_name AS FirstName
                   FROM UserT AS u
                   INNER JOIN PersonT AS p ON u.id = p.user_id 
                   WHERE p.is_primary = 1`, (err, rows) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              //console.log("UserID - " + rows);
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetFinanceAdvisorByUser(id) {
    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT f.id AS Id,f.saudi_insurance_in_home As SeudiInsuranceInHome,f.saudi_insurance_in_mossad As SeudiInsuranceInMossad,f.annual_interest AS AnnualInterst,f.unplaned AS Unplanned,f.credit_rating AS CreditRating
                       FROM UserT AS u
                       INNER JOIN FinanceAdvisorT AS F ON u.id = F.user_id 	
                       WHERE (u.id = ${id})`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetPersonalDataByUser(id) {
    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT p.id AS Id,p.first_name AS FirstName,p.age AS Age,p.number_of_children AS NumberOfChildren,p.retirement_age AS RetirementAge,status.status AS Status,sex.sex AS Sex,is_primary AS IsPrimary
                       FROM UserT AS u 
                       INNER JOIN PersonT AS p,StatusT AS status,FinanceAdvisorT AS f ,SexT AS sex 
                       ON u.id = p.user_id AND status.id = p.status_id AND sex.id = p.sex_id AND u.id = f.user_id
                       WHERE(u.id = ${id})`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetChildrenByPersonID(parentId) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT c.id AS Id,c.name AS FirstName,c.age AS Age,sex.sex AS Sex
          FROM PersonT AS p
          INNER JOIN SexT AS sex,ChildT AS c 
            ON sex.id = c.sex_id AND p.id = c.person_id
          WHERE p.id = ${parentId}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetRelativesByParentsID(partner1Id, partner2Id) {
    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT r.id AS Id,r.father_age AS FatherAge,r.mother_age AS MotherAge,r.father_can_help AS FatherCanHelp,r.mother_can_help AS MotherCanHelp,r.father_need_help AS FatherNeedHelp,r.mother_need_help AS MotherNeedHelp,r.father_inheritance_amount AS FatherInheritanceAmount,r.mother_inheritance_amount AS MotherInheritanceAmount,r.father_comment AS FatherComment,r.mother_comment AS MotherComment,r.person_id AS PersonID
          FROM RelativeT AS r
		      WHERE r.person_id = ${partner1Id} OR r.person_id = ${partner2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetIncomesByPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT i.id AS Id,i.type AS Type,i.fixed_monthly AS FixedMonthly,i.monthly_revenue_1 AS MonthlyRevenue1,i.monthly_revenue_2 AS MonthlyRevenue2,i.monthly_revenue_3 AS MonthlyRevenue3,i.comment AS Comment,i.person_id AS PersonID
          FROM IncomesT AS i
          WHERE i.person_id = ${person1Id} OR i.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetIncomesExByPersonID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT i.id AS Id,i.type AS Type,i.monthly_avg AS MonthlyAvg,i.comment AS Comment
          FROM IncomesExT AS i
          WHERE i.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetFixedExpensesByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT f.id AS Id,f.type AS Type,f.fixed_monthly AS FixedMonthly,f.monthly_expense_1 AS MonthlyExpense1,f.monthly_expense_2 AS MonthlyExpense2,f.monthly_expense_3 AS MonthlyExpense3,f.comment AS Comment
          FROM FixedExpensesT AS f
          WHERE f.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }


  GetSavingByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT s.id AS Id,s.type AS Type,s.fixed_monthly AS FixedMonthly,s.current_amount AS CurrentAmount,s.comment AS Comment
          FROM SavingT AS s
          WHERE s.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetRealEstatesByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT r.id AS Id,r.type AS Type,r.asset_value AS AssetValue,r.nortgage_balance AS MortgageBalance,r.comment AS Comment
          FROM RealEstatesT AS r
          WHERE r.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));

            }
          });

          this.db.close();
        }
      });
    });
  }

  GetVehiclesByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT v.id AS Id,v.description AS Description,v.year_of_production AS YearOfProduction,v.vehicle_worth AS VehicleWorth,v.km_per_year AS KmPerYear,v.fuel_consumption AS FuelConsumption,v.test AS Test,v.insurance AS Insurance,v.treatments AS Treatments,v.price_of_fuel AS PriceOfFuel, v.comment AS Comment
          FROM VehiclesT AS v
          WHERE v.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetFinanceLiquidityAssetByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT f.id AS Id,f.description AS Description,f.saving_location AS SavingLocation,f.current_amount AS CurrentAmount,f.comment AS Comment
          FROM FinanceLiquidityAssetT AS f
          WHERE f.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetFinanceUnliquidityAssetByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT f.id AS Id,f.description AS Description,f.saving_location AS SavingLocation,f.current_amount AS CurrentAmount,f.comment AS Comment
          FROM FinanceUnliquidityAssetT AS f
          WHERE f.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetCommitmentsByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT c.id AS Id,c.description AS Description,c.ExecutionDate AS ExecutionDate,c.original_amount AS OriginalAmount,c.curr_amount AS CurrAmount,c.monthly_payment AS MonthlyPayment,c.interest AS Interest,c.comment AS Comment,c.user_id AS UserID  
          FROM CommitmentsT AS c
          WHERE c.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetCurrentFlowByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT c.id AS Id,c.date AS Date,c.Type AS Type,c.curr_amount AS CurrAmount,c.comment AS Comment,c.user_id AS UserID  
          FROM CurrentFlowT AS c
          WHERE c.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }


  GetMortgagesByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT m.id AS Id,m.name AS Name,m.route AS Route,m.original_amount AS OriginalAmount,m.curr_amount AS CurrentAmount,m.interest AS Interest,m.yearToEnd AS YearToEnd,m.linkage AS Linkage
          FROM MortgagesT AS m
          WHERE m.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetLifeInsuranceByPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT l.id AS Id,l.name AS Name,l.capital_amount AS CapitalAmount,l.comment AS Comment, l.person_id AS PersonID
          FROM LifeInsuranceT AS l
          WHERE l.person_id = ${person1Id} OR l.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetPensionJointUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT p.id AS Id,p.name_of_insurance AS NameOfInsurance,p.amount AS Amount,p.comment AS Comment
          FROM PensionJointT AS p
          WHERE p.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetSocialSecurityBenefitsPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT s.id AS Id,s.name_of_insurance AS NameOfInsurance, s.amount AS Amount, s.person_id AS PersonID
          FROM SocialSecurityBenefitsT AS s
          WHERE s.person_id = ${person1Id} OR s.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetOldPensionFundPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {

          this.db.all(`SELECT o.id AS Id,o.name_of_insurance AS NameOfInsurance, o.allowance_amount AS AllowanceAmount, o.widows_allowance AS WidowsAllowance, o.orphan_allowance AS OrphanAllowance, o.person_id AS PersonID
          FROM OldPensionFundT AS o
          WHERE o.person_id = ${person1Id} OR o.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetPensionFundPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT p.id AS Id,p.name_of_insurance AS NameOfInsurance, p.current_capital_amount AS CurrentCapitalAmount, monthly_deposit_amount AS MonthlyDepositAmount, p.EndDate AS EndDate , p.widows_allowance AS WidowsAllowance, p.orphan_allowance AS OrphanAllowance, p.disability_fund AS DisabilityFund, p.person_id AS PersonID
          FROM PensionFundT AS p
          WHERE p.person_id = ${person1Id} OR p.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetGemelPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT p.id AS Id,p.name_of_insurance AS NameOfInsurance, p.current_capital_amount AS CurrentCapitalAmount, monthly_deposit_amount AS MonthlyDepositAmount, p.EndDate AS EndDate ,p.person_id AS PersonID
          FROM GemelT AS p
          WHERE p.person_id = ${person1Id} OR p.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }


  GetManagerInsurancePersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {

          this.db.all(`SELECT m.id AS Id,m.name_of_insurance AS NameOfInsurance, m.current_capital_amount AS CurrentCapitalAmount, m.monthly_deposit_amount AS MonthlyDepositAmount, m.lump_sum AS LumpSum, m.allowance_factor AS AllowanceFactor, m.person_id AS PersonID
          FROM ManagerInsuranceT AS m
          WHERE m.person_id = ${person1Id} OR m.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetLifeLongCareInsurancesInInsuranceCompanyByPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {

          this.db.all(`SELECT l.id AS Id,l.name AS Name, l.first_5_year_home_mount AS First5YearHomeAmount, l.over_6_year_home_mount AS Over6YearHomeAmount, l.first_5_year_seudi_mount AS First5YearSeudiAmount, l.over_6_year_seudi_mount AS Over6YearSeudiAmount, l.person_id AS PersonID
          FROM LifeLongCareInsurancesInInsuranceCompanyT AS l
          WHERE l.person_id = ${person1Id} OR l.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetLossOfWorkingCapacityPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {

          this.db.all(`SELECT l.id AS Id,l.gross_for_pension AS GrossForPension, l.social_security AS SocialSecurity, l.pension_fund AS PensionFund, l.manager_insurance AS ManagerInsurance, l.private_insurance AS PrivateInsurance, l.person_id AS PersonID
          FROM LossOfWorkingCapacityT AS l
          WHERE l.person_id = ${person1Id} OR l.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  
  GetVariableExpensesByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT v.id AS Id,v.type AS Type, v.category_name AS CategoryName, v.sub_category_name AS SubCategoryName, v.curr_expense AS CurrentExpense, v.satisfaction_expense AS SatisfactionExpense, v.defference_expense AS DifferenceExpense, v.anchor AS Anchor, v.flexible AS Flexible, v.good_to_be AS GoodToBe,v.category_index AS CategoryIndex,v.subcategory_index AS SubcategoryIndex, v.user_id AS UserID
          FROM VariableExpensesT AS v
          WHERE v.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              //console.warn('VariableExpensesT', rows);
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }


  GetLifeLongCareInsurancesInHealthByPersonID(person1Id, person2Id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT l.id AS Id,l.name AS Name, l.home_amount AS HomeAmount, l.seudi_amount AS SeudiAmount, l.person_id AS PersonID
          FROM LifeLongCareInsurancesInHealthT AS l
          WHERE l.person_id = ${person1Id} OR l.person_id = ${person2Id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetLifeLongCareInsurancesInInsuranceCompany4ChildrensByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT l.id AS Id,l.child_name AS ChildName, l.name AS Name, l.first_5_year_home_mount AS First5YearHomeMount, l.over_6_year_home_mount AS Over6YearHomeMount, l.first_5_year_seudi_mount AS First5YearSeudiMount, l.over_6_year_seudi_mount AS Over6YearSeudiMount, l.user_id AS UserID
          FROM LifeLongCareInsurancesInInsuranceCompany4ChildrensT AS l
          WHERE l.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetHealthInsuranceByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT h.id AS Id,h.name_of_insured AS NameOfInsured, h.name_of_health_insurance AS NameOfHealthInsurance, h.supplementary_insurance AS SupplementaryInsurance, h.private_insurance_description AS PrivateInsurancDescription, h.user_id AS UserID
          FROM HealthInsuranceT AS h
          WHERE h.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetRepetitiveGoalsByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT r.id AS Id,r.name_of_target AS NameOfTarget, r.every_few_years AS EveryFewYears, r.target_cost AS TargetCost, r.user_id AS UserID
          FROM RepetitiveGoalsT AS r
          WHERE r.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetEconomicalStabilityByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT e.id AS Id,e.capital_labeled_for_this AS CapitalLabeledForThis, e.in_how_many_years AS InHowManyYears, e.user_id AS UserID
          FROM EconomicalStabilityT AS e
          WHERE e.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetIncomesGoalByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT i.id AS Id,i.income_source AS IncomeSource, i.incomes AS Incomes, i.return_on_savings AS ReturnOnSavings, i.user_id AS UserID
          FROM IncomesGoalT AS i
          WHERE i.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }

  GetOneOffFamilyGoalByUserID(id) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          this.db.all(`SELECT i.id AS Id,i.one_off_family_goal AS OneOffFamilyGoal, i.deposit_from_funds_one_off_family_goal AS DepositFromFundsOneOffFamilyGoal,i.additional_deposit_one_off_family_goals_row AS AdditionalDepositOneOffFamilyGoalsRow, i.put_aside AS PutAside, i.savings_exist_for_children AS SavingsExistForChildren, i.cumulative_return_on_investment AS CumulativeReturnOnInvestment, i.user_id AS UserID
          FROM OneOffFamilyGoalsT AS i
          WHERE i.user_id = ${id}`, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.stringify(rows));
            }
          });

          this.db.close();
        }
      });
    });
  }



  /*  

      this.db.run('CREATE TABLE IF NOT EXISTS HealthInsuranceT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, SupplementaryInsurance INTEGER , PrivateInsurancDescription TEXT,comment TEXT,user_id INTEGER, FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });


  //LifeLongCareInsurancesInInsuranceCompany4ChildrensT
    this.db.run('CREATE TABLE IF NOT EXISTS LifeLongCareInsurancesInInsuranceCompany4ChildrensT (id INTEGER PRIMARY KEY AUTOINCREMENT, child_name TEXT,name TEXT, first_5_year_home_mount INTEGER, over_6_year_home_mount INTEGER, first_5_year_seudi_mount INTEGER, over_6_year_seudi_mount INTEGER, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table LifeInsuranceT created successfully.');
      }
    });



    //LifeLongCareInsurancesInInsuranceCompanyT
    this.db.run('CREATE TABLE IF NOT EXISTS LifeLongCareInsurancesInInsuranceCompanyT (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, first_5_year_home_mount INTEGER, over_6_year_home_mount INTEGER, first_5_year_seudi_mount INTEGER, over_6_year_seudi_mount INTEGER, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table LifeInsuranceT created successfully.');
      }
    });

  

   
    //PensionFundT
    this.db.run('CREATE TABLE IF NOT EXISTS PensionFundT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, current_capital_amount INTEGER, monthly_deposit_amount INTEGER, EndDate TEXT, widows_allowance INTEGER, orphan_allowance INTEGER, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table LifeInsuranceT created successfully.');
      }
    });

    
    //OldPensionFundT
    this.db.run('CREATE TABLE IF NOT EXISTS OldPensionFundT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, allowance_amount INTEGER , widows_allowance INTEGER, orphan_allowance INTEGER, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table LifeInsuranceT created successfully.');
      }
    });

 */

  /*   this.db.run('CREATE TABLE IF NOT EXISTS RealEstatesT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,asset_value	INTEGER,nortgage_balance	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table RealEstatesT created successfully.');
      }
    });

    // VehiclesT
    this.db.run('CREATE TABLE IF NOT EXISTS VehiclesT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,year_of_production	INTEGER,vehicle_worth	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table VehiclesT created successfully.');
      }
    });

    // FinanceLiquidityAssetT
    this.db.run('CREATE TABLE IF NOT EXISTS FinanceLiquidityAssetT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,saving_location	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table FinanceAssetT created successfully.');
      }
    });

    // FinanceUnliquidityAssetT
    this.db.run('CREATE TABLE IF NOT EXISTS FinanceUnliquidityAssetT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,saving_location	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        //console.log('Table FinanceAssetT created successfully.');
      }
    });
     */
  /* this.db.run('CREATE TABLE IF NOT EXISTS SavingT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,fixed_monthly	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      //console.log('Table SavingT created successfully.');
    }
  }); */


  ReadAllUsersDB(mail, identification) {

    var AllUserList = "";

    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to the database.');
      }
    });

    this.GetAllUsers().then(rows => {
      AllUserList = rows;
    });

    //console.log(AllUserList);

    this.db.close();
  }

  InitializeDB() {
    //this.DeleteDB();
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to the database.');

        // Check if the database exists
        this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence';", (err, row) => {
          if (err) {
            console.error('Error checking database:', err.message);
          } else {
            if (!row) {
              // SexT 
              this.db.run('CREATE TABLE IF NOT EXISTS SexT (id	INTEGER PRIMARY KEY ,sex	TEXT);', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table SexT created successfully.');

                  this.InsertData('SexT', sexValues);
                }
              });

              // StatusT 
              this.db.run('CREATE TABLE IF NOT EXISTS StatusT (id INTEGER PRIMARY KEY,status	TEXT);', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table StatusT created successfully.');

                  this.InsertData('StatusT', statusValues);
                }
              });

              // UserT 
              this.db.run('CREATE TABLE IF NOT EXISTS UserT (id	INTEGER PRIMARY KEY AUTOINCREMENT,mail	TEXT UNIQUE,identification	TEXT UNIQUE);', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table UserT created successfully.');
                }
              });

              // PersonT
              this.db.run('CREATE TABLE IF NOT EXISTS PersonT (id INTEGER PRIMARY KEY AUTOINCREMENT,first_name	TEXT,age INTEGER,number_of_children INTEGER,status_id INTEGER,sex_id INTEGER,retirement_age INTEGER,is_primary INTEGER,user_id INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id),FOREIGN KEY (status_id) REFERENCES StatusT(id),FOREIGN KEY (sex_id) REFERENCES SexT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table PersonT created successfully.');
                }
              });

              // PersonalDataT
              /*               this.db.run('CREATE TABLE IF NOT EXISTS PersonalDataT (id INTEGER PRIMARY KEY AUTOINCREMENT,SaudiInsuranceInHome  TEXT,SaudiinsuranceInMossad TEXT,AnnualInterest TEXT , Unplanned TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                              if (err) {
                                console.error('Error creating table:', err.message);
                              } else {
                                //console.log('Table PersonalDataT created successfully.');
                              }
                            }); */

              // FinanceAdvisorT
              this.db.run('CREATE TABLE IF NOT EXISTS FinanceAdvisorT (id INTEGER PRIMARY KEY AUTOINCREMENT,saudi_insurance_in_home INTEGER,saudi_insurance_in_mossad INTEGER,annual_interest INTEGER,unplaned REAL,user_id INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table FinanceAdvisorT created successfully.');
                }
              });

              // ChildT
              this.db.run('CREATE TABLE IF NOT EXISTS ChildT (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,age INTEGER,sex_id INTEGER,person_id INTEGER,FOREIGN KEY (person_id) REFERENCES PersonT(id),FOREIGN KEY (sex_id) REFERENCES SexT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table ChildT created successfully.');
                }
              });

              // RelativeT
              this.db.run('CREATE TABLE IF NOT EXISTS RelativeT (id INTEGER PRIMARY KEY AUTOINCREMENT,father_age INTEGER,mother_age	INTEGER,father_can_help	INTEGER,mother_can_help	INTEGER,father_need_help INTEGER,mother_need_help INTEGER,father_inheritance_amount	INTEGER,mother_inheritance_amount	INTEGER,father_comment	TEXT,mother_comment	TEXT,person_id	INTEGER,FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table RelativeT created successfully.');
                }
              });

              // IncomesT
              this.db.run('CREATE TABLE IF NOT EXISTS IncomesT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,fixed_monthly	INTEGER,monthly_revenue_1	INTEGER,monthly_revenue_2	INTEGER,monthly_revenue_3	INTEGER,comment	TEXT,person_id	INTEGER,FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table IncomesT created successfully.');
                }
              });

              // IncomesExT
              this.db.run('CREATE TABLE IF NOT EXISTS IncomesExT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,monthly_avg	TEXT,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table IncomesExT created successfully.');
                }
              });

              // FixedExpensesT
              this.db.run('CREATE TABLE IF NOT EXISTS FixedExpensesT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,fixed_monthly	INTEGER,monthly_revenue_1	INTEGER,monthly_revenue_2	INTEGER,monthly_revenue_3	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table FixedExpensesT created successfully.');
                }
              });

              // SavingT
              this.db.run('CREATE TABLE IF NOT EXISTS SavingT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,fixed_monthly	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table SavingT created successfully.');
                }
              });

              // RealEstatesT
              this.db.run('CREATE TABLE IF NOT EXISTS RealEstatesT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,asset_value	TEXT,nortgage_balance	TEXT,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table RealEstatesT created successfully.');
                }
              });

              // VehiclesT
              this.db.run('CREATE TABLE IF NOT EXISTS VehiclesT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,year_of_production	INTEGER,vehicle_worth	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table VehiclesT created successfully.');
                }
              });

              // FinanceLiquidityAssetT
              this.db.run('CREATE TABLE IF NOT EXISTS FinanceLiquidityAssetT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,saving_location	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table FinanceAssetT created successfully.');
                }
              });

              // FinanceUnliquidityAssetT
              this.db.run('CREATE TABLE IF NOT EXISTS FinanceUnliquidityAssetT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,saving_location	INTEGER,current_amount	INTEGER,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table FinanceAssetT created successfully.');
                }
              });

              // CommitmentsT
              this.db.run('CREATE TABLE IF NOT EXISTS CommitmentsT (id INTEGER PRIMARY KEY AUTOINCREMENT,description	TEXT,ExecutionDate	TEXT,original_amount	INTEGER,curr_amount	INTEGER,monthly_payment	INTEGER,end_date	TEXT,interest	REAL,comment	TEXT,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table CommitmentsT created successfully.');
                }
              });

              // VariableExpensesT
              this.db.run('CREATE TABLE IF NOT EXISTS VariableExpensesT (id INTEGER PRIMARY KEY AUTOINCREMENT,type	INTEGER,category_name	TEXT,sub_category_name	TEXT,curr_expense	INTEGER,satisfaction_expense	INTEGER,defference_expense INTEGER,anchor	INTEGER,flexible	INTEGER,good_to_be	INTEGER,user_id	INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table VariableExpensesT created successfully.');
                }
              });

              // MortgagesT
              this.db.run('CREATE TABLE IF NOT EXISTS MortgagesT (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,route TEXT,original_amount TEXT,curr_amount TEXT,interest TEXT,yearToEnd TEXT,monthly_payment TEXT,remaining_mortgage TEXT,cost_of_financing TEXT,user_id INTEGER,FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table VariableExpensesT created successfully.');
                }
              });


              // LifeInsuranceT
              this.db.run('CREATE TABLE IF NOT EXISTS LifeInsuranceT (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, capital_amount TEXT, comment TEXT, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });

              //LifeLongCareInsurancesInHealthT
              this.db.run('CREATE TABLE IF NOT EXISTS LifeLongCareInsurancesInHealthT (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, home_amount TEXT, seudi_amount TEXT,person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });


              //LifeLongCareInsurancesInInsuranceCompanyT
              this.db.run('CREATE TABLE IF NOT EXISTS LifeLongCareInsurancesInInsuranceCompanyT (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, first_5_year_home_mount TEXT, over_6_year_home_mount TEXT, first_5_year_seudi_mount TEXT, over_6_year_seudi_mount TEXT, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });

              //LifeLongCareInsurancesInInsuranceCompany4ChildrensT
              this.db.run('CREATE TABLE IF NOT EXISTS LifeLongCareInsurancesInInsuranceCompany4ChildrensT (id INTEGER PRIMARY KEY AUTOINCREMENT, child_name TEXT,name TEXT, first_5_year_home_mount TEXT, over_6_year_home_mount TEXT, first_5_year_seudi_mount TEXT, over_6_year_seudi_mount TEXT, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });


              //ManagerInsuranceT
              this.db.run('CREATE TABLE IF NOT EXISTS ManagerInsuranceT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, current_capital_amount INTEGER, monthly_deposit_amount INTEGER, lump_sum INTEGER, allowance_factor INTEGER, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table ManagerInsuranceT created successfully.');
                }
              });

              //PensionFundT
              this.db.run('CREATE TABLE IF NOT EXISTS PensionFundT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, current_capital_amount TEXT, monthly_deposit_amount TEXT, EndDate TEXT, widows_allowance TEXT, orphan_allowance TEXT, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table PensionFundT created successfully.');
                }
              });

               //GemelT
               this.db.run('CREATE TABLE IF NOT EXISTS GemelT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, current_capital_amount TEXT, monthly_deposit_amount TEXT, EndDate TEXT, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table GemelT created successfully.');
                }
              });

              //OldPensionFundT
              this.db.run('CREATE TABLE IF NOT EXISTS OldPensionFundT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, allowance_amount TEXT , widows_allowance TEXT, orphan_allowance TEXT, person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table OldPensionFundT created successfully.');
                }
              });

              //SocialSecurityBenefitsT
              this.db.run('CREATE TABLE IF NOT EXISTS SocialSecurityBenefitsT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, amount TEXT , person_id INTEGER, FOREIGN KEY (person_id) REFERENCES PersonT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });

              //PensionJointT
              this.db.run('CREATE TABLE IF NOT EXISTS PensionJointT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, amount TEXT , comment TEXT,user_id INTEGER, FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });

              this.db.run('CREATE TABLE IF NOT EXISTS HealthInsuranceT (id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_insurance TEXT, name_of_health_insurance TEXT,supplementary_insurance INTEGER , private_insurance_description TEXT,user_id INTEGER, FOREIGN KEY (user_id) REFERENCES UserT(id));', (err) => {
                if (err) {
                  console.error('Error creating table:', err.message);
                } else {
                  //console.log('Table LifeInsuranceT created successfully.');
                }
              });



              // Insert data into LifeInsuranceT
              /*  const lifeInsuranceData = [
                 { id: 1, name: 'Life Insurance 1', route: 'route1', original_amount: 100000, curr_amount: 100000, interest: 5, yearToEnd: 10, monthly_payment: 1000, remaining_mortgage: 50000, cost_of_financing: 5000, user_id: 1 },
                 { id: 2, name: 'Life Insurance 2', route: 'route2', original_amount: 200000, curr_amount: 200000, interest: 6, yearToEnd: 15, monthly_payment: 1500, remaining_mortgage: 100000, cost_of_financing: 10000, user_id: 1 }
               ];
               this.InsertData('LifeInsuranceT', lifeInsuranceData); */

            }
          }
        });
        console.log('Database initialized successfully.');
      }
    });

    this.db.close();
  }

  InsertData(table, values) {
    const placeholders = values.map(() => '(?, ?)').join(', ');
    const query = `INSERT OR IGNORE INTO ${table} VALUES ${placeholders}`;
    const params = values.flatMap(obj => [obj.id, obj.sex || obj.status]);
    this.db.run(query, params, (err) => {
      if (err) {
        console.error(`Error inserting data into ${table}:`, err.message);
      } else {
        //console.log(`Data inserted into ${table} successfully.`);
      }
    });
  }

  CheckUserIDExist(obj) {
    return new Promise((resolve, reject) => {
      return this.db.get(`SELECT id FROM UserT WHERE mail = '${obj.PersonalData.Mail}' and identification = '${obj.PersonalData.Id}'`, function (err, row) {
        //console.log("UserT");
        if (err) {
          console.error(`Error get data from UserT: ${err}`);
          reject(err);
        } else {
          if (row === undefined) {
            console.log(`No data found in UserT for the given status.`);
            resolve(undefined);
          } else {
            //console.log(`Data inserted into UserT successfully.`);
            resolve(row.id);
          }
        }
      });
    })
  };

  GetUserID(obj) {
    return new Promise((resolve, reject) => {
      return this.db.run(`INSERT OR IGNORE INTO UserT (mail, identification) VALUES ('${obj.PersonalData.Mail}','${obj.PersonalData.Id}');`, function (err) {
        //console.log("UserT");
        if (err) {
          console.error(`Error inserting data into UserT:`);
          reject(err);
        } else {
          resolve(this.lastID);
        };
      })
    })
  };

  GetStatusID(status) {
    return new Promise((resolve, reject) => {
      return this.db.get(`SELECT id FROM StatusT WHERE status = '${status}'`, function (err, row) {
        //console.log("StatusT");
        if (err) {
          console.error(`Error select data from StatusT:`);
          reject(err);
        } else {
          if (row === undefined) {
            console.log(`No data found in StatusT for the given status.`);
            reject(err);
          } else {
            //console.log(`Data inserted into UserT successfully.`);
            resolve(row.id);
          }
        };
      })
    })
  };

  GetSexID(sex) {
    return new Promise((resolve, reject) => {
      return this.db.get(`SELECT id FROM SexT WHERE sex = '${sex}'`, function (err, row) {
        //console.log("SexT");
        if (err) {
          console.error(`Error select data into SexT:`);
          reject(err);
        } else {
          if (row === undefined) {
            console.log(`No data found in SexT for the given status.`);
            reject(err);
          } else {
            //console.log(`Data inserted into UserT successfully.`);
            resolve(row.id);
          }
        };
      })
    })
  };

  GetPersonIDAfterInsert(name, age, numberOfChildren, status, sex, retirementAge, isPrimary, userId) {
    return new Promise((resolve, reject) => {
      //console.log("GetPersonIDAfterInsert - " + userId);
      return this.db.run('INSERT INTO PersonT (first_name,age,number_of_children,status_id,sex_id,retirement_age,is_primary,user_id) VALUES (?,?,?,?,?,?,?,?)', [`${name}`, `${age}`, `${numberOfChildren}`, `${status}`, `${sex}`, `${retirementAge}`, `${isPrimary == true ? 1 : 0}`, `${userId}`], function (err) {
        //console.log("PersonT");
        if (err) {
          console.error(`Error inserting data into PersonT:`);
          reject(err);
        } else {
          //console.log(`Data inserted into UserT successfully.`);
          resolve(this.lastID);
        }
      });
    })
  };


  RemoveUser(projectInfo) {
    return new Promise((resolve, reject) => {
      console.error("RemoveUser");
      //console.log(projectInfo);
      const obj = JSON.parse(projectInfo);

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log('Connected to the database.');
        }
      });

      this.db.run('PRAGMA foreign_keys = ON');
      var UserID = -1;
      let resultCheckUserID = this.CheckUserIDExist(obj).catch((err) => {
        console.log(err);
      }).then((userID) => {
        //console.log(obj);
        if (userID != undefined) {
          UserID = userID;
          this.db.all(`SELECT id FROM PersonT WHERE user_id = '${userID}'`, (err, row) => {
            //console.log("StatusT");
            if (err) {
              console.error(`Error select data from PersonT:`);
              reject(err);
            } else {
              if (row === undefined) {
                console.log(`No data found in PersonT for the given userID.`);
                reject(err);
              } else {
                console.log(row);
                row.forEach(element => {
                  console.log(element);
                  this.db.run(`DELETE FROM PersonT
                  WHERE id = ${element.id};`, (err) => {
                    if (err) {
                      console.error(`Error delete data fom PersonT: ${err}`);
                    } else {
                      console.error(`Delete Person - ${element.id}`);
                    }
                  });
                });

                this.db.run(`DELETE FROM UserT
                WHERE id = ${userID};`, (err) => {
                  if (err) {
                    console.error(`Error delete data fom UserT: ${err}`);
                  } else {
                    console.error(`Delete User - ${userID}`);

                    this.GetUserID(obj).then((userID) => {
                      UserID = userID;
                      console.log(userID);
                      console.error(`END`);
                      this.db.close();
                      //console.log("this.db.close();");
                      resolve({UserID: UserID});
                      
                    })
                  }
                });
              }
            };
          })
        }
        else
        {
          this.GetUserID(obj).then((userID) => {
            UserID = userID;
            console.log(userID);
            console.error(`END`);
            this.db.close();
            //console.log("this.db.close();");
            resolve({UserID: UserID});
          })
        }
      });
    });
  }


  SaveProject(projectInfo) {
    return new Promise((resolve, reject) => {
      this.RemoveUser(projectInfo).then( res => {
      console.log(res);

      var UserID = res.UserID;
      console.log("UserID ---- " + UserID);
      var Partner1StatusID = -1;
      var Partner1SexID = -1;
      var Partner1ID = -1;

      //console.log(projectInfo);
      const obj = JSON.parse(projectInfo);

      this.db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log('Connected to the database.');
        }
      });

      this.db.run('PRAGMA foreign_keys = ON');
      this.db.run("BEGIN");

        let resultPartner1SexID = this.GetSexID(obj.PersonalData.SelectedSex1).then((sexID) => {
          Partner1SexID = sexID;
          //console.log(obj.PersonalData.SelectedStatus1);
          let resultStatusID = this.GetStatusID(obj.PersonalData.SelectedStatus1).then((statusID) => {
            Partner1StatusID = statusID;
            //console.log(obj.PersonalData.Name1);
            let resultPartner1ID = this.GetPersonIDAfterInsert(obj.PersonalData.Name1, obj.PersonalData.Age1, obj.PersonalData.NumberOfChildren1, Partner1StatusID, Partner1SexID, obj.PersonalData.RetirementAge1, true, UserID).then((partner1ID) => {
              Partner1ID = partner1ID;


              this.db.run(`INSERT OR IGNORE INTO FinanceAdvisorT (saudi_insurance_in_home,saudi_insurance_in_mossad,annual_interest,unplaned,credit_rating,user_id) VALUES ('${obj.PersonalData.SaudiInsuranceInHome}','${obj.PersonalData.SaudiinsuranceInMossad}','${obj.PersonalData.AnnualInterest}','${obj.PersonalData.Unplanned}','${obj.PersonalData.CreditRating}',${UserID});`, (err) => {
                if (err) {
                  console.error(`Error inserting data into FinanceAdvisorT: ${err}`);
                } else {
                  console.error(`1`);
                }
              });


              this.db.run(`INSERT OR IGNORE INTO RelativeT (father_age,mother_age,father_can_help,mother_can_help,father_need_help,mother_need_help,father_inheritance_amount,mother_inheritance_amount,father_comment,mother_comment,person_id) VALUES (
                          '${obj.Relative.FatherAge1}',
                          '${obj.Relative.MotherAge1}',
                          '${obj.Relative.FatherCanHelp1}',
                          '${obj.Relative.MotherCanHelp1}',
                          '${obj.Relative.FatherNeedHelp1}',
                          '${obj.Relative.MotherNeedHelp1}',
                          '${obj.Relative.FatherGetF1}',
                          '${obj.Relative.MotherGetF1}',
                          '${obj.Relative.CommentFather1}',
                          '${obj.Relative.CommentMother1}',
                          '${Partner1ID}');`, (err) => {
                //console.log("RelativeT1");
                //console.log(`Partner1ID - ${Partner1ID} , Partner2ID - ${Partner2ID}`);
                if (err) {
                  console.error(`Error inserting data 1 into RelativeT:`);
                } else {
                  console.error(`2`);
                }
              });

              let insertStatement = "";
              this.HandlePartner2(this.db, obj, UserID);
              obj.Income1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Type}','${element.FixedMonthly}','${element.MonthlyRevenue1}','${element.MonthlyRevenue2}','${element.MonthlyRevenue3}','${element.Comment}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.Type}','${element.FixedMonthly}','${element.MonthlyRevenue1}','${element.MonthlyRevenue2}','${element.MonthlyRevenue3}','${element.Comment}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO IncomesT (type,fixed_monthly,monthly_revenue_1,monthly_revenue_2,monthly_revenue_3,comment,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 1 into IncomeT:${err}`);
                  } else {
                    console.error(`3`);
                  }
                });
              }

              insertStatement = "";
              obj.incomeEx.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Type}','${element.MonthlyAvg}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Type}','${element.MonthlyAvg}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO IncomesExT (type,monthly_avg,comment,user_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into IncomesExT: ${err}`);
                  } else {
                    console.error(`4`);
                  }
                });
              }

              insertStatement = "";
              obj.FixedExpense.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Type}','${element.FixedMonthly}','${element.MonthlyExpense1}','${element.MonthlyExpense2}','${element.MonthlyExpense3}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Type}','${element.FixedMonthly}','${element.MonthlyExpense1}','${element.MonthlyExpense2}','${element.MonthlyExpense3}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);

              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO FixedExpensesT (type,fixed_monthly,monthly_expense_1,monthly_expense_2,monthly_expense_3,comment,user_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into FixedExpensesT: ${err}`);
                  } else {
                    console.error(`5`);
                  }
                });
              }

              insertStatement = "";
              obj.Saving.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Type}','${element.FixedMonthly}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Type}','${element.FixedMonthly}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);

              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO SavingT (type,fixed_monthly,current_amount,comment,user_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into SavingT: ${err}`);
                  } else {
                    console.error(`6`);
                  }
                });
              }

              insertStatement = "";
              obj.Mortgages.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.Route}','${element.OriginalAmount}','${element.CurrAmount}','${element.Interest}','${element.YearToEnd}','${element.Linkage}',${UserID})`;
                else
                  insertStatement += `,('${element.Name}','${element.Route}','${element.OriginalAmount}','${element.CurrAmount}','${element.Interest}','${element.YearToEnd}','${element.Linkage}',${UserID})`;
              });
              console.error(`${insertStatement};`);

              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO MortgagesT (name,route,original_amount,curr_amount,interest,yearToEnd,linkage,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into MortgagesT: ${err}`);
                  } else {
                    console.error(`7`);
                  }
                });
              }

              console.error(`obj.RealEstate - ${obj.RealEstate}`);
              insertStatement = "";
              obj.RealEstate.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Description}','${element.AssetValue}','${element.NortgageBalance}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Description}','${element.AssetValue}','${element.NortgageBalance}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO RealEstatesT (type,asset_value,nortgage_balance,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into RealEstatesT: ${err}`);
                  } else {
                    console.error(`8`);
                  }
                });
              }
              
              insertStatement = "";
              obj.Vehicles.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Description}','${element.YearOfProduction}','${element.VehicleWorth}','${element.KmPerYear}','${element.FuelConsumption}','${element.Test}','${element.Insurance}','${element.Treatments}','${element.Comment}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Description}','${element.YearOfProduction}','${element.VehicleWorth}','${element.KmPerYear}','${element.FuelConsumption}','${element.Test}','${element.Insurance}','${element.Treatments}','${element.Comment}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO VehiclesT (description,year_of_production,vehicle_worth,km_per_year,fuel_consumption,test,insurance,treatments,price_of_fuel,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into VehiclesT: ${err}`);
                  } else {
                    console.error(`9`);
                  }
                });
              }

              insertStatement = "";
              obj.Commitments.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.TheLender}','${element.ExecutionDate}','${element.OriginalAmount}','${element.CurrAmount}','${element.MonthlyPayment}','${element.Interest}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.TheLender}','${element.ExecutionDate}','${element.OriginalAmount}','${element.CurrAmount}','${element.MonthlyPayment}','${element.Interest}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO CommitmentsT (description,ExecutionDate,original_amount,curr_amount,monthly_payment,interest,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into CommitmentsT: ${err}`);
                  } else {
                    console.error(`10`);
                  }
                });
              }

              insertStatement = "";
              obj.CurrentFlow.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Date}','${element.Type}','${element.CurrAmount}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.Date}','${element.Type}','${element.CurrAmount}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO CurrentFlowT (date,type,curr_amount,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into CurrentFlowT: ${err}`);
                  } else {
                    console.error(`10.1`);
                  }
                });
              }

              insertStatement = "";
              obj.PensionFund1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}','${element.DisabilityFund}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}','${element.DisabilityFund}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO PensionFundT (name_of_insurance, current_capital_amount, monthly_deposit_amount, EndDate, widows_allowance, orphan_allowance,disability_fund, person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into PensionFundT: ${err}`);
                  } else {
                    console.error(`11`);
                  }
                });
              }

              insertStatement = "";
              obj.Gemel1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO GemelT (name_of_insurance, current_capital_amount, monthly_deposit_amount, EndDate, person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into GemelT: ${err}`);
                  } else {
                    console.error(`11`);
                  }
                });
              }


              insertStatement = "";
              obj.ManagerInsurance1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO ManagerInsuranceT (name_of_insurance, current_capital_amount, monthly_deposit_amount, lump_sum,allowance_factor,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into ManagerInsuranceT: ${err}`);
                  } else {
                    console.error(`12`);
                  }
                });
              }

              insertStatement = "";
              obj.PensionJoint.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.Amount}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.Amount}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO PensionJointT (name_of_insurance, amount, comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into PensionJointT: ${err}`);
                  } else {
                    console.error(`13`);
                  }
                });
              }

              insertStatement = "";
              obj.HealthInsurance.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsured}','${element.NameOfHealthInsurance}','${(element.SupplementaryInsurance === true) ? 1 : 0}','${element.PrivateInsurancDescription}',${UserID})`;
                else
                  insertStatement += `,('${element.NameOfInsured}','${element.NameOfHealthInsurance}','${(element.SupplementaryInsurance === true) ? 1 : 0}','${element.PrivateInsurancDescription}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO HealthInsuranceT (name_of_insured,name_of_health_insurance,supplementary_insurance,private_insurance_description,user_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into HealthInsuranceT: ${err}`);
                  } else {
                    console.error(`13`);
                  }
                });
              }

              insertStatement = "";
              obj.VariableExpenses.forEach((element, idx) => {
                console.log(`element - ${element}`);
                if (idx == 0)
                  insertStatement = `('${element.SubType}','${element.CategoryName}','${element.Type}','${element.CurrExpense}','${element.SatisfactionExpense}','${element.DefferenceExpense}','${(element.Anchor === true) ? 1 : 0}','${(element.Flexible === true) ? 1 : 0}','${(element.GoodToBe === true) ? 1 : 0}','${element.CategoryIndex}','${element.SubCategoryIndex}',${UserID})`;
                else
                  insertStatement += `,('${element.SubType}','${element.CategoryName}','${element.Type}','${element.CurrExpense}','${element.SatisfactionExpense}','${element.DefferenceExpense}','${(element.Anchor === true) ? 1 : 0}','${(element.Flexible === true) ? 1 : 0}','${(element.GoodToBe === true) ? 1 : 0}','${element.CategoryIndex}','${element.SubCategoryIndex}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO VariableExpensesT (type,category_name,sub_category_name,curr_expense,satisfaction_expense,defference_expense,anchor,flexible,good_to_be,category_index,subcategory_index,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into VariableExpensesT: ${err}`);
                  } else {
                    console.error(`15`);
                  }
                });
              }

              insertStatement = "";
              obj.OldPensionFund1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO OldPensionFundT (name_of_insurance, allowance_amount, widows_allowance, orphan_allowance, person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into OldPensionFundT: ${err}`);
                  } else {
                    console.error(`16`);
                  }
                });
              }

              insertStatement = "";
              obj.SocialSecurityBenefits1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.Amount}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.Amount}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO SocialSecurityBenefitsT (name_of_insurance,amount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into SocialSecurityBenefitsT: ${err}`);
                  } else {
                    console.error(`17`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeLongCareInsurancesInHealthFund.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.HomeAmount}','${element.SeudiAmount}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.HomeAmount}','${element.SeudiAmount}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInHealthT (name,home_amount,seudi_amount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into LifeLongCareInsurancesInHealthT: ${err}`);
                  } else {
                    console.error(`18`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeLongCareInsurancesInInsuranceCompany4Childrens.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.ChildName}','${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${UserID})`;
                else
                  insertStatement += `,('${element.ChildName}','${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompany4ChildrensT (child_name,name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,user_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into LifeLongCareInsurancesInInsuranceCompany4ChildrensT: ${err}`);
                  } else {
                    console.error(`19`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeLongCareInsurancesInInsurance1Company.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompanyT (name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into LifeLongCareInsurancesInInsuranceCompanyT: ${err}`);
                  } else {
                    console.error(`20`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeInsurance1.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner1ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner1ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO LifeInsuranceT (name,capital_amount,comment,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into LifeInsuranceT: ${err}`);
                  } else {
                    console.error(`21`);
                  }
                });
              }

              insertStatement = "";
              obj.FinanceLiquidityAssets.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO FinanceLiquidityAssetT (description,saving_location,current_amount,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into FinanceLiquidityAssetT: ${err}`);
                  } else {
                    console.error(`22`);
                  }
                });
              }

              insertStatement = "";
              obj.FinanceUnliquidityAssets.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
                else
                  insertStatement += `,('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO FinanceUnliquidityAssetT (description,saving_location,current_amount,comment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into FinanceUnliquidityAssetT: ${err}`);
                  } else {
                    console.error(`23`);
                  }
                });
              }
              insertStatement = "";
              console.log("RepetitiveGoals - " + JSON.stringify(obj.RepetitiveGoals));
              obj.RepetitiveGoals.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfGoal}','${element.EveryFewYears}','${element.Cost}',${UserID})`;
                else
                  insertStatement += `,('${element.NameOfGoal}','${element.EveryFewYears}','${element.Cost}',${UserID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO RepetitiveGoalsT (name_of_target,every_few_years,target_cost,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into RepetitiveGoalsT: ${err}`);
                  } else {
                    console.error(`24`);
                  }
                });
              }

              insertStatement = "";
              obj.IncomesGoal.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.IncomeSrc}','${element.AmountInYear}','${element.ReturnOnSavings}',${UserID})`;
                else
                  insertStatement += `,('${element.IncomeSrc}','${element.AmountInYear}','${element.ReturnOnSavings}',${UserID})`;
              });

              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO IncomesGoalT (income_source,incomes,return_on_savings,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into IncomesGoalT: ${err}`);
                  } else {
                    console.error(`25`);
                  }
                });
              }

              /*               "id"	INTEGER,
                            "one_off_family_goal"	TEXT,
                            "deposit_from_funds_one_off_family_goal"	TEXT,
                            "put_aside"	TEXT,
                            "savings_exist_for_children"	TEXT,
                            "cumulative_return_on_investment"	TEXT,
                            "user_id"	INTEGER,
               */

              insertStatement = "";
              obj.OneOffFamilyGoals.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.AmountInYear}','${element.DepositFromFundsOneOffFamilyGoalsRow}','${element.AdditionalDepositOneOffFamilyGoalsRow}','${element.PutAside}','${element.SavingsExistForChildren}','${element.CumulativeReturnOnInvestment}',${UserID})`;
                else
                  insertStatement += `,('${element.AmountInYear}','${element.DepositFromFundsOneOffFamilyGoalsRow}','${element.AdditionalDepositOneOffFamilyGoalsRow}','${element.PutAside}','${element.SavingsExistForChildren}','${element.CumulativeReturnOnInvestment}',${UserID})`;
              });

              if (insertStatement != "") {
                this.db.run(`INSERT OR IGNORE INTO OneOffFamilyGoalsT (one_off_family_goal,deposit_from_funds_one_off_family_goal,additional_deposit_one_off_family_goals_row,put_aside,savings_exist_for_children,cumulative_return_on_investment,user_id ) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data into OneOffFamilyGoalsT: ${err}`);
                  } else {
                    console.error(`26`);
                  }
                });
              }

              this.db.run(`INSERT OR IGNORE INTO EconomicalStabilityT (capital_labeled_for_this,in_how_many_years,user_id) VALUES ('${obj.EconomicalStability.CapitalTagged}','${obj.EconomicalStability.HowManyYears}',${UserID});`, (err) => {
                if (err) {
                  console.error(`Error inserting data into EconomicalStabilityT: ${err}`);
                } else {
                  console.error(`27`);
                }
              });

              this.db.run(`INSERT OR IGNORE INTO LossOfWorkingCapacityT (gross_for_pension,social_security,pension_fund,manager_insurance,private_insurance,person_id) VALUES ('${obj.LossOfWorkingCapacity.GrossForPension[0]}','${obj.LossOfWorkingCapacity.SocialSecurity[0]}','${obj.LossOfWorkingCapacity.PensionFund[0]}','${obj.LossOfWorkingCapacity.ManagerInsurance[0]}','${obj.LossOfWorkingCapacity.PrivateInsurance[0]}',${Partner1ID});`, (err) => {
                if (err) {
                  console.error(`Error inserting data into LossOfWorkingCapacityT: ${err}`);
                } else {
                  console.error(`27`);
                }
              });


              for (const child of obj.PersonalData.Child) {
                var ChildSexID = -1;

                console.log(child.SelectedSex);
                let resultPartner1SexID = this.GetSexID(child.SelectedSex).then((childSexID) => {
                  ChildSexID = childSexID;

                  console.log(ChildSexID + " " + Partner1ID + " " + child.Name + " " + child.Age);
                  this.db.run(`INSERT OR IGNORE INTO ChildT (name,age,sex_id,person_id ) VALUES ('${child.Name}','${child.Age}','${ChildSexID}',${Partner1ID});`, (err) => {
                    if (err) {
                      console.error(`Error inserting data into ChildT: ${err}`);
                    } else {

                    }
                  })
                });


              }

              this.db.run('commit'), (err) => {
                if (err) {
                  console.error(`Error commit: ${err}`);
                  this.db.close();
                  //console.log("this.db.close();");
                  resolve("Transaction cancelled.");
                } else {
                  this.db.run('commit');
                  console.error(`END`);
                  this.db.close();
                  //console.log("this.db.close();");
                  resolve("Save finish.");
                  //console.log(`Data inserted into PersonalDataT successfully.`);
                }
              };

            })
          })
        })
      })

    })
  };

  HandlePartner2(db, obj, userID) {
    var Partner2SexID = -1;
    var Partner2ID = -1;

    if (obj.PersonalData.SelectedStatus1 == "נשוי") {
      let resultPartner2SexID = this.GetSexID(obj.PersonalData.SelectedSex2).then((sexID) => {
        Partner2SexID = sexID;
        //console.log(obj.PersonalData.Name2);
        let resultPartner2ID = this.GetPersonIDAfterInsert(obj.PersonalData.Name2, obj.PersonalData.Age2, 0, 2, Partner2SexID, obj.PersonalData.RetirementAge2, false, userID).then((partner2ID) => {
          Partner2ID = partner2ID;
          db.run(`INSERT OR IGNORE INTO RelativeT (father_age,mother_age,father_can_help,mother_can_help,father_need_help,mother_need_help,father_inheritance_amount,mother_inheritance_amount,father_comment,mother_comment,person_id) VALUES (
              '${obj.Relative.FatherAge2}',
              '${obj.Relative.MotherAge2}',
              '${obj.Relative.FatherCanHelp2}',
              '${obj.Relative.MotherCanHelp2}',
              '${obj.Relative.FatherNeedHelp2}',
              '${obj.Relative.MotherNeedHelp2}',
              '${obj.Relative.FatherGetF2}',
              '${obj.Relative.MotherGetF2}',
              '${obj.Relative.CommentFather2}',
              '${obj.Relative.CommentMother2}',
              '${Partner2ID}');`, (err) => {
            //console.log("RelativeT2");
            //console.log(`Partner2ID - ${Partner1ID} , Partner2ID - ${Partner2ID}`);
            if (err) {
              console.error(`Error inserting data 2 into RelativeT:`);
            } else {

              let insertStatement = "";
              //HandlePartner2();
              obj.Income2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Type}','${element.FixedMonthly}','${element.MonthlyRevenue1}','${element.MonthlyRevenue2}','${element.MonthlyRevenue3}','${element.Comment}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.Type}','${element.FixedMonthly}','${element.MonthlyRevenue1}','${element.MonthlyRevenue2}','${element.MonthlyRevenue3}','${element.Comment}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO IncomesT (type,fixed_monthly,monthly_revenue_1,monthly_revenue_2,monthly_revenue_3,comment,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into IncomeT:${err}`);
                  } else {
                    console.error(`40`);
                  }
                });
              }

              insertStatement = "";
              obj.PensionFund2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO PensionFundT (name_of_insurance, current_capital_amount, monthly_deposit_amount, EndDate, widows_allowance, orphan_allowance, person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into PensionFundT: ${err}`);
                  } else {
                    console.error(`41`);
                  }
                });
              }

              insertStatement = "";
              obj.ManagerInsurance2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO ManagerInsuranceT (name_of_insurance, current_capital_amount, monthly_deposit_amount, lump_sum,allowance_factor,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into ManagerInsuranceT: ${err}`);
                  } else {
                    console.error(`42`);
                  }
                });
              }

              insertStatement = "";
              obj.OldPensionFund2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO OldPensionFundT (name_of_insurance, allowance_amount, widows_allowance, orphan_allowance, person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into OldPensionFundT: ${err}`);
                  } else {
                    console.error(`43`);
                  }
                });
              }

              insertStatement = "";
              obj.SocialSecurityBenefits2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.NameOfInsurance}','${element.Amount}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.NameOfInsurance}','${element.Amount}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO SocialSecurityBenefitsT (name_of_insurance,amount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into SocialSecurityBenefitsT: ${err}`);
                  } else {
                    console.error(`44`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeLongCareInsurancesInHealthFund.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.HomeAmount}','${element.SeudiAmount}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.HomeAmount}','${element.SeudiAmount}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInHealthT (name,home_amount,seudi_amount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into LifeLongCareInsurancesInHealthT: ${err}`);
                  } else {
                    console.error(`45`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeLongCareInsurancesInInsurance2Company.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompanyT (name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into LifeLongCareInsurancesInInsuranceCompanyT: ${err}`);
                  } else {
                    console.error(`46`);
                  }
                });
              }

              insertStatement = "";
              obj.LifeInsurance2.forEach((element, idx) => {
                if (idx == 0)
                  insertStatement = `('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner2ID})`;
                else
                  insertStatement += `,('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner2ID})`;
              });
              console.error(`${insertStatement};`);
              if (insertStatement != "") {
                db.run(`INSERT OR IGNORE INTO LifeInsuranceT (name,capital_amount,comment,person_id) VALUES ${insertStatement};`, (err) => {
                  if (err) {
                    console.error(`Error inserting data 2 into LifeInsuranceT: ${err}`);
                  } else {
                    console.error(`47`);
                  }
                });
              }

              this.db.run(`INSERT OR IGNORE INTO LossOfWorkingCapacityT (gross_for_pension,social_security,pension_fund,manager_insurance,private_insurance,person_id) VALUES ('${obj.LossOfWorkingCapacity.GrossForPension[1]}','${obj.LossOfWorkingCapacity.SocialSecurity[1]}','${obj.LossOfWorkingCapacity.PensionFund[1]}','${obj.LossOfWorkingCapacity.ManagerInsurance[1]}','${obj.LossOfWorkingCapacity.PrivateInsurance[1]}',${Partner2ID});`, (err) => {
                if (err) {
                  console.error(`Error inserting data 2 into LossOfWorkingCapacityT: ${err}`);
                } else {
                  console.error(`48`);
                }
              });

            }
          })
        })
      })
    }
  }
};
/*
 
 
;
 
 
 
 
 
 
obj.FinanceLiquidityAssets.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO FinanceLiquidityAssetT (description,saving_location,current_amount,comment,user_id ) VALUES ('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into FinanceLiquidityAssetT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.FinanceUnliquidityAssets.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO FinanceUnliquidityAssetT (description,saving_location,current_amount,comment,user_id ) VALUES ('${element.DescriptionSaving}','${element.WhereSaving}','${element.CurrentAmount}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into FinanceUnliquidityAssetT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
 
obj.VariableExpenses.forEach(element => {
  element.VariableExpensesRowObj.forEach(element2 => {
    this.db.run(`INSERT OR IGNORE INTO VariableExpensesT (type,category_name,sub_category_name,curr_expense,satisfaction_expense,defference_expense,anchor,flexible,good_to_be,user_id ) VALUES ('${element.SubType}','${element.CategoryName}','${element2.Type}','${element2.CurrExpense}','${element2.SatisfactionExpense}','${element2.DefferenceExpense}','${(element2.Anchor === true) ? 1 : 0}','${(element2.Flexible === true) ? 1 : 0}','${(element2.GoodToBe === true) ? 1 : 0}',${UserID});`, (err) => {
      if (err) {
        console.error(`Error inserting data into VariableExpensesT: ${err}`);
      } else {
        //console.log(`Data inserted into PersonalDataT successfully.`);
      }
    })
  })
});
 
obj.RealEstate.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO RealEstatesT (type,asset_value,nortgage_balance,comment,user_id ) VALUES ('${element.Description}','${element.AssetValue}','${element.NortgageBalance}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into RealEstatesT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.Vehicles.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO VehiclesT (description,year_of_production,vehicle_worth,comment,user_id ) VALUES ('${element.Description}','${element.YearOfProduction}','${element.VehicleWorth}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into VehiclesT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.Commitments.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO CommitmentsT (description,ExecutionDate,original_amount,curr_amount,monthly_payment,end_date,interest,comment,user_id ) VALUES ('${element.TheLender}','${element.ExecutionDate}','${element.OriginalAmount}','${element.CurrAmount}','${element.MonthlyPayment}','${element.EndDate}','${element.Interest}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into CommitmentsT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
 
for (const child of obj.PersonalData.Child) {
  var ChildSexID = -1;
 
  let resultPartner1SexID = await this.GetSexID(child.SelectedSex).then((childSexID) => {
    ChildSexID = childSexID;
  });
 
  this.db.run(`INSERT OR IGNORE INTO ChildT (name,age,sex_id,person_id ) VALUES ('${child.Name}','${child.Age}','${ChildSexID}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into ChildT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
}
 
obj.LifeInsurance1.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeInsuranceT (name,capital_amount,comment,person_id) VALUES ('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeInsuranceT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.LifeInsurance2.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeInsuranceT (name,capital_amount,comment,person_id) VALUES ('${element.Name}','${element.CapitalAmount}','${element.Comment}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeInsuranceT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.LifeLongCareInsurancesInHealthFund.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInHealthT (name,home_amount,seudi_amount,person_id) VALUES ('${element.Name}','${element.HomeAmount}','${element.SeudiAmount}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeLongCareInsurancesInHealthT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.ManagerInsurance1.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO ManagerInsuranceT (name_of_insurance, current_capital_amount, monthly_deposit_amount, lump_sum,allowance_factor,person_id) VALUES ('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into ManagerInsuranceT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
 
obj.PensionFund1.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO PensionFundT (name_of_insurance, current_capital_amount, monthly_deposit_amount, EndDate, widows_allowance, orphan_allowance, person_id) VALUES ('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into PensionFundT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.OldPensionFund1.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO OldPensionFundT (name_of_insurance, allowance_amount, widows_allowance, orphan_allowance, person_id) VALUES ('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into OldPensionFundT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.SocialSecurityBenefits1.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO SocialSecurityBenefitsT (name_of_insurance,amount,person_id) VALUES ('${element.NameOfInsurance}','${element.Amount}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into SocialSecurityBenefitsT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.ManagerInsurance2.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO ManagerInsuranceT (name_of_insurance, current_capital_amount, monthly_deposit_amount, lump_sum,allowance_factor,person_id) VALUES ('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.LumpSum}','${element.AllowanceFactor}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into ManagerInsuranceT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
 
obj.PensionFund2.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO PensionFundT (name_of_insurance, current_capital_amount, monthly_deposit_amount, EndDate, widows_allowance, orphan_allowance, person_id) VALUES ('${element.NameOfInsurance}','${element.CurrentCapitalAmount}','${element.MonthlyDepositAmount}','${element.EndDate}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into PensionFundT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.OldPensionFund2.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO OldPensionFundT (name_of_insurance, allowance_amount, widows_allowance, orphan_allowance, person_id) VALUES ('${element.NameOfInsurance}','${element.AllowanceAmount}','${element.WidowsAllowance}','${element.OrphanAllowance}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into OldPensionFundT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.SocialSecurityBenefits2.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO SocialSecurityBenefitsT (name_of_insurance,amount,person_id) VALUES ('${element.NameOfInsurance}','${element.Amount}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into SocialSecurityBenefitsT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.PensionJoint.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO PensionJointT (name_of_insurance, amount, comment,user_id ) VALUES ('${element.NameOfInsurance}','${element.Amount}','${element.Comment}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into PensionJointT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.LifeLongCareInsurancesInInsurance1Company.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompanyT (name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,person_id) VALUES ('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner1ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeLongCareInsurancesInInsuranceCompanyT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.LifeLongCareInsurancesInInsurance2Company.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompanyT (name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,comment,person_id) VALUES ('${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${Partner2ID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeLongCareInsurancesInInsuranceCompanyT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
obj.LifeLongCareInsurancesInInsuranceCompany4Childrens.forEach(element => {
  this.db.run(`INSERT OR IGNORE INTO LifeLongCareInsurancesInInsuranceCompany4ChildrensT (child_name,name, first_5_year_home_mount, over_6_year_home_mount, first_5_year_seudi_mount, over_6_year_seudi_mount,user_id) VALUES ('${element.ChildName}','${element.Name}','${element.First5YearHomeAmount}','${element.Over6YearHomeAmount}','${element.First5YearSeudiAmount}','${element.Over6YearSeudiAmount}',${UserID});`, (err) => {
    if (err) {
      console.error(`Error inserting data into LifeLongCareInsurancesInInsuranceCompany4ChildrensT: ${err}`);
    } else {
      //console.log(`Data inserted into PersonalDataT successfully.`);
    }
  })
});
 
 
this.ChildName = "";
this.Name = "";
this.First5YearHomeAmount = "";
this.Over6YearHomeAmount = "";
this.First5YearSeudiAmount = "";
this.Over6YearSeudiAmount = "";
*/
module.exports = DbHandler;
