import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import { ProductsService } from 'src/app/services/products.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Description } from 'src/app/interfaces/producto.module';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.page.html',
  styleUrls: ['./add-products.page.scss'],
})
export class AddProductsPage {
  firestore = inject(AngularFirestore);
  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  productsService = inject(ProductsService);
  utilService = inject(UtilsService);
  form: FormGroup;


  name: string | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      discount: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [[]], // Campo para las descripciones
      image: [''], // Para almacenar la URL de la imagen
    });
  }

  async agregarDescripcion() {
    const descripcion = await this.modalService.agregarDescripcion();

    if (descripcion) {
      const currentDescription = this.form.value.description || []; 
      currentDescription.push(descripcion); 
      this.form.patchValue({ description: currentDescription }); 
    }
  }

  async abrirModalNombre() {
    const name = await this.modalService.openInputModal<string>({
      header: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del producto'
    });
    
    if (name !== null) {
      this.name = name;
    }
  }

  async takeImage() {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl, 
      source: CameraSource.Photos,
      promptLabelHeader: 'Selecciona una imagen',
      promptLabelPhoto: 'Seleccionar Foto',
      promptLabelPicture: 'Seleccionar Imagen',
    });

    this.form.patchValue({
      image: photo.dataUrl, 
    });
  }

  async guardarP() {
    if (this.form.valid) {
      const loading = await this.utilService.loading();
      await loading.present();

      try {
        const productItemId = this.firestore.createId();

        let imageUrl = '';
        if (this.form.value.image) {
          const dataUrl = this.form.value.image;
          const imagePath = `productos/${productItemId}_${Date.now()}.png`;
          imageUrl = await this.productsService.uploadImage(imagePath, dataUrl);
        }

        const productData = {
          name: this.form.value.name,
          category: this.form.value.category,
          price: this.form.value.price,
          discount: this.form.value.discount,
          description: this.form.value.description,
          image: imageUrl,
        };

        await this.productsService.guardarProducto(productData);

        this.utilService.dismissModal({ success: true });
        console.log('Producto guardado exitosamente');
      } catch (error) {
        console.error('Error al guardar el producto', error);
      } finally {
        loading.dismiss();
      }
    } else {
      this.form.markAllAsTouched();
      console.warn('Formulario no válido');
    }
  }
}
