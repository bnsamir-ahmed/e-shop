import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from '../services/cart.service';
import { OrderHistoryService } from '../services/order-history.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private orderHistoryService = inject(OrderHistoryService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  // Expose cart service signals
  items = this.cartService.items;
  itemCount = this.cartService.itemCount;
  totalPrice = this.cartService.totalPrice;

  // Shipping form group
  shippingForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]]
  });

  // Payment form group
  paymentForm: FormGroup = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
    expiryDate: ['', [Validators.required, this.expiryDateValidator.bind(this)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
  });

  // Getter for form validity - checks both forms
  get isFormValid(): boolean {
    return this.shippingForm.valid && this.paymentForm.valid;
  }

  // Custom validator for expiry date (MM/YY format)
  private expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    }

    const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDatePattern.test(control.value)) {
      return { invalidFormat: true };
    }

    const [month, year] = control.value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return { expired: true };
    }

    return null;
  }

  onPlaceOrder(): void {
    // Mark all form controls as touched to show validation errors
    Object.keys(this.shippingForm.controls).forEach(key => {
      this.shippingForm.get(key)?.markAsTouched();
    });

    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsTouched();
    });

    if (!this.isFormValid) {
      this.message.warning('Please fill in all required fields correctly.');
      return;
    }

    // Save order to history
    const shippingInfo = {
      fullName: this.shippingForm.value.fullName,
      email: this.shippingForm.value.email,
      address: this.shippingForm.value.address,
      city: this.shippingForm.value.city,
      zipCode: this.shippingForm.value.zipCode
    };

    this.orderHistoryService.addOrder(this.items(), shippingInfo);

    // Show success toast
    this.message.success('Order placed successfully!', {
      nzDuration: 3000
    });

    // Clear the cart
    this.cartService.clearCart();

    // Navigate to home page after a short delay
    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 500);
  }
}

