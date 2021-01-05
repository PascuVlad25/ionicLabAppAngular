export class Event {
    title: string;
    description: string;
    date: Date;
    _id: number;
    createdByUserId: number;
    read: boolean;
    image: string;
    coordinates: number[];

    constructor(id: number, title?: string, description?: string) {
        this._id = id;
        this.date = new Date();
        this.title = title;
        this.description = description;
        this.read = false;
    }
  }