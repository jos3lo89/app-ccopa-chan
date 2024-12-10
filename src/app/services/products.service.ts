import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { Producto, ProductoDb } from '../interfaces/producto.module';
import { Observable } from 'rxjs';
import { getDownloadURL, getStorage, ref, uploadString } from '@angular/fire/storage';

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
      description: producto.description, 
      image: producto.image 
    };
    return addDoc(referencia, productoData);
  }

  listingProducts(): Observable<ProductoDb[]> {
    const collRef = collection(this.firestore, 'Productos2');

    return new Observable((observer) => {
      getDocs(collRef)
        .then((qrySnapShot) => {
          const items = qrySnapShot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as ProductoDb;
          });

          observer.next(items);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path));
    });
  }
}
