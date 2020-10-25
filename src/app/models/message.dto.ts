export class MessageDto {
    fromName: string;
    subject: string;
    content: string;

    constructor(fromName?: string, subject?: string, content?: string) {
        this.fromName = fromName;
        this.subject = subject;
        this.content = content;
    }
  }