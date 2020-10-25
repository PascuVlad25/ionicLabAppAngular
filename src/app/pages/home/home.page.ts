import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Message, MessageDto } from 'src/app/models';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public messages$: Observable<Message[]>;

  constructor(private dataService: DataService, public alertController: AlertController) {
    this.getMessages();
  }

  public refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  public async showNewMessagePopup(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'New Message',
      inputs: [
        {
          name: 'from',
          type: 'text',
          placeholder: 'From'
        },
        {
          name: 'subject',
          type: 'text',
          placeholder: 'Subject'
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Your message'
        },
      ],
      buttons: ['Cancel', {
        text: 'Create',
        handler: (data) => {
          const newMessage = new MessageDto(data.from, data.subject, data.content);
          this.dataService.createNewMessage(newMessage);
        }}
      ],
    });

    await alert.present();
  }

  private getMessages(): void {
    this.messages$ = this.dataService.getItems();
  }

}
