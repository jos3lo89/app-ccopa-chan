import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Producto } from '../interfaces/producto.module';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  firestore = inject(Firestore);

  guardarProducto(producto: Producto) {
    const referencia = collection(this.firestore, 'Productos2');
    const productoData = {
      name: producto.name,
      category: producto.category,
      price: producto.price,
      discount: producto.discount,
    };
    return addDoc(referencia, productoData);
  }
}
