import { Component } from '@angular/core';
import { Category, CategoryService } from '../../Service/category.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategory().subscribe((res) => {
      this.categories = res.categories;
    });
  }

  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const { id, name } = this.categoryForm.value;
    const updatedCategory: Category = { id, name };

    if (id) {
      this.categoryService.updateCategory(id, updatedCategory).subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
        this.selectedCategory = null;
      });
    } else {
      this.categoryService.addCategory({
        name,
        id: 0
      }).subscribe(() => {
        this.loadCategories()
        alert("New Category Added")
        this.categoryForm.reset()
      })
    }
  }

  cancelEdit(): void {
    this.selectedCategory = null;
    this.categoryForm.reset();
  }
}
