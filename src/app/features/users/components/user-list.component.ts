import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NavigationService } from '../../../core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSpaceModule,
    NzTagModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="page-header">
      <h2>Users</h2>
      <nz-space>
        <nz-input-group nzSearch nzSize="large" *nzSpaceItem>
          <input 
            type="text" 
            nz-input 
            placeholder="Search users..." 
            [(ngModel)]="searchText"
            (ngModelChange)="onSearch()"
          />
        </nz-input-group>
      </nz-space>
    </div>

    <nz-table 
      #basicTable 
      [nzData]="filteredUsers()" 
      [nzPageSize]="10"
      [nzShowPagination]="true"
      [nzLoading]="loading()"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created At</th>
          <th nzWidth="150px">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (user of basicTable.data; track user.id) {
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <nz-tag [nzColor]="user.status === 'active' ? 'green' : 'red'">
                {{ user.status }}
              </nz-tag>
            </td>
            <td>{{ user.createdAt | date:'short' }}</td>
            <td>
              <nz-space nzSize="small">
                <button *nzSpaceItem nz-button nzSize="small" (click)="viewUser(user.id)">
                  <span nz-icon nzType="eye"></span>
                  View
                </button>
                <button 
                  *nzSpaceItem 
                  nz-button 
                  nzSize="small" 
                  nzDanger
                  nz-popconfirm
                  nzPopconfirmTitle="Are you sure you want to delete this user?"
                  (nzOnConfirm)="deleteUser(user.id)"
                >
                  <span nz-icon nzType="delete"></span>
                  Delete
                </button>
              </nz-space>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
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
  `]
})
export class UserListComponent {
  private navigationService = inject(NavigationService);
  
  loading = signal(false);
  searchText = '';
  
  users = signal<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: new Date('2024-01-10')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: new Date('2024-01-12')
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Author',
      status: 'active',
      createdAt: new Date('2024-01-14')
    },
    {
      id: 4,
      name: 'Alice Wilson',
      email: 'alice.wilson@example.com',
      role: 'Contributor',
      status: 'inactive',
      createdAt: new Date('2024-01-08')
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Subscriber',
      status: 'active',
      createdAt: new Date('2024-01-20')
    }
  ]);

  filteredUsers = signal<User[]>(this.users());

  onSearch() {
    const filtered = this.users().filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.filteredUsers.set(filtered);
  }

  viewUser(id: number) {
    this.navigationService.goToShow('users', id.toString());
  }

  deleteUser(id: number) {
    const currentUsers = this.users();
    const updatedUsers = currentUsers.filter(user => user.id !== id);
    this.users.set(updatedUsers);
    this.onSearch();
  }
}