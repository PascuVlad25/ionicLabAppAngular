import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectivityService } from 'src/app/services';

@Component({
  selector: 'app-offline-bar',
  templateUrl: './offline-bar.component.html',
  styleUrls: ['./offline-bar.component.scss'],
})
export class OfflineBarComponent implements OnInit, OnDestroy {
  public isOnline = true;
  private subscription: Subscription;

  constructor(private connectivityService: ConnectivityService) { }

  public ngOnInit(): void {
    this.subscribeToIsOnline();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToIsOnline(): void {
    this.subscription = this.connectivityService.isOnline$.subscribe((isOnline) => {
      console.log('is Online', isOnline);
      this.isOnline = isOnline;
    })
  }

}
