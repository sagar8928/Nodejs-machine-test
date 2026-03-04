import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) { }

  // Get all categories
  getAllCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get single category
  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create category
  createCategory(category: Category): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  // Update category
  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  // Delete category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}