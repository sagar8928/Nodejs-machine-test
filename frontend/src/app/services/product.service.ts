import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // Get products 

  getProducts(page: number = 1, pageSize: number = 10): Observable<ProductResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Send request with params: /api/products?page=1&pageSize=10
    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  // Get single product
  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create product
  createProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  // Update product
  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  // Delete product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}