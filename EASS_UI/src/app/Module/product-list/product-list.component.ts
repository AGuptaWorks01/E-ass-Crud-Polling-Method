import { Component, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../Environments/environment';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: any = []; // hold original data
  currentPage: number = 1; // Current page number
  totalPages: number = 1; // Total number of pages
  pageSize: number = 10; // Number of items per page
  originalProducts: any = []; // To hold the original fetched products for sorting

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProducts(this.currentPage); // Load products for the first page
  }

  // Method to fetch products with pagination
  loadProducts(page: number): void {
    this.productService.getProducts(page).subscribe({
      next: (data) => {
        this.products = data.Products; // <-- Assign the fetched products
        this.originalProducts = [...this.products]; // Keep a copy for sorting
        this.totalPages = data.totalCount; // Assuming totalCount is the total number of products
        this.currentPage = page; // Update the current page
        // console.log('Products loaded:', this.products);
      },
      error: (err) => {
        console.error('Failed to load products', err);
      },
    });
  }

  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}/${imagePath}`;
  }

  // Handle page change
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return; // Do nothing if the page number is out of bounds
    }
    this.loadProducts(page); // Reload products for the new page
  }


  // Sorting products by price (ascending or descending)
  sortByPrice(order: 'asc' | 'desc'): void {
    if (order === 'asc') {
      this.products = [...this.originalProducts].sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
      this.products = [...this.originalProducts].sort((a, b) => b.price - a.price);
    }
  }
  

  editProduct(productId: number | undefined): void {
    if (productId !== undefined) {
      this.router.navigate(['/add-edit-dlt', productId]);
    } else {
      console.error('Product ID is undefined');
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter(
            (product: { id: number }) => product.id !== productId
          );
          alert('Product deleted successfully!');
        },
        (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete the product.');
        }
      );
    }
  }
}
