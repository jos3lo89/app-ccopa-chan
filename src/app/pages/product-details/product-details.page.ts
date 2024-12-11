import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { ProductoDb } from 'src/app/interfaces/producto.module';
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
  private _urlParams = {
    backUrl: '',
    productId: '',
    cat: '',
  };

  product: null | ProductoDb = null;

  constructor() {
    // addIcons({})
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
        console.log('----->>>>>>>>', data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {}
}
