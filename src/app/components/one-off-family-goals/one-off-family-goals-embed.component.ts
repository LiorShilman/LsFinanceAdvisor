import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { GeneralInfoService } from 'src/app/services/general-info.service';

@Component({
  selector: 'app-one-off-family-goals-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './one-off-family-goals-embed.component.html',
  styleUrls: ['./one-off-family-goals-embed.component.scss']
})
export class OneOffFamilyGoalsEmbedComponent  implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/one-off-family-goals//LsFinanceAdvisor/assets/one-off-family-goals/GoalsFinancialCalculator/GoalsFinancialCalculator.html';
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
      if (event.data?.type === 'resize-one-off-family-goals-race') {
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
