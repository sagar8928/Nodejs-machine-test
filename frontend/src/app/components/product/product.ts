import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  
  currentProduct: Product = {
    ProductId: 0,
    ProductName: '',
    CategoryId: 0,
    CategoryName: ''
  };
  
  isEditing: boolean = false;
  message: string = '';
  isError: boolean = false;

  // PAGINATION VARIABLES
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  hasNextPage: boolean = false;
  hasPrevPage: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // Load categories
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  // Load products
  loadProducts(): void {
    // Call API with current page and page size
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.data;
        
        // Update pagination
        this.totalRecords = response.pagination.totalRecords;
        this.totalPages = response.pagination.totalPages;
        this.hasNextPage = response.pagination.hasNextPage;
        this.hasPrevPage = response.pagination.hasPrevPage;
      },
      error: (error) => {
        this.showMessage('Error loading products', true);
      }
    });
  }

  //  specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts(); // Load data for new page
    }
  }

  // Change page size
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.loadProducts();
  }

  // Create or Update
  saveProduct(): void {
    if (!this.currentProduct.ProductName.trim()) {
      this.showMessage('Product name is required', true);
      return;
    }
    if (this.currentProduct.CategoryId === 0) {
      this.showMessage('Please select a category', true);
      return;
    }

    if (this.isEditing) {
      this.productService.updateProduct(this.currentProduct.ProductId, this.currentProduct)
        .subscribe({
          next: () => {
            this.showMessage('Product updated successfully');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            this.showMessage('Error updating product', true);
          }
        });
    } else {
      this.productService.createProduct(this.currentProduct)
        .subscribe({
          next: () => {
            this.showMessage('Product created successfully');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            this.showMessage('Error creating product', true);
          }
        });
    }
  }

  // Edit product
  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditing = true;
  }

  // Delete product
  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.showMessage('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          this.showMessage('Error deleting product', true);
        }
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.currentProduct = {
      ProductId: 0,
      ProductName: '',
      CategoryId: 0,
      CategoryName: ''
    };
    this.isEditing = false;
  }

  // Show message
  showMessage(msg: string, isError: boolean = false): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 3000);
  }

  // Generate array for page numbers
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}