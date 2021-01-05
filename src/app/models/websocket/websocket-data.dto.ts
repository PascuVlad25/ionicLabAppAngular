import { WebsocketDataType } from './websocket-data-type.enum';

export class WebsocketDataDTO {
    public type: WebsocketDataType;
    public payload: any;

    constructor(type: WebsocketDataType, payload: any) {
        this.type = type;
        this.payload = payload;
    }
}