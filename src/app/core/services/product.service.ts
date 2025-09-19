import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductDetail} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private api: ApiService) {}

  getProducts(filters?: {
    page?: number;
    priceFrom?: number;
    priceTo?: number;
    sort?: string;
  }): Observable<Product> {
    const params: any = {};

    if (filters?.page) {
      params.page = filters.page;
    }
    if (filters?.priceFrom) {
      params['filter[price_from]'] = filters.priceFrom;
    }
    if (filters?.priceTo) {
      params['filter[price_to]'] = filters.priceTo;
    }
    if (filters?.sort) {
      params.sort = filters.sort;
    }

    return this.api.get<Product>('products', params);
  }

  getProductById(id: number): Observable<ProductDetail> {
    return this.api.get<ProductDetail>(`products/${id}`);
  }
}
