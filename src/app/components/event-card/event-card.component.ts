import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Event } from 'src/app/models';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  constructor(private router: Router, private domSantizer: DomSanitizer) { }

  ngOnInit() {
  }

  public sanitizeImage(): any {
    return this.event.image ? this.domSantizer.bypassSecurityTrustResourceUrl(this.event.image) : 'assets/images/no-image.jpg';
  }

  public goToViewEvent(): void {
    this.router.navigate([`/event/${this.event._id}`]);
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }
}
