import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/potion.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials: LoginRequest = { email: '', password: '' };
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  fillTestUser(email: string): void {
    this.credentials.email = email;
    this.credentials.password = '123';
    this.error = '';
  }

  onSubmit(): void {
    this.error = '';
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Invalid email or password. Please try again.';
      }
    });
  }
}
