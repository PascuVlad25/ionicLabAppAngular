import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetailsPage } from './event-details.page';

import { IonicModule } from '@ionic/angular';

import { EventDetailsPageRoutingModule } from './event-details-routing.module';
import { GoogleMaps } from '@ionic-native/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventDetailsPageRoutingModule
  ],
  declarations: [EventDetailsPage],
  providers: [GoogleMaps]
})
export class EventDetailsPageModule {}
