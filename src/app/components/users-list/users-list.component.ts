import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { UserRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';

declare var bootstrap: any;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  // משתנים עבור pagination
  totalRecords: number = 0;
  startIndex: number = 1;
  endIndex: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // משתנים עבור mobile details
  showMobileDetails: boolean = false;
  selectedMobileUser: number = -1;
  
  // משתנים עבור loading states
  isLoading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, public generalInfoService: GeneralInfoService) {

  }

  ngOnInit(): void {

    

    this.route.queryParams.subscribe(params => {
      const fromGoogle = params['fromGoogle'];
      const userName = params['userName'];
      const email = params['email'];
      
      if (fromGoogle === 'true') {
        console.log(`ברוך הבא ${userName}! התחברת עם Google`);
      // הצג הודעת ברוכים הבאים
        
      // חפש את המשתמש ברשימה הקיימת
        const existingUser = this.findUserByEmail(email);

        if (existingUser) {
          this.EditUser(existingUser.UserID, existingUser.Mail, existingUser.Identification);
        }
      }
      else
      {

        // Bootstrap tooltip initialization
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        });

        // חישוב נתונים לpagination
        this.calculatePaginationData();
      }
    });
  }

  // פונקציה לחיפוש משתמש לפי מייל
private findUserByEmail(email: string): UserRowObj | null {
  if (!this.generalInfoService.AllInfo?.UserListInfo?.UsersRows) {
    return null;
  }
  
  return this.generalInfoService.AllInfo.UserListInfo.UsersRows.find(
    user => user.Mail.toLowerCase() === email.toLowerCase()
  ) || null;
}



  /**
   * חישוב נתונים עבור pagination
   */
  calculatePaginationData(): void {
    if (this.generalInfoService.AllInfo?.UserListInfo?.UsersRows) {
      this.totalRecords = this.generalInfoService.AllInfo.UserListInfo.UsersRows.length;
      this.startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
      this.endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalRecords);
    } else {
      this.totalRecords = 0;
      this.startIndex = 0;
      this.endIndex = 0;
    }
  }

  /**
   * הצגה/הסתרה של פרטים נוספים במובייל
   */
  toggleMobileDetails(userIndex: number): void {
    if (this.selectedMobileUser === userIndex) {
      this.showMobileDetails = false;
      this.selectedMobileUser = -1;
    } else {
      this.showMobileDetails = true;
      this.selectedMobileUser = userIndex;
    }
  }

  /**
   * הצגת loading state
   */
  showLoading(): void {
    this.isLoading = true;
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('d-none');
    }
  }

  /**
   * הסתרת loading state
   */
  hideLoading(): void {
    this.isLoading = false;
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('d-none');
    }
  }

  /**
   * בדיקה האם יש נתונים להצגה
   */
  get hasData(): boolean {
    return this.generalInfoService.AllInfo?.UserListInfo?.UsersRows?.length > 0;
  }

  /**
   * קבלת רשימת המשתמשים הנוכחית
   */
  get currentUsers(): any[] {
    if (!this.generalInfoService.AllInfo?.UserListInfo?.UsersRows) {
      return [];
    }
    
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.generalInfoService.AllInfo.UserListInfo.UsersRows.slice(start, end);
  }

  /**
   * מעבר לעמוד הבא
   */
  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalRecords) {
      this.currentPage++;
      this.calculatePaginationData();
    }
  }

  /**
   * מעבר לעמוד הקודם
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePaginationData();
    }
  }

  /**
   * מעבר לעמוד ספציפי
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.calculatePaginationData();
    }
  }

  /**
   * קבלת מספר העמודים הכולל
   */
  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }

  /**
   * קבלת מערך מספרי העמודים להצגה
   */
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisible = 5;
    const pages: number[] = [];
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  EditUser(userID: number, mail: string, identification: string) {
    //console.log(`Edit UserID - ${userID}`);
    this.showLoading();

    this.generalInfoService.LoadUserInfoByUserID(userID, mail, identification).then(res => {
      this.hideLoading();
      this.router.navigate(['/PersonalData']);
    }).catch(error => {
      this.hideLoading();
      console.error('Error loading user data:', error);
    });
  }

  RefreshPage() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        window.location.reload();
      });
  }

  DeleteUser(userID: number) {
    //console.log(`Delete UserID - ${userID}`);
    
    // הצגת הודעת אישור
    const confirmed = confirm('האם אתה בטוח שברצונך למחוק את המשתמש?');
    
    if (confirmed) {
      this.showLoading();
      
      // TODO: הסר את ההערה כשהשירות יהיה מוכן
      /*
      this.generalInfoService.DeleteByUserID(userID).then(res => {
        this.generalInfoService.LoadAllUsersDB().then(res => {
          this.hideLoading();
          this.calculatePaginationData();
          console.log("User deleted successfully");
        }).catch(error => {
          this.hideLoading();
          console.error('Error reloading users:', error);
        });
      }).catch(error => {
        this.hideLoading();
        console.error('Error deleting user:', error);
      });
      */
      
      // הסימולציה זמנית
      setTimeout(() => {
        this.hideLoading();
        console.log('Delete operation completed');
      }, 1000);
    }
  }

  /**
   * הוספת משתמש חדש
   */
  addNewUser(): void {
    this.router.navigate(['/AddUser']); // התאם את הנתיב לפי הצורך
  }

  /**
   * חיפוש משתמשים
   */
  searchUsers(searchTerm: string): void {
    // TODO: מימוש חיפוש
    console.log('Searching for:', searchTerm);
  }

  /**
   * סינון משתמשים
   */
  filterUsers(filterType: string): void {
    // TODO: מימוש סינון
    console.log('Filtering by:', filterType);
  }

  /**
   * ייצוא נתונים
   */
  exportData(format: 'excel' | 'pdf' | 'csv'): void {
    // TODO: מימוש ייצוא
    console.log('Exporting data as:', format);
  }
}