import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private companyData = {
    nombre: 'Acerino',
    ruc: '235343263SDT2342',
    direccion: 'Av las fresias 123',
    email: 'acerino@gmail.com',
    web: 'www.acerino.com',
  };

  constructor() {}

  async generarBoleta(datos: { producto: any }) {
    try {
      const doc = new jsPDF({
        // orientation: 'portrait',
        // unit: 'mm',
        // format: [90, 200],
      });

      const logoBase64 = await this.cargarImagenBase64('assets/img/logo.png');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.addImage(logoBase64, 'PNG', 93, 12, 25, 20); // Coordenadas (x, y) y tamaño (ancho, alto)

      doc.line(5, 35, 85, 35);

      const pdfBlob = doc.output('blob');

      const info = await Device.getInfo();

      if (info.platform === 'web') {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      } else if (info.platform === 'android' || info.platform === 'ios') {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onloadend = async () => {
          const base64Data = reader.result?.toString().split(',')[1];

          if (base64Data) {
            const fileName = `boleta_${Date.now()}.pdf`;

            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });

            await Toast.show({
              text: `Archivo guardado correctamente en Documentos como ${fileName}.`,
              duration: 'long',
            });

            const fileUri = await Filesystem.getUri({
              path: fileName,
              directory: Directory.Documents,
            });

            await Share.share({
              title: 'Compartir Boleta',
              text: 'Aquí está tu boleta de venta electrónica.',
              url: fileUri.uri,
              dialogTitle: 'Compartir con:',
            });
          }
        };
      }
    } catch (error) {
      console.error('Error al generar la boleta:', error);

      await Toast.show({
        text: 'Error al guardar la boleta.',
        duration: 'long',
      });
    }
  }

  async cargarImagenBase64(ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = ruta;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  }
}
