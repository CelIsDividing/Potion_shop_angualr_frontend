import { Component, input, output, OnInit } from '@angular/core';
import { Product } from '../models/potion.model';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css'
})
export class ProductItem implements OnInit {
  product = input.required<Product>();
  index = input<number>(0);
  addToCartEvent = output<Product>();

  ngOnInit(): void {}

  get hasAllergens(): boolean {
    const allergens = this.product()?.allergens;
    return !!(allergens && allergens.length > 0);
  }

  get allergenCount(): number {
    return this.product()?.allergens?.length || 0;
  }

  get productClasses(): { [key: string]: boolean } {
    return {
      'product-card': true,
      'card-has-allergens': this.hasAllergens,
      'card-allergen-free': !this.hasAllergens,
      'card-special': (this.product()?.price || 0) >= 300
    };
  }

  onAdd(): void {
    console.log('Product item clicked for:', this.product().name);
    this.addToCartEvent.emit(this.product());
  }
}

