import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OfflineTaskType } from '../models';
import { ConnectivityService } from './connectivity.service';
import { DataService } from './data.service';
import { OfflineTaskService } from './offline-task.service';

@Injectable()
export class OfflineTaskExecutorService implements OnInit, OnDestroy {
    private subscription: Subscription; 

    constructor(private connectivityService: ConnectivityService,
                private offlineTaskService: OfflineTaskService, 
                private dataService: DataService) {}

    public ngOnInit(): void {
        this.subscribeToConnectivity();
    }
    
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private subscribeToConnectivity(): void {
        this.subscription = this.connectivityService.isOnline$.subscribe(isOnline => {
            if(isOnline) {
                this.startExecutingOfflineTasks();
            }
        });
    }

    private startExecutingOfflineTasks(): void {
        while(this.offlineTaskService.isDataToSync()) {
            const offlineTask = this.offlineTaskService.getOneTask();
            switch(offlineTask.type){
                case OfflineTaskType.Create:
                    this.dataService.createNewEvent(offlineTask.item);
                    break;
                case OfflineTaskType.Update:
                    this.dataService.updateItem(offlineTask.item);
                    break;
                case OfflineTaskType.Delete:
                    this.dataService.deleteEvent(offlineTask.item);
                    break;
            }
        }
    }
}