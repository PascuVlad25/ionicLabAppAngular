import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit, OnDestroy {
  public message: Message;
  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription = this.dataService.getMessageById(parseInt(id, 10)).subscribe(message => {
      this.message = message;
      if(!message.read) {
        this.message.read = true;
        this.markMessageAsRead(this.message);
      }
    })
  }

  public getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private markMessageAsRead(message: Message): void {
    this.dataService.updateItem(message);
  }
}
