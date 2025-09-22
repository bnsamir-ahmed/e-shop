import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [
    RouterModule,
    NzMenuModule,
    NzDropDownModule,
    NzBadgeModule,
    NzIconModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private cartService = inject(CartService);

  // Use the cart service's computed signal for real-time updates
  cartCount = this.cartService.itemCount;
}
