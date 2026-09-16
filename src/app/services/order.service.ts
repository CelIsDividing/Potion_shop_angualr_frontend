import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, AddItemRequest } from '../models/potion.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = '/order-service/api/orders';

  constructor(private http: HttpClient) {}

  getOrCreateDraft(userId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/user/${userId}/draft`, {});
  }

  addItem(orderId: number, item: AddItemRequest): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${orderId}/items`, item);
  }

  markAsPaid(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/pay`, {});
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }
}
