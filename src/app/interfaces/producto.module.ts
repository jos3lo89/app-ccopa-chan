export interface Producto {
  name: string;
  category: string;
  discount: number;
  price: number;
  description: Description[];
  image: string;
}

export interface ProductoDb extends Producto {
  id: string;
}

export interface Description {
  id?: string;
  name: string;
  details: string;
}

