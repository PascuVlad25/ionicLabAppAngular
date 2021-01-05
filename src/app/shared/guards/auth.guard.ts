import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthenticationService, public navController: NavController) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.navController.navigateRoot(['login']);
      return false;
    }
    return true;
  }
}