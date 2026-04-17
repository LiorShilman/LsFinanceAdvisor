import { Component, Inject, OnDestroy, OnInit ,NgZone} from '@angular/core';
import { GeneralInfoService } from './services/general-info.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AllInfoObj, UserRowObj } from './services/GeneralTypes/GeneralTypes';
import { DOCUMENT } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { ElectronService } from './services/core/services/electron/electron.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  [x: string]: any;
  browserRefresh:boolean;
  afterLoadAllUsers:boolean;
  subscription: Subscription;
  title = 'ls-financial-advisor';
  message: any;
  elem: any;
  isAndroidDevice: boolean;

  currentYear = new Date().getFullYear();
appVersion = environment.appVersion;


  constructor(@Inject(DOCUMENT) private document: any, public router: Router, public generalInfoService: GeneralInfoService,public electronService: ElectronService,private ngZone: NgZone) {
    //this.generalInfoService.Fill4Test();
    this.browserRefresh = false;
    this.afterLoadAllUsers = false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.isAndroidDevice = userAgent.includes('android');
    

    //console.log("constructor - " + this.browserRefresh);

    console.log("electronService.isElectron" + this.electronService.isElectron);
    if (this.electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
      console.log('on user-list');

      this.electronService.subUserListObservable$.subscribe((data) => {
        this.ngZone.run(() => {
          this.LoadAllUsersDB();
        });
      });

      this.electronService.ipcRenderer.send('update-win');

    } else {
      console.log('Run in browser');
    }

    this.subscription = this.router.events.subscribe(event => {
      //console.log("event - " + this.browserRefresh);
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page when navigation is complete
        //console.log("NavigationEnd");
        
        if (event.url == '/CalculatedData')
        {
            this

        }
        this.generalInfoService.DoReportEnglish();
        window.scrollTo(0, 0);
        
      }
       else if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
        //console.log(`url = ${this.router.url} , browserRefresh = ${this.browserRefresh}, afterLoadAllUsers = ${this.afterLoadAllUsers}`);
        if (this.browserRefresh && !this.afterLoadAllUsers)
        {
          this.afterLoadAllUsers = true;
          
          this.LoadAllUsersDB();
          //console.log(`${this.browserRefresh} - ${Date.now}`);
        }
        else
        {
          this.afterLoadAllUsers = false;
          //console.log(this.browserRefresh);
        }
      } 
    });

  }
  ngOnInit(): void {
    this.elem = document.documentElement;
    //if (this.isAndroidDevice) {
    //this.OpenFullscreen();
    //}
    this.generalInfoService.subUpdateAllInfoObservable$.subscribe((data) => {
    })

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        console.log('NAV→', e.url, 'REDIR→', e.urlAfterRedirects);
      });

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    console.log(`Screen Resolution: ${screenWidth}x${screenHeight}`);

    /*     this.apiService.getMessage().subscribe(data => {
          this.message = data;
        });
     */

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  OpenFullscreen() {
    if (this.elem.requestFullscreen) {
      //console.log("this.elem.requestFullscreen");
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      //console.log("this.elem.mozRequestFullScreen");
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      //console.log("this.elem.webkitRequestFullscreen");
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      //console.log("this.elem.msRequestFullscreen");
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  CloseFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  LoadAllUsersDB() {
    this.generalInfoService.AllInfo.UserListInfo.UsersRows = [];
    console.log("LoadAllUsersDB");
    this.generalInfoService.AllInfo = new AllInfoObj(this.generalInfoService);
    this.generalInfoService.AfterLogin = false;
    this.generalInfoService.WithoutSidebar = true;
    this.generalInfoService.LoadAllUsersDB().then((result: any) => {
      let financeAdvisor = JSON.parse(result.toString());
      //console.log(result);
      financeAdvisor.Users.forEach((user: any) => {
        //console.log(user);
        const newUser = new UserRowObj();
        newUser.UserID = user.UserID;
        newUser.FirstName = user.FirstName;
        newUser.Mail = user.Mail;
        newUser.Identification = user.ID;
        //console.log(newUser);
        this.generalInfoService.AllInfo.UserListInfo.UsersRows.push(newUser);
        //console.log(this.generalInfoService.AllInfo.UserListInfo.UsersRows);
      });
    });
    //this.router.navigate(['/UsersList']);
  }

  Save2DB() {
    this.generalInfoService.Save2DB().then((result: any) => {
      //console.log("result - " + result);
      this.LoadAllUsersDB();
    });
  }

  Profile() {
    //this.generalInfoService.AllInfo = new AllInfoObj(this.generalInfoService);
    //this.generalInfoService.AfterLogin = false;
    this.generalInfoService.WithoutSidebar = true;
    this.router.navigate(['/Profile']);
  }

  // פותח תת־תפריט אם ה־URL הנוכחי מתחיל באחד מהנתיבים שהוגדרו
isInSection(paths: string[]): boolean {
  return paths.some(p => this.router.url.startsWith(p));
}


  NewProject() {
    this.generalInfoService.AllInfo = new AllInfoObj(this.generalInfoService);
    this.generalInfoService.AfterLogin = true;
    this.generalInfoService.WithoutSidebar = false;
    this.router.navigate(['/PersonalData']);
  }
  /* 
    RemoveElementsWithTypeCondition(json: string) {
      let jsonArray = JSON.parse(json);
      jsonArray = jsonArray.filter((item: any) => item.Type !== "");
      let jsonStringResult = JSON.stringify(jsonArray);
      return jsonStringResult;
    }
  
    RemoveElementsWithDescriptionCondition(json: string) {
      let jsonArray = JSON.parse(json);
      jsonArray = jsonArray.filter((item: any) => item.Description !== "");
      let jsonStringResult = JSON.stringify(jsonArray);
      return jsonStringResult;
    } */




}

