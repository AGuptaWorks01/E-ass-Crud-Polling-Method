import { Component, inject } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category, CategoryService } from '../../Service/category.service';

@Component({
  selector: 'app-add-edit-dlt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-dlt.component.html',
  styleUrl: './add-edit-dlt.component.css'
})
export class AddEditDltComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  productId: number | null = null;
  productForm: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  categories: Category[] = [];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      images: [null],
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Load categories dynamically

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategory().subscribe((res) => {
      this.categories = res.categories;
      console.log("Category List", this.categories);
    });
  }

  loadProductData(id: number): void {
    this.productService.getProductById(id).subscribe((data) => {
      this.productForm.patchValue({
        name: data.name,
        price: data.price,
        category: data.category, // Assumes 'category' is ID or name returned from backend
      });
    });
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const files = input?.files;

    if (files) {
      this.selectedFiles = Array.from(files);
      this.imagePreviews = [];

      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value.toString());
    formData.append('category_id', this.productForm.get('category')?.value);

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    return formData;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = this.prepareFormData();
    console.log("add form data", formData);

    if (this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe(
        () => {
          alert('Product updated successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.log("Error", error);
          alert('An error occurred while updating the product');
        }
      );
    } else {
      this.productService.addProduct(formData).subscribe(
        () => {
          alert('Product added successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          alert('An error occurred while adding the product');
        })
    }
  }

  closeModal(): void {
    this.router.navigate(['/']);
  }
}
