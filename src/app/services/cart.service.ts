import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product, CartItemExtra } from '../models/potion.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSignal = signal<CartItem[]>(this.loadCartFromStorage());

  totalItems = computed(() => 
    this.cartItemsSignal().reduce((sum, i) => sum + i.quantity, 0)
  );
  
  totalPrice = computed(() => 
    this.cartItemsSignal().reduce((sum, i) => {
      const extrasTotal = i.extras ? i.extras.reduce((s, e) => s + Number(e.price), 0) : 0;
      return sum + (Number(i.product.price) + extrasTotal) * i.quantity;
    }, 0)
  );

  private loadCartFromStorage(): CartItem[] {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];
    
    const rawItems = JSON.parse(stored) as any[];
    return rawItems.map(item => {
      const cartItem = new CartItem(item.product, item.extras);
      cartItem.quantity = item.quantity;
      return cartItem;
    });
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getItems(): CartItem[] {
    return this.cartItemsSignal();
  }

  addItem(product: Product, extras: CartItemExtra[] = []): void {
    const currentItems = [...this.cartItemsSignal()];
    
    const existing = currentItems.find(i =>
      i.product.id === product.id &&
      JSON.stringify(i.extras) === JSON.stringify(extras)
    );

    if (existing) {
      existing.quantity++;
    } else {
      currentItems.push(new CartItem(product, extras));
    }
    
    this.cartItemsSignal.set(currentItems);
    this.saveCartToStorage(currentItems);
  }

  removeItem(index: number): void {
    const currentItems = [...this.cartItemsSignal()];
    currentItems.splice(index, 1);
    
    this.cartItemsSignal.set(currentItems);
    this.saveCartToStorage(currentItems);
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    localStorage.removeItem('cart');
  }
}

