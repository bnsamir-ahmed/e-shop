import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ title() }}</h2>
          </div>
          <div class="modal-body">
            <p>{{ message() }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="onCancel()">
              Cancel
            </button>
            <button class="btn btn-primary" (click)="onConfirm()">
              Confirm
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-in-out;
    }

    .modal-content {
      background: #fff;
      border-radius: 8px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-body p {
      margin: 0;
      color: #666;
      font-size: 1rem;
      line-height: 1.5;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: #fff;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: #6c757d;
      color: #fff;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class ConfirmationModalComponent {
  isVisible = signal(false);
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  
  confirmed = output<void>();
  cancelled = output<void>();

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }

  onConfirm(): void {
    this.confirmed.emit();
    this.hide();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.hide();
  }
}

