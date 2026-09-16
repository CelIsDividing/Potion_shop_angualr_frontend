import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CatalogService } from '../services/catalog.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/potion.model';
import { ProductItem } from '../product-item/product-item';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductItem, CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;
  selectedFilter: 'all' | 'safe' | 'allergens' = 'all';

  constructor(
    private catalogService: CatalogService,
    public cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.catalogService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredProducts(): Product[] {
    if (this.selectedFilter === 'safe') {
      return this.products.filter(p => !p.allergens || p.allergens.length === 0);
    }
    if (this.selectedFilter === 'allergens') {
      return this.products.filter(p => p.allergens && p.allergens.length > 0);
    }
    return this.products;
  }

  get safeCount(): number {
    return this.products.filter(p => !p.allergens || p.allergens.length === 0).length;
  }

  get allergenCount(): number {
    return this.products.filter(p => p.allergens && p.allergens.length > 0).length;
  }

  onAddToCart(product: Product): void {
    console.log('Product list received add to cart event for:', product.name);
    this.cartService.addItem(product);
    this.cdr.detectChanges();
  }
}

