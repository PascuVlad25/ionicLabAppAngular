import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SentMessagesPageRoutingModule } from './sent-messages-routing.module';

import { SentMessagesPage } from './sent-messages.page';
import { SharedComponentsModule } from 'src/app/components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SentMessagesPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SentMessagesPage]
})
export class SentMessagesPageModule {}
