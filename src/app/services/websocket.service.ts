import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Event, WebsocketDataDTO, WebsocketDataType } from '../models';
import { LocalStorageItems } from '../shared/utils';
import { serverAddress } from './../../environments/server-address';

@Injectable()
export class WebsocketService {
    public events$: BehaviorSubject<Event[]>;
    public closeWebSocket: () => void;

    private baseUrl = serverAddress;

    constructor(){
        this.createWebsocket();
    }
    
    public createWebsocket(): void {
        console.log('create websocket')
        this.closeWebSocket = this.newWebSocket();
    }

    private newWebSocket() {
        const ws = new WebSocket(`ws://${this.baseUrl}`)
        ws.onopen = () => {
          console.log('web socket onopen');
          const authorizationMessage = new WebsocketDataDTO(WebsocketDataType.AUTHORIZE, { token: localStorage.getItem(LocalStorageItems.Token)});
          ws.send(JSON.stringify(authorizationMessage));
        };
        ws.onclose = () => {
            console.log('web socket onclose');
        };
        ws.onerror = error => {
            console.log('web socket onerror', error);
        };
        ws.onmessage = messageEvent => {
            console.log('web socket onmessage');
            this.handleWebSocketData(JSON.parse(messageEvent.data));
        };
        return () => {
          ws.close();
        }
      }

    private newItemAdded(item: Event): void {
        this.events$.next([item, ...this.events$.value]);
    }

    private itemUpdated(updatedItem: Event): void {
        const newList = this.events$.value.map((item) => item._id === updatedItem._id ? updatedItem : item);
        this.events$.next(newList);
    }

      
    private handleWebSocketData(data: WebsocketDataDTO): void {
        console.log(`ws message, item ${data.type}`);
        switch(data.type) {
        case WebsocketDataType.CREATE:
            console.log('created', data);
            this.newItemAdded(data.payload);
            break;
        case WebsocketDataType.UPDATE: 
            console.log('updated', data);
            this.itemUpdated(data.payload);
            break;
        }
    }

}