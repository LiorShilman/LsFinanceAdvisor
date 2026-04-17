import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GeneralInfoService } from 'src/app/services/general-info.service';

@Component({
  selector: 'app-retirement-race-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retirement-race-embed.component.html',
  styleUrls: ['./retirement-race-embed.component.scss']
})
export class RetirementRaceEmbedComponent implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/retirement-race/retirement_race_pro.html';
  @Input() config: any = {
    ageNow: this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1,
    ageRetire: this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1,
    salary: 30522,
    balanceNow: this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].CurrentCapitalAmounts + 
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CurrentCapitalAmounts +
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[0].CurrentCapitalAmounts,
    swrPct: 3.5
  };
  safeSrc!: SafeResourceUrl;

  @ViewChild('frame', { static: false }) frame!: ElementRef<HTMLIFrameElement>;
  private listener: any;
  private targetOrigin = '*'; // עדכן למקור המדויק אם ידוע (מומלץ אבטחתית)

  constructor(private sanitizer: DomSanitizer,public generalInfoService: GeneralInfoService) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcPath);

    this.listener = (event: MessageEvent) => {
      // 1) ריסייז קיים אצלך כבר:
      if (event.data?.type === 'resize-retirement-race') {
        const newHeight = event.data.height;
        if (this.frame?.nativeElement) {
          this.frame.nativeElement.style.height = newHeight + 'px';
        }
        return;
      }

      // 2) הודעת מוכנות מהילד → ואז שולחים קונפיג
      if (event.data?.type === 'child-ready') {
        this.postToChild({ type: 'INIT_CONFIG', payload: this.config });
        return;
      }

      // 3) תוצאות/אירועים מהסימולטור
      if (event.data?.type === 'sim-result') {
        const result = event.data.payload;
        console.log('Simulation result from child:', result);
        // כאן תעדכן state / שירות / NgRx וכו'
        return;
      }
    };

    
    window.addEventListener('message', this.listener);
  }

  private postToChild(message: any) {
    const win = this.frame?.nativeElement?.contentWindow;
    if (!win) return;
    // עדיף לא '*' — אם ה־HTML נטען מכתובת https חוקית, חלץ ממנה origin והשתמש בו:
    // this.targetOrigin = new URL(this.srcPath, window.location.origin).origin;
    win.postMessage(message, this.targetOrigin);
  }

  onFrameLoad() {
    // אופציונלי: שלח Ping כדי לוודא חיבור גם בלי child-ready
    this.postToChild({ type: 'PING' });
  }


  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener('message', this.listener);
    }
  }
}
