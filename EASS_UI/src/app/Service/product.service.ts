import { inject, Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // using http for HTTP Methods
  private http = inject(HttpClient);

  private apiUrl = `${environment.baseUrl}/products`;
  constructor() {}

  // Generic HTTP method to handle any API call
  private makeRequest<T>(
    method: string,
    url: string,
    body?: any
  ): Observable<T> {
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

  // get all product method
  getProducts(): Observable<any> {
    return this.makeRequest('GET', this.apiUrl);
  }

  // get by id each product
  getProductById(id: number): Observable<any> {
    return this.makeRequest('GET', `${this.apiUrl}/${id}`);
  }

  // for adding new product
  addProduct(product: any): Observable<any> {
    return this.makeRequest('POST', this.apiUrl, product);
  }

  // for updating existing product
  updateProduct(id: number, product: any): Observable<any> {
    return this.makeRequest('PUT', `${this.apiUrl}/${id}`, product);
  }

  // delete product mehtod
  deleteProduct(id: number): Observable<any> {
    return this.makeRequest('DELETE', `${this.apiUrl}/${id}`);
  }
}
