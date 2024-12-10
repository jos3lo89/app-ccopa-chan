import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
type Color =
  | 'danger'
  | 'dark'
  | 'light'
  | 'medium'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'tertiary'
  | 'warning';
type Position = 'top' | 'middle' | 'bottom';
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _toast = inject(ToastController);

  constructor() {}

  async getToast(message: string, position: Position, color: Color) {
    const toast = await this._toast.create({
      message,
      duration: 1500,
      position,
      color,
    });

    await toast.present();
  }
}
