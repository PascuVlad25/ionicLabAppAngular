import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, Marker } from '@ionic-native/google-maps';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { Event, EventDto } from 'src/app/models';
import { DataService } from 'src/app/services';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
  CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, Storage } = Plugins;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit, OnDestroy {
  @Input() event: Event;
  public isEdit = true;
  public isInvalid = false;
  private map: GoogleMap;

  private marker: Marker;

  constructor(private modalController: ModalController, private domSanitizer: DomSanitizer, 
    private actionSheetController: ActionSheetController, private imagePicker: ImagePicker, private dataService: DataService) { }

  ngOnInit() {
    console.log(this.event);
    if(!this.event) {
      this.event = new Event(-1);
      this.isEdit = false;
    } 
    this.loadMap();
  }

  public sanitizeImage(): any {
    if(this.event.image) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(this.event.image);
    }
  }

  public closePage() {
    this.modalController.dismiss();
  }

  public saveEvent(): void {
    if(!this.validateFields())
      return;
    if(this.isEdit) {
      this.dataService.updateItem(this.event);
    } else {
      this.dataService.createNewEvent(new EventDto(
        this.event.title,
        this.event.description,
        this.event.image,
        this.event.coordinates
      ))
    }
    this.closePage();
  }

  public async selectPhotoMethod() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select photo method',
      buttons: [{
        text: 'From gallery',
        icon: 'images-outline',
        handler: () => {
          console.log('From gallery clicked');
          this.getImages();
        }
      }, {
        text: 'Take photo',
        icon: 'camera-outline',
        handler: () => {
          console.log('Take photo clicked');
          this.takePhoto();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  public getImages() {
    const options = {
      width: 400,

      // quality of resized image, defaults to 100
      quality: 25,

      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      console.log(results);
      this.event.image = 'data:image/jpeg;base64,' + results[0];
    }, (err) => {
      alert(err);
    });
  }

  public async takePhoto(): Promise<void> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64, 
      source: CameraSource.Camera, 
      quality: 25 
    });
    this.event.image = 'data:image/jpeg;base64,' + capturedPhoto.base64String;
  }

  public ngOnDestroy(): void {
    if(this.map) {
      this.map.destroy();
    }
  }

  private validateFields(): boolean {
    if(!this.event.title || !this.event.description) {
      this.isInvalid = true;
      return false;
    }
    return true;
  }

  private loadMap(): void {
      try {
        this.map = GoogleMaps.create('map-edit');
        const coordinates: LatLng = this.event.coordinates ? new LatLng(this.event.coordinates[0], this.event.coordinates[1]) :
        new LatLng(46.77200248969785, 23.59990579251372);

        this.map.one( GoogleMapsEvent.MAP_READY ).then((data: any) => { 
          this.map.setCameraTarget(coordinates);
          this.map.setCameraZoom(15);
        });
        this.marker = this.map.addMarkerSync({
          position: coordinates,
          draggable: true
        });

        this.marker.on('position_changed').pipe(debounceTime(1000)).subscribe((newPosition) => {
          const latLng = newPosition[1];
          this.event.coordinates = [latLng.lat, latLng.lng];
        })

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          ([latLng]) => {
              console.log("Click MAP", latLng);
              this.marker.setPosition(latLng);
              this.event.coordinates = [latLng.lat, latLng.lng];
          }
      );
      } catch(error) {
        console.log('The map cant load');
      }
    
  }

}
