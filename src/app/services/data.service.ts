import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventDto, EventPaginationDto, WebsocketDataDTO, WebsocketDataType } from '../models';
import { LocalStorageItems } from '../shared';
import { ConnectivityService } from './connectivity.service';
import { EntityConflictsService } from './entity-conflicts.service';
import { HttpService } from './http.service';
import { OfflineTaskService } from './offline-task.service';
import { WebsocketService } from './websocket.service';


@Injectable()
export class DataService implements OnDestroy {

  public messages: Event[] = [];
  public noOfPages = 1;
  private events$: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private entityUrl = 'item';
  private subscription: Subscription;
  private isOnline = true;

  constructor(
      private httpService: HttpService, 
      private connectivityService: ConnectivityService, 
      private offlineTaskService: OfflineTaskService,
      private entityConflictsService: EntityConflictsService,
      private websocketService: WebsocketService) {
    console.log('data service initialized');
    this.websocketService.events$ = this.events$;
    this.subscribeToConnectivity();
  }

  public fetchItems(pageSize: number, currentPage: number, search?: string, isFilterOn?: boolean): void {
    if(!this.isOnline) {
        this.fetchItemsOffline(pageSize, currentPage);
        return;
    }    
    const currentUser = JSON.parse(localStorage.getItem(LocalStorageItems.CurrentUser));
    const getUrl = `${this.entityUrl}?pageSize=${pageSize}&page=${currentPage}${search ? '&search=' + search : ''}${isFilterOn ? '&filter=' + currentUser.id : ''}`;
    this.httpService.get<EventPaginationDto>(getUrl).toPromise().then((eventPaginationDto) => {
      console.log(eventPaginationDto);
      let currentEvents = this.events$.value;
      if(currentPage == 1) {
        currentEvents = eventPaginationDto.items;
      } else {
        currentEvents.push(...eventPaginationDto.items);
      }
      this.events$.next(currentEvents);
      if(eventPaginationDto.noOfPages) {
        this.noOfPages = eventPaginationDto.noOfPages;
      }
      localStorage.setItem(LocalStorageItems.Events, JSON.stringify(currentEvents));
    }).catch((error) => {
      console.log(error);
    })
  }

  private fetchItemsOffline(pageSize: number, currentPage: number): void {
    console.log('Offline fetch');
    const messages: Event[] = JSON.parse(localStorage.getItem(LocalStorageItems.Events));
    if(!messages) {
      return;
    }
    const chunkOfMessages = messages.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    const currentMessages = this.events$.value;
    currentMessages.push(...chunkOfMessages);
    this.events$.next(currentMessages);
  }

  public getItems(): Observable<Event[]> {
    return this.events$.asObservable();
  }

  public getMessageById(id: number): Observable<Event> {
    console.log('id', id);
    return this.events$.asObservable().pipe(
      map((messages) => {
        return messages.find(message => message._id === id);
      })
    );
  }

  public updateItem(message: Event): void {
    if(!this.isOnline) {
      this.offlineTaskService.addUpdateOfflineTask(message);
      return;
    }
    const updateUrl = `${this.entityUrl}/${message._id}`;
    this.httpService.put(updateUrl, message).toPromise().then().catch(error => {
      this.entityConflictsService.addUpdateConflict(message, error);
    });
  }

  public createNewEvent(newEvent: EventDto): void {
    if(!this.isOnline) {
      this.offlineTaskService.addCreateOfflineTask(newEvent);
      return;
    }
    this.httpService.post(this.entityUrl, newEvent).subscribe((item) => {
      console.log('item created', item);
    })
  }

  public deleteEvent(eventId: number): void {
    if(!this.isOnline) {
      this.offlineTaskService.addDeleteOfflineTask(eventId);
      return;
    }
    const deleteUrl = `${this.entityUrl}/${eventId}`;
    this.httpService.delete(deleteUrl).subscribe(() => {
      console.log('item deleted');
    })
  }

  public logout(): void {
    this.events$.next([]);
    this.websocketService.closeWebSocket();
  }

  public ngOnDestroy(): void {
    this.websocketService.closeWebSocket();
    this.subscription.unsubscribe();
  }

  private subscribeToConnectivity(): void {
    this.subscription = this.connectivityService.isOnline$.subscribe(isOnline => {
      this.isOnline = isOnline;
    })
  }
}
