import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../Environments/environment';
import { Product } from '../../../model/product';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];  // hold original data
  currentPage: number = 1;  // Current page number
  totalPages: number = 1;  // Total number of pages
  pageSize: number = 10;  // Number of items per page
  originalProducts: Product[] = [];  // To hold the original fetched products for sorting

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProducts(this.currentPage);  // Load products for the first page
  }

  // Method to fetch products with pagination
  loadProducts(page: number): void {
    this.productService.getProducts(page).subscribe({
      next: (data) => {
        this.products = data.Products;  // Assign the fetched products
        this.originalProducts = [...this.products];  // Keep a copy for sorting
        this.totalPages = data.totalCount;  // Calculate total pages
        this.currentPage = page;  // Update the current page
      },
      error: this.handleError,  // Handle errors globally
    });
  }

  // Handle image URL construction
  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}/${imagePath}`;
  }

  // Handle page change
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;  // Do nothing if the page number is out of bounds
    }
    this.loadProducts(page);  // Reload products for the new page
  }

  // Sorting products by price (ascending or descending)
  sortByPrice(order: 'asc' | 'desc'): void {
    const compare = order === 'asc'
      ? (a: Product, b: Product) => a.price - b.price
      : (a: Product, b: Product) => b.price - a.price;

    this.products = [...this.originalProducts].sort(compare);
  }

  // Edit product
  editProduct(productId: number): void {
    if (productId) {
      this.router.navigate(['/add-edit-dlt', productId]);
    }
  }

  // Delete product with confirmation
  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => this.handleDeleteSuccess(productId),
        error: this.handleError,  // Handle errors globally
      });
    }
  }

  // Handle successful deletion of a product
  private handleDeleteSuccess(productId: number): void {
    this.products = this.products.filter((product) => product.id !== productId);
    alert('Product deleted successfully!');
  }

  // Centralized error handling method
  private handleError(error: any): void {
    console.error('Error occurred:', error);
    alert('An error occurred. Please try again later.');
  }
}
