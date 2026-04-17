import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form161d-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form161d-embed.component.html',
  styleUrls: ['./form161d-embed.component.scss']
})
export class Form161dEmbedComponent implements OnInit, OnDestroy {
  @Input() srcPath: string = '/LsFinanceAdvisor/assets/161d/pension_form_161d_professional.html';
  safeSrc!: SafeResourceUrl;

  @ViewChild('frame', { static: false }) frame!: ElementRef<HTMLIFrameElement>;
  private listener: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcPath);

    this.listener = (event: MessageEvent) => {
      if (event.data?.type === 'resize-161d') {
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
