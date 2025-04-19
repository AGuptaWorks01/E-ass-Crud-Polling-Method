import { Component, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { ModalService } from '../../Service/modal.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../Environments/environment';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css',
})
export class DashBoardComponent {
  products: any[] = []; // hold orginal data
  selectedProduct: any = {};


  private productService = inject(ProductService);
  private modalService = inject(ModalService);


  ngOnInit(): void {
    this.loadProducts();
    // console.log(this.loadProducts);
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.Products; // Extract only the array
        console.log('Products:', this.products);
        console.log("image", data);
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
      images: product.images || []
    };
    this.modalService.openModal('productModal');
  }

  closeModal(): void {
    this.modalService.closeModal('productModal');
  }
}
