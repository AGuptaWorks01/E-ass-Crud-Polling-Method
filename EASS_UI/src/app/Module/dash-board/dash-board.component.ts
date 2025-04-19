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
  styleUrl: './dash-board.component.css',
})
export class DashBoardComponent {
  products: any[] = []; // original data
  filteredProducts: any[] = []; // filtered list
  selectedProduct: any = {};
  searchTerm: string = '';

  private productService = inject(ProductService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.Products;
        this.filteredProducts = data.Products; // Initialize filtered list
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
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
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.category_name.toLowerCase().includes(query)
    );
  }
}
