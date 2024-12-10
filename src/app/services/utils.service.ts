import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  LoadingController,
  ModalController,
  ModalOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  router = inject(Router);
  modalCtrl = inject(ModalController);

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }



  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();

    return data;
  }

  dismissModal(data: any) {
    this.modalCtrl.getTop().then(modal => {
      if (modal) {
        modal.dismiss(data); 
      }
    });
  }
  

  //camara

  async takePicture(promptLabelHeader: string) {
    return Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,  
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }
  
  
  
}
