import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CardRequest, PayRequest } from '../models/potion.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = '/payment-service/api/payments';

  constructor(private http: HttpClient) {}

  getCardsByUser(userId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards/user/${userId}`);
  }

  createCard(card: CardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards`, card);
  }

  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${cardId}`);
  }

  pay(request: PayRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pay`, request);
  }
}
