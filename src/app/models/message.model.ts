export class Message {
    fromName: string;
    subject: string;
    content: string;
    date: Date;
    id: number;
    read: boolean;

    constructor(id: number, fromName?: string, subject?: string, content?: string) {
        this.id = id;
        this.date = new Date();
        this.fromName = fromName;
        this.subject = subject;
        this.content = content;
        this.read = false;
    }
  }