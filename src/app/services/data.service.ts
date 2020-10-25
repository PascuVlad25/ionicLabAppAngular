import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message, MessageDto } from '../models';
import { HttpService } from './http.service';

const baseUrl = 'localhost:3000';
export const newWebSocket = (onMessage: (data: any) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`)
    ws.onopen = () => {
      console.log('web socket onopen');
    };
    ws.onclose = () => {
        console.log('web socket onclose');
    };
    ws.onerror = error => {
        console.log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        console.log('web socket onmessage');
      onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
      ws.close();
    }
  }

@Injectable()
export class DataService implements OnDestroy {

  public messages: Message[] = [];
  private messages$: BehaviorSubject<Message[]> = new BehaviorSubject([]);
  private closeWebSocket: () => void;
  private entityUrl = 'item';

  constructor(private httpService: HttpService) {
    console.log('initialized');
    this.fetchItems();
    this.createWebsocket();
  }

  public async fetchItems(): Promise<void> {
    this.httpService.get<Message[]>(this.entityUrl).subscribe((items) => {
      console.log(items);
      this.messages$.next(items);
    })
  }

  public getItems(): Observable<Message[]> {
    return this.messages$.asObservable();
  }

  public getMessageById(id: number): Observable<Message> {
    return this.messages$.asObservable().pipe(
      map((messages) => {
        return messages.find(message => message.id === id);
      })
    );
  }

  public updateItem(message: Message): void {
    const updateUrl = `${this.entityUrl}/${message.id}`;
    this.httpService.put(updateUrl, message);
  }

  public createNewMessage(newMessage: MessageDto): void {
    this.httpService.post(this.entityUrl, newMessage);
  }

  public ngOnDestroy(): void {
    this.closeWebSocket();
  }

  private createWebsocket(): void {
    console.log('created websocket')
    this.closeWebSocket = newWebSocket(message => {
      const { event, payload: { item }} = message;
      console.log(`ws message, item ${event}`);
      if (event === 'created') {
        console.log('created', message);
        this.newItemAdded(item);
      } else if (event === 'updated') {
        console.log('updated', message);
        this.itemUpdated(item);
      }
    });
  }

  private newItemAdded(item: Message): void {
    this.messages$.next([ ...this.messages$.value, item]);
  }

  private itemUpdated(updatedItem: Message): void {
    const newList = this.messages$.value.map((item) => item.id === updatedItem.id ? updatedItem : item);
    this.messages$.next(newList);
  }
}
