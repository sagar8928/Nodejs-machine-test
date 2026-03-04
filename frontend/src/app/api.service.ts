import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {

  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Category
  getCategories() {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  addCategory(data:any) {
    return this.http.post<any[]>(`${this.baseUrl}/categories`, data);
  }

  deleteCategory(id:number) {
    return this.http.delete<any[]>(`${this.baseUrl}/categories/${id}`);
  }

  // Product
  getProducts(page:number=1, pageSize:number=10) {
    return this.http.get<any[]>(`${this.baseUrl}/products?page=${page}&pageSize=${pageSize}`);
  }

  addProduct(data:any) {
    return this.http.post<any[]>(`${this.baseUrl}/products`, data);
  }

  deleteProduct(id:number) {
    return this.http.delete<any[]>(`${this.baseUrl}/products/${id}`);
  }
}