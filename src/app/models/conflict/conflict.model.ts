export class Conflict {
    localItem: any;
    serverItem: any;

    constructor(localItem: any, serverItem: any) {
        this.localItem = localItem;
        this.serverItem = serverItem;
    }
}