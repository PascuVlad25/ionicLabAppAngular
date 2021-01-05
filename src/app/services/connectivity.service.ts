import { Injectable } from '@angular/core';
import { Network } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConnectivityService {
    public isOnline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    public startCheckConnectivity(): void {
        this.addListenerToStatusChange();
    }

    private addListenerToStatusChange(): void {
        Network.addListener('networkStatusChange', (status) => {
            this.isOnline$.next(status.connected);
        })
    }
}