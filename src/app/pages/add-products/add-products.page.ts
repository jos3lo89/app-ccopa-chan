import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/interfaces/producto.module';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.page.html',
  styleUrls: ['./add-products.page.scss'],
})
export class AddProductsPage implements OnInit {
  formBuilder = inject(FormBuilder);
  productsService = inject(ProductsService);

  form = this.formBuilder.group({
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    discount: ['', ],
    price: ['', [Validators.required, Validators.min(1)]],
  });

  constructor() {}  

  ngOnInit() {}

  async guardarP() {
    if (this.form.valid) {
      try {
        const productData: Producto = {
          name: this.form.value.name ?? '',
          category: this.form.value.category ?? '',
          discount: Number(this.form.value.discount),
          price: Number(this.form.value.price),
        };

        await this.productsService.guardarProducto(productData);
        console.log('Producto guardado exitosamente');
      } catch (error) {
        console.error('Error al guardar el producto', error);
      }
    } else {
      this.form.markAllAsTouched();
      console.warn('Formulario no válido');
    }
  }
}
