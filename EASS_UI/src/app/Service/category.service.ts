import { inject, Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Define Category interface
export interface Category {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.baseUrl}/categories`;

    constructor() { }

    // Generic HTTP method to handle any API call
    private makeRequest<T>(method: string, url: string, body?: any): Observable<T> {
        switch (method) {
            case 'GET':
                return this.http.get<T>(url);
            case 'POST':
                return this.http.post<T>(url, body);
            case 'PUT':
                return this.http.put<T>(url, body);
            case 'DELETE':
                return this.http.delete<T>(url);
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    }

    // Get all categories method
    getCategory(): Observable<{ categories: Category[]; totalCount: number; currentPage: number }> {
        return this.makeRequest('GET', this.apiUrl);
    }

    // Add new Category
    addCategory(category: Category): Observable<any> {
        return this.makeRequest('POST', this.apiUrl, category);
    }

    // Update existing Category
    updateCategory(id: number, category: Category): Observable<any> {
        return this.makeRequest('PUT', `${this.apiUrl}/${id}`, category);
    }

    // Delete Category
    deleteCategory(id: number): Observable<any> {
        return this.makeRequest('DELETE', `${this.apiUrl}/${id}`);
    }
}
