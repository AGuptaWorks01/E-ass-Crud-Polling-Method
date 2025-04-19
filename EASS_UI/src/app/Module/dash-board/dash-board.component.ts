import { Component, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { ModalService } from '../../Service/modal.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../Environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent {
  products: any[] = []; // Original data
  filteredProducts: any[] = []; // Filtered list
  selectedProduct: any = {};
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;

  private productService = inject(ProductService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products for a specific page
  loadProducts(page: number = 1): void {
    this.productService.getProducts(page).subscribe({
      next: (data) => {
        this.products = data.Products;
        this.filteredProducts = data.Products; // Initialize filtered list
        this.totalPages = data.totalCount;  // Assuming totalCount is the number of pages
        this.currentPage = page; // Set the current page
      },
      error: (err) => {
        console.error('Error loading products:', err);
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

  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}/${imagePath}`;
  }

  viewProduct(product: any): void {
    this.selectedProduct = {
      ...product,
      images: product.images || [],
    };
    this.modalService.openModal('productModal');
  }

  closeModal(): void {
    this.modalService.closeModal('productModal');
  }

  filterProducts(): void {
    const query = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query)
    );
  }
}
