export interface Allergen {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  calories: number;
  allergens: Allergen[];
}

export interface Extra {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CartItemExtra {
  extraId: number;
  extraName: string;
  price: number;
}

export interface LoyaltyTier {
  id?: number;
  name: string;
  discountPercent: number;
  minPoints?: number;
}

export interface LoyaltyAccount {
  points: number;
  loyaltyTier?: LoyaltyTier;
  discountPercent?: number;
  tierName?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
  loyaltyAccount?: LoyaltyAccount;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Card {
  id: number;
  userId: number;
  cardHolder: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CardRequest {
  userId: number;
  cardHolder: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface OrderItemExtraRequest {
  extraId: number;
  extraName: string;
  price: number;
}

export interface AddItemRequest {
  productId: number;
  productName: string;
  price: number;
  extras: OrderItemExtraRequest[];
}

export interface PaymentItemRequest {
  orderItemId: number;
  description: string;
  amount: number;
}

export interface PayRequest {
  orderId: number;
  userId: number;
  cardId: number;
  amount?: number;
  paymentItems: PaymentItemRequest[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  price: number;
  extras?: any[];
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount?: number;
  items?: OrderItem[];
}

export class CartItem {
  constructor(
    public product: Product,
    public extras: CartItemExtra[] = [],
    public quantity: number = 1
  ) {}

  get totalPrice(): number {
    const extrasTotal = this.extras ? this.extras.reduce((sum, e) => sum + Number(e.price), 0) : 0;
    return (Number(this.product.price) + extrasTotal) * this.quantity;
  }
}
