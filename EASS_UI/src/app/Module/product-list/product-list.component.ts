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
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any = []; // hold orginal data

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }


  getImageUrl(imagePath: string): string {
    return `${environment.baseUrl}/${imagePath}`;
  }


  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.Products; // <-- Assign the fetched products
        console.log("Products loaded:", this.products);
      },
      error: (err) => {
        console.error("Failed to load products", err);
      }
    });
  }


  editProduct(productId: number | undefined): void {
    if (productId !== undefined) {
      this.router.navigate(['/add-edit-dlt', productId]);
      // console.log('Editing Product ID:', productId);
    } else {
      console.error('Product ID is undefined');
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.products = this.products.filter(
            (product: { id: number; }) => product.id !== productId
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
