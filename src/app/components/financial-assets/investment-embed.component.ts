import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investment-embed.component.html',
  styleUrls: ['./investment-embed.component.scss']
})
export class InvestmentEmbedComponent implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/investment/fixed_investment_guide.html';
  safeSrc!: SafeResourceUrl;

  @ViewChild('frame', { static: false }) frame!: ElementRef<HTMLIFrameElement>;
  private listener: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcPath);

    this.listener = (event: MessageEvent) => {
      if (event.data?.type === 'resize-investment') {
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
