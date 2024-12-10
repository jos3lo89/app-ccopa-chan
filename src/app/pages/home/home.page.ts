import { Component, inject, OnInit } from '@angular/core';
import { Producto, ProductoDb } from 'src/app/interfaces/producto.module';
import { ProductsService } from 'src/app/services/products.service';

export interface Producto2 extends ProductoDb{
  precioConDescuento: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  productosService = inject(ProductsService)

  products: Producto2[]= []

  constructor() { }

  ngOnInit() {
    this.productosService.listingProducts().subscribe({
      next: (data) => {
        this.products = data.map(p=>{
          return {...p, discount:p.discount*100, precioConDescuento:p.price*p.discount}
        })
        console.log(data);
        
      }, error: (error) =>{
        console.log(error);
        
      }

    })
  }
  toggleDarkMode(){
    document.body.classList.toggle('dark');
  }

}




