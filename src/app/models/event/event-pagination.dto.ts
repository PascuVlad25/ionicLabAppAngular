import { Event } from './event.model';

export class EventPaginationDto {
    items: Event[];
    page?: number;
    noOfPages?: number;
}