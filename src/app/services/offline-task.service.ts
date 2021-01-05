import { Injectable } from '@angular/core';
import { Event, EventDto, OfflineTask, OfflineTaskType } from '../models';

@Injectable()
export class OfflineTaskService {
    private tasks: OfflineTask[] = [];

    public addCreateOfflineTask(createdMessage: EventDto): void {
        console.log('creates offline task');
        this.addOfflineTask(new OfflineTask(OfflineTaskType.Create, createdMessage));
    }

    public addUpdateOfflineTask(updatedMessage: Event): void {
        console.log('updates offline task');
        this.addOfflineTask(new OfflineTask(OfflineTaskType.Update, updatedMessage));
    }

    public addDeleteOfflineTask(deletedMessageId: number): void {
        console.log('deletes offline task');
        this.addOfflineTask(new OfflineTask(OfflineTaskType.Delete, deletedMessageId));
    }

    public getOneTask(): OfflineTask {
        return this.tasks.shift();
    }

    public isDataToSync(): boolean {
        return this.tasks.length !== 0;
    }

    private addOfflineTask(task: OfflineTask): void {
        this.tasks.push(task);
    }
}