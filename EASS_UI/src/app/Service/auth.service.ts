import { Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private apiUrl = `${environment.baseUrl}/auth`;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient
  ) {
    const token = this.getAuthToken();
    this.isLoggedInSubject.next(!!token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setLoginStatus(response: { data: { _id: string }; token: string }): void {
    // console.log('Received Token from API:', response.token);
    localStorage.setItem(this.tokenKey, response.token);
    this.isLoggedInSubject.next(true); // Safe now
  }

  loginService(loginData: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  registerService(registerData: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false); // Update login status
  }
}
