export class EventDto {
    title: string;
    description: string;
    image: string;
    coordinates: number[];

    constructor(title: string, description: string, image?: string, coordinates?: number[]) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.coordinates = coordinates;
    }
  }