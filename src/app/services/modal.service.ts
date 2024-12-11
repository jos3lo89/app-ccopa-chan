import { inject, Injectable } from '@angular/core';
import { Description } from '../interfaces/producto.module';
import { AlertController } from '@ionic/angular';

export interface ModalConfig<T> {
  header: string;
  type: 'text' | 'number' | 'tel';
  placeholder: string;
  minValue?: number;
  validation?: {
    pattern?: string;
    maxLength?: number;
    minLength?: number;
  };
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  alertController = inject(AlertController);

  async openInputModal<T extends string | number>(config: ModalConfig<T>): Promise<T | null> {
    const alert = await this.alertController.create({
      header: config.header,
      cssClass: 'custom-alert',
      inputs: [
        {
          type: config.type,
          placeholder: config.placeholder,
          min: config.minValue,
          name: 'value',
          attributes: config.validation
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            if (config.type === 'tel' && config.validation?.pattern) {
              const value = data.value ? data.value.trim() : '';
              const pattern = new RegExp(config.validation.pattern);
              
              if (!pattern.test(value)) {
                this.showError(config.errorMessage || 'Valor inválido');
                return false;
              }
            }

            if (config.type === 'number') {
              return data.value && Number(data.value) > (config.minValue || 0);
            }

            return data.value && data.value.trim() !== '';
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    
    if (result.role === 'cancel' || !result.data?.values?.value) {
      return null;
    }

    return config.type === 'number' 
      ? Number(result.data.values.value) as T
      : result.data.values.value.trim() as T;
  }

  private async showError(message: string) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Aceptar']
    });
    await errorAlert.present();
  }


  async agregarDescripcion(): Promise<Description | null> {
    const name = await this.openInputModal<string>({
      header: 'Agregar Nombre',
      type: 'text',
      placeholder: 'Nombre'
    });
    const details = await this.openInputModal<string>({
      header: 'Agregar Detalles',
      type: 'text',
      placeholder: 'Detalles'
    });
  
    if (name && details) {
      return {
        name,
        details,
        id: Date.now().toString()  // Asignamos un ID único
      };
    }
  
    return null;
  }
  

  
  constructor() {}
}