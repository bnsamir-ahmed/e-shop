import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  features = [
    {
      icon: 'shopping',
      title: 'Wide Product Selection',
      description: 'Browse through thousands of products across multiple categories'
    },
    {
      icon: 'safety-certificate',
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with industry-standard security'
    },
    {
      icon: 'car',
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders to you fast'
    },
    {
      icon: 'customer-service',
      title: '24/7 Support',
      description: 'Our customer service team is always here to help you'
    }
  ];

  teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      description: 'Visionary leader with 15+ years in e-commerce'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      description: 'Tech enthusiast driving innovation and excellence'
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Operations',
      description: 'Ensuring smooth operations and customer satisfaction'
    }
  ];
}

