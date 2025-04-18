import { Component, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css',
})
export class DashBoardComponent {
  private productService = inject(ProductService);

  products: any[] = [];

  ngOnInit(): void {
    this.loadProducts();
    console.log(this.loadProducts);
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.Products; // 👈 Extract only the array
        console.log('Products:', this.products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }
}
