import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculate-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculate-embed.component.html',
  styleUrls: ['./calculate-embed.component.scss']
})
export class CalculateEmbedComponent implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/incomes/israel_salary_calculator_2025.html';
  safeSrc!: SafeResourceUrl;

  @ViewChild('frame', { static: false }) frame!: ElementRef<HTMLIFrameElement>;
  private listener: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcPath);

    this.listener = (event: MessageEvent) => {
      if (event.data?.type === 'resize-calculate') {
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
