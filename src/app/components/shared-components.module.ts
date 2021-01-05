import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventCardComponent } from './event-card';
import { OfflineBarComponent } from './offline-bar';
import { EllipsisModule } from 'ngx-ellipsis';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, EllipsisModule],
  declarations: [EventCardComponent, OfflineBarComponent],
  exports: [EventCardComponent, OfflineBarComponent]
})
export class SharedComponentsModule {}
