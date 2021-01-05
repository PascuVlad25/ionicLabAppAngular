import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, AnimationController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/models';
import { DataService } from 'src/app/services';
import { CreateEventPage } from '../create-event/create-event.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public events: Event[];
  public isFilterOn = false;
  private searchedText = '';
  private subscription: Subscription;
  private pageSize = 10;
  private currentPage = 1;

  constructor(private dataService: DataService,
    public alertController: AlertController, private modalController: ModalController, private animationController: AnimationController) { }

  public ngOnInit(): void {
    this.dataService.fetchItems(this.pageSize, this.currentPage);
    this.subscribeToEvents();
    this.animatePage();
  }

  public search(event: any): void {
    this.searchedText = event.detail.value.toLowerCase();
    this.currentPage = 1;
    this.dataService.fetchItems(this.pageSize, this.currentPage, this.searchedText, this.isFilterOn);
  }

  public switchFilter(): void {
    this.isFilterOn = !this.isFilterOn;
    this.dataService.fetchItems(this.pageSize, this.currentPage, this.searchedText, this.isFilterOn);
  }

  public loadData(event: any): void {
    if(this.currentPage >= this.dataService.noOfPages) {
      event.target.complete();
      return;
    }
    this.currentPage += 1;
    this.dataService.fetchItems(this.pageSize, this.currentPage, this.searchedText, this.isFilterOn);
    event.target.complete();
  }

  public refresh(event: any): void {
    this.dataService.fetchItems(this.pageSize, this.currentPage, this.searchedText, this.isFilterOn);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public async presentModal() {
    const modal = await this.modalController.create({
      component: CreateEventPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  public createEvent(): void {
    // this.router.navigate(['/create-event']);
    this.presentModal();
    
  }

  public filterEvents(): Event[] {
    return this.events.filter((event) => !(this.isFilterOn && event.read));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToEvents(): void {
    this.subscription = this.dataService.getItems().subscribe(events => {
      this.events = events;
    })
  }

  private async animatePage(): Promise<void> {
    const title = this.animationController.create()
      .addElement(document.querySelector('.page-title'))
      .easing("ease-in-out")
      .duration(2000)
      .keyframes([
        { offset: 0, marginLeft: '0px' },
        { offset: 0.5, marginLeft: '15px' },
        { offset: 1, marginLeft: '0px' }
      ]);
      
      const filterButton = this.animationController.create()
      .addElement(document.querySelector('.filter-button'))
      .easing("ease-in-out")
      .duration(2000)
      .keyframes([
        { offset: 0, transform: 'rotate(0deg) scale(1)' },
        { offset: 0.5, transform: 'rotate(180deg) scale(1.3)' },
        { offset: 1, transform: 'rotate(360deg) scale(1)'},
      ]);

    await title.play();
    await filterButton.play();
  }
}
