import { OfflineTaskType } from './offline-task-type.enum';

export class OfflineTask {
    type: OfflineTaskType;
    item: any;

    constructor(type: OfflineTaskType, item: any) {
        this.type = type;
        this.item = item;
    }
}