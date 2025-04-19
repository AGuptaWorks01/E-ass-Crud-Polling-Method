import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Service/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  productService = inject(ProductService);
  // isNavbarOpen = false; // Track whether the navbar is open or closed
  isLoggedIn = false; // Track login status
  private loginStatusSub: Subscription = new Subscription(); // Subscription to login status

  constructor() { }

  ngOnInit() {
    this.loginStatusSub = this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy() {
    this.loginStatusSub.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }


  downloadReportFromService(format: 'csv' | 'xlsx') {
    this.productService.downloadReport(format).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_report.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download error', err);
        alert('Failed to download the report');
      }
    });
  }


}
