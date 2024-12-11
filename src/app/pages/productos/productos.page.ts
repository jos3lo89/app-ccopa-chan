import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto, ProductoDb } from 'src/app/interfaces/producto.module';
import { ProductsService } from 'src/app/services/products.service';

export interface Producto2 extends ProductoDb {
  precioConDescuento: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productos: Producto2[] = [];
  categoriaSeleccionada: string = '';

  private _router = inject(Router);

  goToDetails(productId: string) {
    this._router.navigate(['/product-details'], {
      queryParams: {
        productId,
        backUrl: `productos`,
        cat: this.categoriaSeleccionada,
      },
    });
  }

  constructor() {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.categoriaSeleccionada = params.get('category') || '';

      // Obtener productos de acuerdo con la categoría seleccionada
      this.productsService.listingProducts().subscribe({
        next: (data) => {
          this.productos = data
            .filter(
              (producto) => producto.category === this.categoriaSeleccionada
            )
            .map((producto) => ({
              ...producto,
              precioConDescuento: producto.price * producto.discount,
            }));
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
}
