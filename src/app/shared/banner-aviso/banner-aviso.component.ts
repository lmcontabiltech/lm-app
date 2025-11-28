import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type BannerItem = {
  type?: 'text' | 'image' | 'html';
  content: string;
  alt?: string;
};

@Component({
  selector: 'app-banner-aviso',
  templateUrl: './banner-aviso.component.html',
  styleUrls: ['./banner-aviso.component.css'],
})
export class BannerAvisoComponent implements OnInit, OnDestroy {
  @Input() items: BannerItem[] = [];
  @Input() autoplay = true;
  @Input() interval = 4000;
  @Input() showControls = true;
  @Input() showIndicators = true;
  @Input() loop = true;

  currentIndex = 0;
  private timer: any = null;
  sanitizedHtml: SafeHtml[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.prepareSanitized();
    if (this.autoplay && this.items && this.items.length > 1) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  private prepareSanitized(): void {
    this.sanitizedHtml = (this.items || []).map((i) =>
      i.type === 'html'
        ? this.sanitizer.bypassSecurityTrustHtml(i.content)
        : ('' as any)
    );
  }

  startAutoplay(): void {
    this.stopAutoplay();
    if (!this.autoplay || !this.items || this.items.length <= 1) return;
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopAutoplay(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  next(): void {
    if (!this.items || !this.items.length) return;
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    }
  }

  prev(): void {
    if (!this.items || !this.items.length) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.items.length - 1;
    }
  }

  goTo(index: number): void {
    if (index >= 0 && index < (this.items || []).length) {
      this.currentIndex = index;
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.stopAutoplay();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.autoplay) this.startAutoplay();
  }
}
