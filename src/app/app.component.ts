import { Component, OnDestroy, OnInit } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService, ConnectivityService, DataService, EntityConflictsService } from './services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  public conflictsNumber: number;
  private conflictsSubscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private connectivityService: ConnectivityService,
    private router: Router,
    private menuController: MenuController,
    private authService: AuthenticationService,
    private dataService: DataService,
    private conflictsService: EntityConflictsService
  ) {
    this.initializeApp();
    this.connectivityService.startCheckConnectivity();
  }

  public ngOnInit(): void {
    this.subscribeToConflicts();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public goToSentMessages(): void {
    this.menuController.close();
    this.router.navigate(['/sent-messages']);
  }

  public logout(): void {
    this.menuController.close();
    this.authService.logout();
    this.dataService.logout();
  }

  public ngOnDestroy(): void {
    this.conflictsSubscription.unsubscribe();
  }

  private subscribeToConflicts(): void {
    this.conflictsSubscription = this.conflictsService.getConflictsNumber().subscribe(conflictsNumber => {
      this.conflictsNumber = conflictsNumber;
    })
  }
}
