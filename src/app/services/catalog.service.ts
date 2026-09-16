import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Extra } from '../models/potion.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private apiUrl = '/catalog-service/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getExtras(): Observable<Extra[]> {
    return this.http.get<Extra[]>(`${this.apiUrl}/extras`);
  }
}