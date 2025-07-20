import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NavigationService } from '../../../core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  bio?: string;
  phone?: string;
  location?: string;
}

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzCardModule,
    NzDividerModule,
    NzTagModule,
    NzDescriptionsModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="page-header">
      <h2>User Details</h2>
      <nz-space>
        <button *nzSpaceItem nz-button (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          Back to Users
        </button>
        @if (user()) {
          <button 
            *nzSpaceItem 
            nz-button 
            nzDanger
            nz-popconfirm
            nzPopconfirmTitle="Are you sure you want to delete this user?"
            (nzOnConfirm)="deleteUser()"
          >
            <span nz-icon nzType="delete"></span>
            Delete
          </button>
        }
      </nz-space>
    </div>

    @if (user(); as currentUser) {
      <nz-card [nzTitle]="currentUser.name">
        <nz-descriptions nzBordered [nzColumn]="2">
          <nz-descriptions-item nzTitle="User ID">{{ currentUser.id }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Status">
            <nz-tag [nzColor]="currentUser.status === 'active' ? 'green' : 'red'">
              {{ currentUser.status }}
            </nz-tag>
          </nz-descriptions-item>
          
          <nz-descriptions-item nzTitle="Email">{{ currentUser.email }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Role">{{ currentUser.role }}</nz-descriptions-item>
          
          @if (currentUser.phone) {
            <nz-descriptions-item nzTitle="Phone">{{ currentUser.phone }}</nz-descriptions-item>
          }
          @if (currentUser.location) {
            <nz-descriptions-item nzTitle="Location">{{ currentUser.location }}</nz-descriptions-item>
          }
          
          <nz-descriptions-item nzTitle="Created At" [nzSpan]="2">
            {{ currentUser.createdAt | date:'full' }}
          </nz-descriptions-item>
          
          @if (currentUser.bio) {
            <nz-descriptions-item nzTitle="Bio" [nzSpan]="2">
              {{ currentUser.bio }}
            </nz-descriptions-item>
          }
        </nz-descriptions>

      <nz-divider></nz-divider>

      <div class="user-actions">
        <h3>Quick Actions</h3>
        <nz-space>
          <button *nzSpaceItem nz-button nzType="default" disabled>
            <span nz-icon nzType="mail"></span>
            Send Email
          </button>
          <button *nzSpaceItem nz-button nzType="default" disabled>
            <span nz-icon nzType="edit"></span>
            Edit Profile
          </button>
          <button *nzSpaceItem nz-button nzType="default" disabled>
            <span nz-icon nzType="setting"></span>
            Manage Permissions
          </button>
        </nz-space>
      </div>
      </nz-card>
    } @else {
      <nz-card nzTitle="User Not Found">
        <p>The requested user could not be found.</p>
        <button nz-button nzType="primary" (click)="goBack()">
          Back to Users
        </button>
      </nz-card>
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .page-header h2 {
      margin: 0;
    }

    .user-actions {
      margin-top: 16px;
    }

    .user-actions h3 {
      margin-bottom: 12px;
    }
  `]
})
export class UserShowComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  
  user = signal<User | null>(null);
  
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2024-01-10'),
      bio: 'System administrator with 5+ years of experience in managing web applications and user permissions.',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: new Date('2024-01-12'),
      bio: 'Content editor specializing in technical documentation and user guides.',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Author',
      status: 'active',
      createdAt: new Date('2024-01-14'),
      bio: 'Technical writer and blogger with expertise in Angular and TypeScript.',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX'
    },
    {
      id: 4,
      name: 'Alice Wilson',
      email: 'alice.wilson@example.com',
      role: 'Contributor',
      status: 'inactive',
      createdAt: new Date('2024-01-08'),
      bio: 'Part-time contributor focusing on community engagement and feedback collection.',
      location: 'Seattle, WA'
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Subscriber',
      status: 'active',
      createdAt: new Date('2024-01-20'),
      bio: 'New subscriber interested in learning more about modern web development.',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL'
    }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const foundUser = this.mockUsers.find(user => user.id === id);
    this.user.set(foundUser || null);
  }

  goBack() {
    this.navigationService.goToList('users');
  }

  deleteUser() {
    this.goBack();
  }
}