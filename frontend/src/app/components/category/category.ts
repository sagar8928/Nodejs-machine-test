import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  currentCategory: Category = { CategoryId: 0, CategoryName: '' };
  isEditing: boolean = false;
  message: string = '';
  isError: boolean = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        this.showMessage('Error loading categories', true);
      }
    });
  }

  // Create or Update
  saveCategory(): void {
    if (!this.currentCategory.CategoryName.trim()) {
      this.showMessage('Category name is required', true);
      return;
    }

    if (this.isEditing) {
      // Update existing
      this.categoryService.updateCategory(this.currentCategory.CategoryId, this.currentCategory)
        .subscribe({
          next: () => {
            this.showMessage('Category updated successfully');
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.showMessage('Error updating category', true);
          }
        });
    } else {
      // Create new
      this.categoryService.createCategory(this.currentCategory)
        .subscribe({
          next: () => {
            this.showMessage('Category created successfully');
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.showMessage('Error creating category', true);
          }
        });
    }
  }

  // Edit category
  editCategory(category: Category): void {
    this.currentCategory = { ...category }; // Copy object
    this.isEditing = true;
  }

  // Delete category
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.showMessage('Category deleted successfully');
          this.loadCategories();
        },
        error: (error) => {
          this.showMessage('Error deleting category (might be in use)', true);
        }
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.currentCategory = { CategoryId: 0, CategoryName: '' };
    this.isEditing = false;
  }

  // Show message
  showMessage(msg: string, isError: boolean = false): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 3000);
  }
}
