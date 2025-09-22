import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  Product } from '../modal/products.modal';


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private URL = 'https://api.escuelajs.co/api/v1/products';
  private http = inject(HttpClient);

  constructor() {}

  getAllPosts(options?:{ offset?: number; limit?: number; title?: string  }): Observable<Product[]> {
    let params = new HttpParams();

    if(options?.offset){
      params = params.set('offset' , options.offset)
    }
    if(options?.limit){
      params = params.set('limit' , options.limit)
    }
   
    if(options?.title){
      params = params.set('title' , options.title)
    }
    return this.http.get<Product[]>(this.URL ,{ params });
  }

  getProductById(id:string):Observable<Product>{
    return this.http.get<Product>(`${this.URL}/${id}`)
  }
}
