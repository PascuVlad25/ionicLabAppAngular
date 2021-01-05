import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng } from '@ionic-native/google-maps';
import { AnimationController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/models';
import { DataService, SentMessagesService } from 'src/app/services';
import { CreateEventPage } from '../create-event/create-event.page';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit, OnDestroy {
  public event: Event;
  public isSentMessage = false;
  private subscription: Subscription;
  private eventId: number;
  private map: GoogleMap;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private modalController: ModalController,
    private animationController: AnimationController
  ) { }

  public ngOnInit() {
    this.eventId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);

    this.subscribeToCurrentEvent();
    
    this.loadMap();
  }

  public getBackButtonText() {
    if(this.isSentMessage) {
      return 'Sent Messages';
    }
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Explore' : '';
  }

  public sanitizeImage(): any {
    return this.event.image ? this.domSanitizer.bypassSecurityTrustResourceUrl(this.event.image) : 'assets/images/no-image.jpg';
  }

  public async presentModal() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationController.create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationController.create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ]);

      return this.animationController.create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    }

    const modal = await this.modalController.create({
      component: CreateEventPage,
      enterAnimation,
      leaveAnimation,
      componentProps: { 'event': {...this.event} }
    });
    return await modal.present();
  }

  public editEvent(): void {
    this.presentModal();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.map) {
      this.map.destroy();
    }
  }

  private subscribeToCurrentEvent(): void {
    this.subscription = this.dataService.getMessageById(this.eventId).subscribe(event => {
      this.event = event;
    })
  }

  private loadMap(): void {
    if(this.event.coordinates) {
      try {
        this.map = GoogleMaps.create('map');

        this.map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => {
          const coordinates: LatLng = new LatLng(this.event.coordinates[0], this.event.coordinates[1]);
  
          this.map.setCameraTarget(coordinates);
          this.map.setCameraZoom(15);
        });
        this.map.addMarkerSync({
          position: {lat: this.event.coordinates[0], lng: this.event.coordinates[1]}
        });
      } catch(error) {
        console.log('The map cant load');
      }
    }

  }
}
