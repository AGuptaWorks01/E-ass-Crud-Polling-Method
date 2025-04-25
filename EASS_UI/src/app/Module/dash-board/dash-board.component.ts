import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { ModalService } from '../../Service/modal.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../Environments/environment';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../model/product';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent implements OnInit {
  products: Product[] = []; // Original data
  filteredProducts: Product[] = []; // Filtered list
  selectedProduct: Product | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  private productService = inject(ProductService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.loadProducts(); // Load products on initialization
  }

  // Method to load products for a specific page
  loadProducts(page: number = 1): void {
    this.productService.getProducts(page).subscribe({
      next: (data) => {
        this.products = data.Products;
        this.filteredProducts = data.Products; // Initialize filtered list
        this.totalPages = data.totalCount; // Total pages (assuming `totalCount` represents total products)
        this.currentPage = page; // Set the current page
      },
      error: (err) => {
        this.handleError('Error loading products:', err);
      },
    });
  }

  // Method to handle page change
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return; // Do nothing if the page number is out of bounds
    }
    this.loadProducts(page); // Reload products for the new page
  }

  // Handle image URL construction
  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}/${imagePath}`;
  }

  // Open the modal to view product details
  viewProduct(product: Product): void {
    this.selectedProduct = {
      ...product,
      images: product.images || [], // Ensure images are available
    };
    this.modalService.openModal('productModal');
  }

  // Close the product modal
  closeModal(): void {
    this.modalService.closeModal('productModal');
    this.selectedProduct = null; // Clear the selected product when modal is closed
  }

  // Filter products based on search term
  filterProducts(): void {
    const query = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query)
    );
  }

  // Centralized error handling method
  private handleError(message: string, error: any): void {
    console.error(message, error);
    alert('An error occurred. Please try again later.');
  }
}
