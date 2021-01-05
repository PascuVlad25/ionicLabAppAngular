import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { UserDto } from '../models';
import { LocalStorageItems } from '../shared/utils';
import { HttpService } from './http.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class AuthenticationService {
    private url = "auth/login";
    constructor(private httpService: HttpService, private navController: NavController, private websocketService: WebsocketService) {}

    public login(username: string, password: string): Promise<any> {
        return this.httpService.post(this.url, new UserDto(username, password)).pipe(map((value) => {
            console.log('Token response ', value);
            const expiresInMiliseconds = value.expiresIn * 1000;
            const expiresAt = Date.now() + expiresInMiliseconds;
            const token = value.token;
            const user = value.user;
            localStorage.setItem(LocalStorageItems.Token, token);
            localStorage.setItem(LocalStorageItems.TokenExpirationDate, JSON.stringify(expiresAt));
            localStorage.setItem(LocalStorageItems.CurrentUser, JSON.stringify(user));
            this.websocketService.createWebsocket();
        })).toPromise();
    }

    public logout(): void {
        localStorage.removeItem(LocalStorageItems.Token);
        localStorage.removeItem(LocalStorageItems.TokenExpirationDate);
        localStorage.removeItem(LocalStorageItems.CurrentUser);
        this.navController.navigateRoot('login');
    }

    public isAuthenticated(): boolean {
        return this.getExpireAt() > Date.now();
    }

    private getExpireAt(): number {
        const expiration = localStorage.getItem(LocalStorageItems.TokenExpirationDate);
        return expiration != null ? parseInt(expiration) : -1;
    }
}