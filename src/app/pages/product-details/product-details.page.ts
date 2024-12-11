import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { addIcons } from 'ionicons';
import { ProductoDb } from 'src/app/interfaces/producto.module';
import { CarritoService } from 'src/app/services/carrito.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  private _activateRoute = inject(ActivatedRoute);
  private _productService = inject(ProductsService);
  private _router = inject(Router);
  private _cartService = inject(CarritoService);

  private _pdfService = inject(PdfService);

  private _urlParams = {
    backUrl: '',
    productId: '',
    cat: '',
  };

  product: null | ProductoDb = null;
  isModalOpen = false;

  /* Pedir cotizacion START */
  async pedirCotizacion() {
    try {
      const data = {
        ...this.product,
      };

      await this._pdfService.generarBoleta({
        producto: data,
      });

      // por el moneto solo  imprimir en pdf luego hacer backend para enviar correo de cotizacion

      // const res = await axios.post('/enviar-cotizacion');
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  /* Pedir cotizacion END */

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor() {
    this.getParams();
  }

  backBtn() {
    console.log('en back tok fucntion');

    if (this._urlParams.cat) {
      console.log('tiene categorio');
      this._router.navigateByUrl(
        `/${this._urlParams.backUrl}/${this._urlParams.cat}`
      );
    } else {
      console.log('no tiene categoria');
      this._router.navigateByUrl(`/${this._urlParams.backUrl}`);
    }
  }

  getParams() {
    this._activateRoute.queryParams.subscribe({
      next: (params) => {
        if (params['productId']) {
          this._urlParams.productId = params['productId'];
          this._urlParams.backUrl = params['backUrl'];
          if (params['cat']) {
            this._urlParams.cat = params['cat'];
          }

          this.getProductDetailsWithId(params['productId']);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getProductDetailsWithId(id: string) {
    this._productService.getProductWithId(id).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {}

  async addToCart(product: ProductoDb) {
    try {
      console.log(product);
    } catch (error) {
      console.log(error);
    }
  }
}
