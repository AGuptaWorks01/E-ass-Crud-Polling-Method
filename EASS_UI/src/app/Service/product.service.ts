import { inject, Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/products`;
  private reportUrl = `${environment.baseUrl}/products/report/download`;

  constructor() { }

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

  // Get all products
  getProducts(): Observable<any> {
    return this.makeRequest('GET', this.apiUrl);
  }

  getProductById(id: number): Observable<any> {
    return this.makeRequest('GET', `${this.apiUrl}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.makeRequest('POST', this.apiUrl, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.makeRequest('PUT', `${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.makeRequest('DELETE', `${this.apiUrl}/${id}`);
  }

  // Report Download Method
  downloadReport(format: 'csv' | 'xlsx'): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      ...(token && { Authorization: `Bearer ${token}` })
    });

    return this.http.get(`${this.reportUrl}?format=${format}`, {
      headers: headers,
      responseType: 'blob',
    });
  }
}
