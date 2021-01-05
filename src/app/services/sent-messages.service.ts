import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventPaginationDto } from '../models';
import { ConnectivityService } from './connectivity.service';
import { HttpService } from './http.service';

@Injectable()
export class SentMessagesService implements OnDestroy {

  public sentMessages: Event[] = [];
  private sentMessages$: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private entityUrl = 'item';
  private subscription: Subscription;
  private isOnline = true;

  constructor(private httpService: HttpService, private connectivityService: ConnectivityService) {
    this.subscribeToConnectivity();
  }

  public fetchSentMessages(): void {
    if(!this.isOnline) {
        return;
    }
    const getUrl = `${this.entityUrl}?sent=true`;
    this.httpService.get<EventPaginationDto>(getUrl).toPromise().then((messages) => {
      console.log(messages);
      this.sentMessages$.next(messages.items);
    }).catch((error) => {
      console.log(error);
    })
  }

  public getSentMessages(): Observable<Event[]> {
    return this.sentMessages$.asObservable();
  }

  public getMessageById(id: number): Observable<Event> {
    return this.sentMessages$.asObservable().pipe(
      map((messages) => {
        return messages.find(message => message._id === id);
      })
    );
  }

  public ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  private subscribeToConnectivity(): void {
    this.subscription = this.connectivityService.isOnline$.subscribe(isOnline => {
      this.isOnline = isOnline;
    })
  }
}