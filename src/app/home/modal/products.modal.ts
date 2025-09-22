// export interface Response {
  // status:string;
  // message:string;
  // products:product[];
  // product?: products;
  // products: Product[];
// }


export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;  // ISO date string
  updatedAt: string;   // ISO date string
}


export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  creationAt: string; // ISO date string
  updatedAt: string;  // ISO date string
  category: Category; // nested category
}
