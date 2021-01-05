import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/models';
import { DataService, SentMessagesService } from 'src/app/services';

@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.page.html',
  styleUrls: ['./sent-messages.page.scss'],
})
export class SentMessagesPage implements OnInit, OnDestroy {
  public sentMessages: Event[] = [];
  private subscription: Subscription;

  constructor(private sentMessagesService: SentMessagesService) { }

  public ngOnInit(): void {
    this.sentMessagesService.fetchSentMessages();
    this.subscribeToSentMessagesMessages();
  }

  public goToInbox(): void {
    console.log('INBOX')
  }
  
  public getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToSentMessagesMessages(): void {
    this.subscription = this.sentMessagesService.getSentMessages().subscribe(sentMessages => {
      this.sentMessages = sentMessages;
    })
  }
}
