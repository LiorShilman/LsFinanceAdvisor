import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fixed-expenses-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixed-expenses-embed.component.html',
  styleUrls: ['./fixed-expenses-embed.component.scss']
})
export class FixedExpensesEmbedComponent implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/fixed-expenses/habit_cost_premium.html';
  safeSrc!: SafeResourceUrl;

  @ViewChild('frame', { static: false }) frame!: ElementRef<HTMLIFrameElement>;
  private listener: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcPath);

    this.listener = (event: MessageEvent) => {
      if (event.data?.type === 'resize-fixed-expenses') {
        const newHeight = event.data.height;
        if (this.frame?.nativeElement) {
          this.frame.nativeElement.style.height = newHeight + 'px';
        }
      }
    };
    window.addEventListener('message', this.listener);
  }

  ngOnDestroy(): void {
    if (this.listener) {
      window.removeEventListener('message', this.listener);
    }
  }
}
