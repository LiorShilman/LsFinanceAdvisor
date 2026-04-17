BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "SexT" (
	"id"	INTEGER,
	"sex"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "StatusT" (
	"id"	INTEGER,
	"status"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "ChildT" (
	"id"	INTEGER,
	"name"	TEXT,
	"age"	INTEGER,
	"sex_id"	INTEGER,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE,
	FOREIGN KEY("sex_id") REFERENCES "SexT"("id")
);
CREATE TABLE IF NOT EXISTS "RelativeT" (
	"id"	INTEGER,
	"father_age"	TEXT,
	"mother_age"	TEXT,
	"father_can_help"	INTEGER,
	"mother_can_help"	INTEGER,
	"father_need_help"	INTEGER,
	"mother_need_help"	INTEGER,
	"father_inheritance_amount"	TEXT,
	"mother_inheritance_amount"	TEXT,
	"father_comment"	TEXT,
	"mother_comment"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "IncomesT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"fixed_monthly"	TEXT,
	"monthly_revenue_1"	TEXT,
	"monthly_revenue_2"	TEXT,
	"monthly_revenue_3"	TEXT,
	"comment"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "FinanceLiquidityAssetT" (
	"id"	INTEGER,
	"description"	TEXT,
	"saving_location"	INTEGER,
	"current_amount"	INTEGER,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "FinanceUnliquidityAssetT" (
	"id"	INTEGER,
	"description"	TEXT,
	"saving_location"	INTEGER,
	"current_amount"	INTEGER,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PersonT" (
	"id"	INTEGER,
	"first_name"	TEXT,
	"age"	INTEGER,
	"number_of_children"	INTEGER,
	"status_id"	INTEGER,
	"sex_id"	INTEGER,
	"retirement_age"	INTEGER,
	"is_primary"	INTEGER,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE, 
	FOREIGN KEY("status_id") REFERENCES "StatusT"("id"),
	FOREIGN KEY("sex_id") REFERENCES "SexT"("id")
);
CREATE TABLE IF NOT EXISTS "FinanceAdvisorT" (
	"id"	INTEGER,
	"saudi_insurance_in_home"	INTEGER,
	"saudi_insurance_in_mossad"	INTEGER,
	"annual_interest"	INTEGER,
	"unplaned"	REAL,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "IncomesExT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"monthly_avg"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "SavingT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"fixed_monthly"	TEXT,
	"current_amount"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "FixedExpensesT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"fixed_monthly"	TEXT,
	"monthly_expense_1"	TEXT,
	"monthly_expense_2"	TEXT,
	"monthly_expense_3"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "RealEstatesT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"asset_value"	TEXT,
	"nortgage_balance"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "VehiclesT" (
	"id"	INTEGER,
	"description"	TEXT,
	"year_of_production"	TEXT,
	"vehicle_worth"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "MortgagesT" (
	"id"	INTEGER,
	"name"	TEXT,
	"route"	TEXT,
	"original_amount"	TEXT,
	"curr_amount"	TEXT,
	"interest"	TEXT,
	"yearToEnd"	TEXT,
	"monthly_payment"	TEXT,
	"remaining_mortgage"	TEXT,
	"cost_of_financing"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "LifeInsuranceT" (
	"id"	INTEGER,
	"name"	TEXT,
	"capital_amount"	TEXT,
	"comment"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "LifeLongCareInsurancesInInsuranceCompanyT" (
	"id"	INTEGER,
	"name"	TEXT,
	"first_5_year_home_mount"	TEXT,
	"over_6_year_home_mount"	TEXT,
	"first_5_year_seudi_mount"	TEXT,
	"over_6_year_seudi_mount"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "LifeLongCareInsurancesInInsuranceCompany4ChildrensT" (
	"id"	INTEGER,
	"child_name"	TEXT,
	"name"	TEXT,
	"first_5_year_home_mount"	TEXT,
	"over_6_year_home_mount"	TEXT,
	"first_5_year_seudi_mount"	TEXT,
	"over_6_year_seudi_mount"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "LifeLongCareInsurancesInHealthT" (
	"id"	INTEGER,
	"name"	TEXT,
	"home_amount"	TEXT,
	"seudi_amount"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "CommitmentsT" (
	"id"	INTEGER,
	"description"	TEXT,
	"ExecutionDate"	TEXT,
	"original_amount"	TEXT,
	"curr_amount"	TEXT,
	"monthly_payment"	TEXT,
	"end_date"	TEXT,
	"interest"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "OldPensionFundT" (
	"id"	INTEGER,
	"name_of_insurance"	TEXT,
	"allowance_amount"	TEXT,
	"widows_allowance"	TEXT,
	"orphan_allowance"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PensionFundT" (
	"id"	INTEGER,
	"name_of_insurance"	TEXT,
	"current_capital_amount"	TEXT,
	"monthly_deposit_amount"	TEXT,
	"EndDate"	TEXT,
	"widows_allowance"	TEXT,
	"orphan_allowance"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "SocialSecurityBenefitsT" (
	"id"	INTEGER,
	"name_of_insurance"	TEXT,
	"amount"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "ManagerInsuranceT" (
	"id"	INTEGER,
	"name_of_insurance"	TEXT,
	"current_capital_amount"	TEXT,
	"monthly_deposit_amount"	TEXT,
	"lump_sum"	TEXT,
	"allowance_factor"	TEXT,
	"person_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("person_id") REFERENCES "PersonT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PensionJointT" (
	"id"	INTEGER,
	"name_of_insurance"	TEXT,
	"amount"	TEXT,
	"comment"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "HealthInsuranceT" (
	"id"	INTEGER,
	"name_of_insured"	TEXT,
	"name_of_health_insurance"	TEXT,
	"supplementary_insurance"	INTEGER,
	"private_insurance_description"	TEXT,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "VariableExpensesT" (
	"id"	INTEGER,
	"type"	INTEGER,
	"category_name"	TEXT,
	"sub_category_name"	TEXT,
	"curr_expense"	TEXT,
	"satisfaction_expense"	TEXT,
	"defference_expense"	TEXT,
	"anchor"	INTEGER,
	"flexible"	INTEGER,
	"good_to_be"	INTEGER,
	"category_index"	INTEGER,
	"subcategory_index"	INTEGER,
	"user_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "UserT"("id") ON DELETE CASCADE 
);
CREATE TABLE IF NOT EXISTS "UserT" (
	"id"	INTEGER,
	"mail"	TEXT UNIQUE,
	"identification"	TEXT UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "SexT" VALUES (1,'זכר');
INSERT INTO "SexT" VALUES (2,'נקבה');

INSERT INTO "StatusT" VALUES (1,'רווק');
INSERT INTO "StatusT" VALUES (2,'נשוי');
INSERT INTO "StatusT" VALUES (3,'גרוש');
INSERT INTO "StatusT" VALUES (4,'אלמן');

INSERT INTO "UserT" VALUES (1,'shilmanlior@gmail.com','031507726');

INSERT INTO "PersonT" VALUES (1,'ליאור',45,2,3,1,67,1,1);

INSERT INTO "ChildT" VALUES (1,'עמית',17,1,1);
INSERT INTO "ChildT" VALUES (2,'מעין',14,1,1);

INSERT INTO "RelativeT" VALUES (1,'',73,1,3,1,1,'','150,000','','חלק בדירה , בעוד הרבה שנים',1);

INSERT INTO "IncomesT" VALUES (1,'משכורת','24,000','','','','כולל כ - 50 שעות נוספות',1);

INSERT INTO "FinanceLiquidityAssetT" VALUES (1,'פסגות כספית פטורה','Fair','10,177','בלתי מתוכנן',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (2,'מגדל כספית','Fair','20,338','קרן ביטחון',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (3,'איילון כספית','Fair','20,340','קרן ביטחון',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (4,'קרן השתלמות','מיטב דש','140,300','דמי ניהול - 0.8%',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (5,'קופת גמל להשקעה','מיטב דש','52,000','דמי ניהול - 0.65%',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (6,'קופת גמל להשקעה','מור','10,000','דמי ניהול - 0.75%',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (7,'קרן ריט - אירופה','RealtyBoundle','12,800','מטבע EUR',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (8,'קרן ריט - שוודיה','RealtyBoundle','5,700','מטבע SEK',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (9,'Forex','Fxcm','2,420','מטבע USD',1);
INSERT INTO "FinanceLiquidityAssetT" VALUES (10,'עובר ושב','בנק אוצר החייל','20,000','מטבע ILS',1);
INSERT INTO "FinanceUnliquidityAssetT" VALUES (1,'קרן השתלמות','ילין לפידות','119,500','דמי ניהול - 0.8%',1);
INSERT INTO "FinanceUnliquidityAssetT" VALUES (2,'קרן השתלמות','מנורה','1,730','דמי ניהול - 0.9% , מסלול מניות',1);
INSERT INTO "FinanceUnliquidityAssetT" VALUES (3,'יחידות השתתפות','RealtyBoundle','5,000','989 מניות',1);
INSERT INTO "FinanceAdvisorT" VALUES (1,'8,000','15,000',3.74,5.0,1);
INSERT INTO "IncomesExT" VALUES (1,'הפרשות לפנסיה','6,105','פנסיה (מנורה) + ביטוח מנהלים (מגדל)',1);
INSERT INTO "IncomesExT" VALUES (2,'הפרשות לקרנות','2,413','קרן השתלמות - ילין לפידות',1);
INSERT INTO "IncomesExT" VALUES (3,'קרן דולרית','800','משיכה פעם בשנה של 5,000 דולר',1);
INSERT INTO "SavingT" VALUES (1,'הוצאות עתידיות','4,000','62,500','מיטב דש - מניות + סנופי',1);
INSERT INTO "SavingT" VALUES (2,'חסכון כללי','2,000','10,000','מור - כללי + מניות + סנופי',1);
INSERT INTO "FixedExpensesT" VALUES (1,'הוט','284','','','','טריפל + סיב אופטי 1000 גיגה',1);
INSERT INTO "FixedExpensesT" VALUES (2,'חיסכון ילדים','750','','','','משותף - 250 + עצמי - 500',1);
INSERT INTO "FixedExpensesT" VALUES (3,'דמי שכירות','3,600','','','','חוזה לאופציה לשנה נוספת - 31.07.25 ',1);
INSERT INTO "FixedExpensesT" VALUES (4,'מזונות','5,550','','','','2024 - 3,333 , 2027 - 2,750 , 2030 מסתיים',1);
INSERT INTO "FixedExpensesT" VALUES (5,'ועד בית','180','','','','',1);
INSERT INTO "FixedExpensesT" VALUES (6,'ארנונה','550','','','','',1);
INSERT INTO "FixedExpensesT" VALUES (7,'טלפון סללולרי','58','','','','שלי + חצי מתשלום על הילדים',1);
INSERT INTO "FixedExpensesT" VALUES (8,'הגנות כלליות','850','','','','תאונות אישית,ביטוח חיים,סעודי',1);
INSERT INTO "FixedExpensesT" VALUES (9,'תמי 4','107','','','','מסתיים ב - 2026',1);
INSERT INTO "VehiclesT" VALUES (1,'קיה פיקנטו','2015','37000','',1);
INSERT INTO "LifeInsuranceT" VALUES (1,'מנורה - 892','1415000','',1);
INSERT INTO "LifeLongCareInsurancesInInsuranceCompanyT" VALUES (1,'מנורה - 9004','13,500','13,500','13,500','13,500',1);
INSERT INTO "LifeLongCareInsurancesInInsuranceCompany4ChildrensT" VALUES (1,'עמית','הראל - 089','10,000','10,000','10,000','10,000',1);
INSERT INTO "LifeLongCareInsurancesInHealthT" VALUES (1,'מאוחדת','5,500','10,500',1);
INSERT INTO "PensionFundT" VALUES (1,'מנורה - 168','548,500','3,150','','9,000','6,000',1);
INSERT INTO "PensionFundT" VALUES (2,'כלל - פנסיה','35,522','','','','',1);
INSERT INTO "PensionFundT" VALUES (3,'כלל - פנסיה.מ','707','','','','',1);
INSERT INTO "HealthInsuranceT" VALUES (1,'ליאור','מכבי',1,'הראל + מנורה',1);
INSERT INTO "HealthInsuranceT" VALUES (2,'עמית','כללית',1,'הראל',1);
INSERT INTO "HealthInsuranceT" VALUES (3,'מעין','כללית',1,'הראל',1);
INSERT INTO "SocialSecurityBenefitsT" VALUES (1,'קצבת אלמן','',1);
INSERT INTO "SocialSecurityBenefitsT" VALUES (2,'קצבת ילדים','',1);
INSERT INTO "SocialSecurityBenefitsT" VALUES (3,'קצבת זקנה','2,520',1);
INSERT INTO "ManagerInsuranceT" VALUES (1,'מגדל - 366','496,500','2,700','495,000','192',1);
INSERT INTO "VariableExpensesT" VALUES (330,7,'חשבונות דיור','משכנתא/שכר דירה','','','0',0,0,0,1,1,1);
INSERT INTO "VariableExpensesT" VALUES (331,7,'חשבונות דיור','מים','120','120','0',0,0,0,1,3,1);
INSERT INTO "VariableExpensesT" VALUES (332,7,'חשבונות דיור','חשמל','750','750','0',0,0,0,1,4,1);
INSERT INTO "VariableExpensesT" VALUES (333,7,'חשבונות דיור','גז','','','0',0,0,0,1,5,1);
INSERT INTO "VariableExpensesT" VALUES (334,7,'חשבונות דיור','וועד בית','','','0',0,0,0,1,6,1);
INSERT INTO "VariableExpensesT" VALUES (335,5,'תקשורת','טלפון סלולרי','','','0',0,0,0,2,0,1);
INSERT INTO "VariableExpensesT" VALUES (336,5,'תקשורת','טלפון קווי','','','0',0,0,0,2,1,1);
INSERT INTO "VariableExpensesT" VALUES (337,5,'תקשורת','מוצרי חשמל ותקשורת','','','0',0,0,0,2,2,1);
INSERT INTO "VariableExpensesT" VALUES (338,5,'תקשורת','אינטרנט','','','0',0,0,0,2,3,1);
INSERT INTO "VariableExpensesT" VALUES (339,3,'אוכל','בילוי ומסעדות','500','300','200',0,0,0,0,2,1);
INSERT INTO "VariableExpensesT" VALUES (340,5,'לבית','דברים לבית (תמי 4)','','','0',0,0,0,3,0,1);
INSERT INTO "VariableExpensesT" VALUES (341,5,'לבית','החזקת הבית (כולל תיקונים)','','','0',0,0,0,3,1,1);
INSERT INTO "VariableExpensesT" VALUES (342,5,'לבית','נקיון','','','0',0,0,0,3,2,1);
INSERT INTO "VariableExpensesT" VALUES (343,5,'לבית','גינון','','','0',0,0,0,3,3,1);
INSERT INTO "VariableExpensesT" VALUES (344,5,'לבית','בעלי חיים','','','0',0,0,0,3,4,1);
INSERT INTO "VariableExpensesT" VALUES (345,7,'ילדים','שיעורים פרטיים','','','0',0,0,0,4,0,1);
INSERT INTO "VariableExpensesT" VALUES (346,7,'ילדים','גן  בית ספר וחמרי לימוד','300','300','0',0,0,0,4,1,1);
INSERT INTO "VariableExpensesT" VALUES (347,7,'ילדים','הסעות','','','0',0,0,0,4,2,1);
INSERT INTO "VariableExpensesT" VALUES (348,7,'ילדים','חוגים','','','0',0,0,0,4,3,1);
INSERT INTO "VariableExpensesT" VALUES (349,7,'ילדים','בייביסיטר','','','0',0,0,0,4,4,1);
INSERT INTO "VariableExpensesT" VALUES (350,5,'תקשורת','טלויזיה (ערוצים ונטפליקס)','','','0',0,0,0,2,4,1);
INSERT INTO "VariableExpensesT" VALUES (351,7,'ילדים','דמי כיס','300','300','0',0,0,0,4,6,1);
INSERT INTO "VariableExpensesT" VALUES (352,4,'טיפוח','ביגוד והנהלה','50','50','0',0,0,0,5,0,1);
INSERT INTO "VariableExpensesT" VALUES (353,4,'טיפוח','קוסמטיקה','','','0',0,0,0,5,1,1);
INSERT INTO "VariableExpensesT" VALUES (354,4,'טיפוח','מספרה','40','40','0',0,0,0,5,2,1);
INSERT INTO "VariableExpensesT" VALUES (355,4,'טיפוח','מוצרי פארם','','','0',0,0,0,5,3,1);
INSERT INTO "VariableExpensesT" VALUES (356,7,'רכבים ונסיעות','דלק','250','250','0',0,0,0,6,0,1);
INSERT INTO "VariableExpensesT" VALUES (357,7,'רכבים ונסיעות','ביטוחי רכב (מקיף + חובה)','','','0',0,0,0,6,1,1);
INSERT INTO "VariableExpensesT" VALUES (358,7,'רכבים ונסיעות','רישיון רכב וטסט','','','0',0,0,0,6,2,1);
INSERT INTO "VariableExpensesT" VALUES (359,7,'רכבים ונסיעות','תיקוני רכבים וטיפולים שוטפים','50','50','0',0,0,0,6,3,1);
INSERT INTO "VariableExpensesT" VALUES (360,7,'רכבים ונסיעות','קנסות','','','0',0,0,0,6,4,1);
INSERT INTO "VariableExpensesT" VALUES (361,7,'רכבים ונסיעות','חניה','10','10','0',0,0,0,6,5,1);
INSERT INTO "VariableExpensesT" VALUES (362,7,'רכבים ונסיעות','איטוראן - כביש 6','','','0',0,0,0,6,6,1);
INSERT INTO "VariableExpensesT" VALUES (363,10,'פנאי','בריכה ומכון כושר','','','0',0,0,0,7,0,1);
INSERT INTO "VariableExpensesT" VALUES (364,10,'פנאי','עיתונים ומנויים','105','90','15',0,0,0,7,1,1);
INSERT INTO "VariableExpensesT" VALUES (365,10,'פנאי','מתנות (משפחה,אירועים)','100','100','0',0,0,0,7,2,1);
INSERT INTO "VariableExpensesT" VALUES (366,10,'פנאי','חוגים ותחביבים להורים','','','0',0,0,0,7,3,1);
INSERT INTO "VariableExpensesT" VALUES (367,10,'פנאי','ספרים','','','0',0,0,0,7,4,1);
INSERT INTO "VariableExpensesT" VALUES (368,10,'פנאי','תרבות ופנאי','','','0',0,0,0,7,5,1);
INSERT INTO "VariableExpensesT" VALUES (369,10,'פנאי','קפה','','','0',0,0,0,7,6,1);
INSERT INTO "VariableExpensesT" VALUES (370,10,'פנאי','ציוד טיפוס ואימון','','','0',0,0,0,7,7,1);
INSERT INTO "VariableExpensesT" VALUES (371,10,'פנאי','טיסות וחופשות','','','0',0,0,0,7,8,1);
INSERT INTO "VariableExpensesT" VALUES (372,6,'שונות','הוצאות ריפוי , וטיפולים','','','0',0,0,0,8,0,1);
INSERT INTO "VariableExpensesT" VALUES (373,6,'שונות','תרופות','','','0',0,0,0,8,1,1);
INSERT INTO "VariableExpensesT" VALUES (374,6,'שונות','שיפוצים לבית','','','0',0,0,0,8,2,1);
INSERT INTO "VariableExpensesT" VALUES (375,6,'שונות','שונות','1,200','1,200','0',0,0,0,8,3,1);
INSERT INTO "VariableExpensesT" VALUES (376,7,'ילדים','ביגוד והנהלה - ילדים','','','0',0,0,0,4,5,1);
INSERT INTO "VariableExpensesT" VALUES (377,6,'שונות','מזומן ללא מעקב','200','200','0',0,0,0,8,5,1);
INSERT INTO "VariableExpensesT" VALUES (378,1,'מזונות','ילדים + דירה','','','0',0,0,0,9,0,1);
INSERT INTO "VariableExpensesT" VALUES (379,7,'חשבונות דיור','מיסי ישוב (שמירה)','','','0',0,0,0,1,0,1);
INSERT INTO "VariableExpensesT" VALUES (380,7,'חשבונות דיור','ארנונה','','','0',0,0,0,1,2,1);
INSERT INTO "VariableExpensesT" VALUES (381,3,'אוכל','מזון ומכולת','2,000','1,800','200',0,0,0,0,0,1);
INSERT INTO "VariableExpensesT" VALUES (382,10,'פנאי','תרבות ופנאי','','','0',0,0,0,7,5,1);
INSERT INTO "VariableExpensesT" VALUES (383,6,'שונות','עמלות בנק וכ.אשראי','','','0',0,0,0,8,4,1);
INSERT INTO "VariableExpensesT" VALUES (384,3,'אוכל','הזמנת אוכל הביתה','200','250','-50',0,0,0,0,1,1);
INSERT INTO "CommitmentsT" 		VALUES (1,'הלוואה - 1','','','5000','300','','חוב - 1',1);
INSERT INTO "CommitmentsT" 		VALUES (2,'הלוואה - 2','','','20000','700','','חוב - 2',1);
INSERT INTO "CommitmentsT" 		VALUES (3,'הלוואה - 3','','','10000','300','','חוב - 3',1);
INSERT INTO "CommitmentsT" 		VALUES (4,'הלוואה - 4','','','8000','450','','חוב - 4',1);
COMMIT;
