import { Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$: any;
  setLoginStatus(res: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.baseUrl}/auth`;

  private tokenKey = 'auth_token';

  // isLoggedIn$: any;
  // isLoggedInSubject: any;

  constructor(private http: HttpClient) {}

  // Get the authentication token from localStorage
  getAuthToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    // console.log("Fetched Token:", token); // Debugging
    return token;
  }

  // Add the token to request headers for authenticated requests
  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Check if user is logged in by checking if the token exists
  // private checkLoginStatus(): boolean {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     return !!localStorage.getItem(this.tokenKey); // Returns true if token is present
  //   }
  //   return false;
  // }

  // Login method to authenticate the user
  loginService(loginData: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  // Register method to create a new user
  registerService(registerData: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  // Logout method to remove the user data from localStorage
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      // this.isLoggedInSubject.next(false); // Update login status to false
    }
  }
}
