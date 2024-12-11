import { Component, inject } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ProductsService } from 'src/app/services/products.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Description, Producto } from 'src/app/interfaces/producto.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastService } from 'src/app/services/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.page.html',
  styleUrls: ['./add-products.page.scss'],
})
export class AddProductsPage {
  firestore = inject(AngularFirestore);
  modalService = inject(ModalService);
  productsService = inject(ProductsService);
  utilService = inject(UtilsService);
  toastService = inject(ToastService);

  name: string | null = null;
  category: string | null = null;
  discount: number | null = null;
  price: number | null = null;
  description: Description[] = [];
  image: string | null = null; // Para almacenar la imagen capturada

  constructor() {}

  async agregarDescripcion() {
    const descripcion = await this.modalService.agregarDescripcion();

    if (descripcion) {
      this.description.push(descripcion);
    }
  }

  async abrirModalNombre() {
    const name = await this.modalService.openInputModal<string>({
      header: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del producto',
    });

    if (name !== null) {
      this.name = name;
    }
  }

  async abrirModalCategoria() {
    const category = await this.modalService.openInputModal<string>({
      header: 'Categoría',
      type: 'text',
      placeholder: 'Ingrese la categoría del producto',
    });

    if (category !== null) {
      this.category = category;
    }
  }

  async abrirModalDescuento() {
    const discount = await this.modalService.openInputModal<number>({
      header: 'Descuento',
      type: 'number',
      placeholder: 'Ingrese el % de descuento',
    });

    if (discount !== null) {
      this.discount = discount;
    }
  }

  async abrirModalPrecio() {
    const price = await this.modalService.openInputModal<number>({
      header: 'Precio',
      type: 'number',
      placeholder: 'Ingrese el precio del producto',
    });

    if (price !== null) {
      this.price = price;
    }
  }

  async takeImage() {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    if (photo.dataUrl) {
      this.image = photo.dataUrl;
    }
  }

  private validarFormulario(): boolean {
    if (!this.name || this.name.trim() === '') {
      this.toastService.getToast('Ingrese el nombre del producto', 'middle', 'danger');
      return false;
    }
    if (!this.category || this.category.trim() === '') {
      this.toastService.getToast('Ingrese la categoría', 'middle', 'danger');
      return false;
    }
    if (this.price === null || this.price <= 0) {
      this.toastService.getToast('Ingrese el precio del producto', 'middle', 'danger');
      return false;
    }
    return true;
  }

  async guardarP() {
    if (!this.validarFormulario()) {
      return;
    }

    try {
      const productItemId = this.firestore.createId();
      let imageUrl = '';

      if (this.image) {
        const imagePath = `productos/${productItemId}_${Date.now()}.png`;
        imageUrl = await this.productsService.uploadImage(imagePath, this.image);
      }

      const nuevoProducto: Producto = {
        name: this.name ?? '', // Aseguramos que no sea null
        category: this.category ?? '', // Aseguramos que no sea null
        price: this.price ?? 0, // Aseguramos que no sea null
        discount: this.discount ?? 0, // Aseguramos que no sea null
        description: this.description,
        image: imageUrl,
      };

      await this.productsService.guardarProducto(nuevoProducto);

      this.utilService.dismissModal({ success: true });
      await this.toastService.getToast('Producto guardado exitosamente', 'middle', 'success');
    } catch (error) {
      console.error('Error al guardar el producto', error);
      this.toastService.getToast('Error al guardar producto', 'middle', 'danger');
    }
  }
}
