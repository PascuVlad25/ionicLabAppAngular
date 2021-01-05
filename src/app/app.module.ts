import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService, AuthInterceptor, ConnectivityService, DataService, EntityConflictsService, HttpService, OfflineTaskExecutorService, OfflineTaskService, SentMessagesService, WebsocketService } from './services';
import { AuthGuard } from './shared';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedComponentsModule } from './components';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    SharedComponentsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    DataService,
    SentMessagesService,
    HttpService,
    ConnectivityService,
    OfflineTaskService,
    OfflineTaskExecutorService,
    EntityConflictsService,
    AuthenticationService,
    WebsocketService,
    AuthGuard,
    ImagePicker,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
