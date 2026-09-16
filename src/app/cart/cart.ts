import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
import { Card, CardRequest, PayRequest, PaymentItemRequest, AddItemRequest } from '../models/potion.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  showPaymentModal = false;
  isLoadingCards = false;
  isProcessing = false;
  paymentSuccess = false;
  paymentError = '';
  completedOrderId: number | null = null;

  savedCards: Card[] = [];
  selectedCardMode: 'existing' | 'new' = 'new';
  selectedCardId: number | null = null;

  cardForm: FormGroup;
  months: { value: number; label: string }[] = [];
  years: number[] = [];

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    this.months = [
      { value: 1, label: '01 - Jan' }, { value: 2, label: '02 - Feb' },
      { value: 3, label: '03 - Mar' }, { value: 4, label: '04 - Apr' },
      { value: 5, label: '05 - May' }, { value: 6, label: '06 - Jun' },
      { value: 7, label: '07 - Jul' }, { value: 8, label: '08 - Aug' },
      { value: 9, label: '09 - Sep' }, { value: 10, label: '10 - Oct' },
      { value: 11, label: '11 - Nov' }, { value: 12, label: '12 - Dec' }
    ];

    for (let y = currentYear; y <= currentYear + 12; y++) {
      this.years.push(y);
    }

    this.cardForm = this.fb.group({
      cardHolder: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: [currentMonth, [Validators.required, Validators.min(1), Validators.max(12)]],
      expiryYear: [currentYear, [Validators.required, Validators.min(currentYear)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {}

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  get subtotal(): number {
    return this.cartService.totalPrice();
  }

  get discountPercent(): number {
    const user = this.authService.getCurrentUser();
    if (!user || !user.loyaltyAccount) return 0;
    return Number(user.loyaltyAccount.loyaltyTier?.discountPercent || user.loyaltyAccount.discountPercent || 0);
  }

  get discountAmount(): number {
    return (this.subtotal * this.discountPercent) / 100;
  }

  get finalTotal(): number {
    return Math.max(0, this.subtotal - this.discountAmount);
  }

  get loyaltyTierName(): string {
    const user = this.authService.getCurrentUser();
    return user?.loyaltyAccount?.loyaltyTier?.name || user?.loyaltyAccount?.tierName || 'BRONZE';
  }

  get earnedPoints(): number {
    return Math.floor(this.subtotal * 0.10);
  }

  openPaymentModal(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.showPaymentModal = true;
    this.paymentSuccess = false;
    this.paymentError = '';
    this.completedOrderId = null;
    this.isLoadingCards = true;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    this.cardForm.reset({
      cardHolder: user.name || '',
      cardNumber: '',
      expiryMonth: currentMonth,
      expiryYear: currentYear,
      cvv: ''
    });

    this.paymentService.getCardsByUser(user.id).subscribe({
      next: (cards) => {
        this.savedCards = cards || [];
        this.isLoadingCards = false;
        if (this.savedCards.length > 0) {
          this.selectedCardMode = 'existing';
          this.selectedCardId = this.savedCards[0].id;
        } else {
          this.selectedCardMode = 'new';
          this.selectedCardId = null;
        }
      },
      error: () => {
        this.savedCards = [];
        this.isLoadingCards = false;
        this.selectedCardMode = 'new';
        this.selectedCardId = null;
      }
    });
  }

  closePaymentModal(): void {
    if (this.isProcessing) return;
    this.showPaymentModal = false;
    this.paymentError = '';
  }

  selectExistingCard(cardId: number): void {
    this.selectedCardMode = 'existing';
    this.selectedCardId = cardId;
  }

  switchToNewCard(): void {
    this.selectedCardMode = 'new';
    this.selectedCardId = null;
  }

  deleteCard(event: MouseEvent, cardId: number): void {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this card?')) return;
    this.paymentService.deleteCard(cardId).subscribe({
      next: () => {
        this.savedCards = this.savedCards.filter(c => c.id !== cardId);
        if (this.selectedCardId === cardId) {
          if (this.savedCards.length > 0) {
            this.selectedCardId = this.savedCards[0].id;
          } else {
            this.selectedCardMode = 'new';
            this.selectedCardId = null;
          }
        }
      }
    });
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 16);
    this.cardForm.get('cardNumber')?.setValue(clean, { emitEvent: false });
  }

  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 4);
    this.cardForm.get('cvv')?.setValue(clean, { emitEvent: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.cardForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async confirmPayment(): Promise<void> {
    this.paymentError = '';
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.paymentError = 'You must be logged in.';
      return;
    }

    if (this.cartService.getItems().length === 0) {
      this.paymentError = 'Cart is empty.';
      return;
    }

    let activeCardId: number;

    if (this.selectedCardMode === 'new') {
      this.cardForm.markAllAsTouched();
      if (this.cardForm.invalid) {
        this.paymentError = 'Please enter valid card details.';
        return;
      }

      this.isProcessing = true;
      try {
        const rawNum = this.cardForm.value.cardNumber.trim();
        const cardReq: CardRequest = {
          userId: user.id,
          cardHolder: this.cardForm.value.cardHolder.trim(),
          lastFourDigits: rawNum.slice(-4),
          expiryMonth: Number(this.cardForm.value.expiryMonth),
          expiryYear: Number(this.cardForm.value.expiryYear)
        };
        const createdCard = await firstValueFrom(this.paymentService.createCard(cardReq));
        activeCardId = createdCard.id;
      } catch (err: any) {
        this.isProcessing = false;
        this.paymentError = 'Error saving card: ' + (err?.error?.message || err?.message || 'Error');
        return;
      }
    } else {
      if (!this.selectedCardId) {
        this.paymentError = 'Please select a payment card.';
        return;
      }
      activeCardId = this.selectedCardId;
      this.isProcessing = true;
    }

    try {
      const draftOrder = await firstValueFrom(this.orderService.getOrCreateDraft(user.id));
      const orderId = draftOrder.id;

      const cartItems = this.cartService.getItems();
      for (const item of cartItems) {
        const itemExtras = (item.extras || []).map(e => ({
          extraId: e.extraId,
          extraName: e.extraName,
          price: e.price
        }));
        const addItemReq: AddItemRequest = {
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          extras: itemExtras
        };
        for (let q = 0; q < item.quantity; q++) {
          await firstValueFrom(this.orderService.addItem(orderId, addItemReq));
        }
      }

      const paidOrder = await firstValueFrom(this.orderService.markAsPaid(orderId));

      const paymentItems: PaymentItemRequest[] = [];
      for (const item of cartItems) {
        for (let q = 0; q < item.quantity; q++) {
          paymentItems.push({
            orderItemId: 0,
            description: item.product.name,
            amount: Number(item.product.price)
          });
          for (const extra of (item.extras || [])) {
            paymentItems.push({
              orderItemId: 0,
              description: `${item.product.name} - ${extra.extraName}`,
              amount: Number(extra.price)
            });
          }
        }
      }

      const payReq: PayRequest = {
        orderId: paidOrder.id,
        userId: user.id,
        cardId: activeCardId,
        amount: Number(this.finalTotal.toFixed(2)),
        paymentItems: paymentItems
      };

      await firstValueFrom(this.paymentService.pay(payReq));

      try {
        await firstValueFrom(this.authService.addLoyaltyPoints(user.id, this.subtotal));
      } catch (e) {}

      this.cartService.clearCart();
      this.completedOrderId = paidOrder.id;
      this.paymentSuccess = true;
      this.isProcessing = false;
    } catch (err: any) {
      this.isProcessing = false;
      this.paymentError = err?.error?.message || err?.message || 'An error occurred while processing your payment.';
    }
  }
}
