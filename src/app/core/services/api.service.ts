import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface SampleData {
  id: number
  name: string
  department: string
  position: string
  status: 'active' | 'inactive' | 'pending'
  salary: number
  hireDate: string
  email: string
  age: number
  city: string
  country: string
  experience: number
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient)
  private baseUrl = 'https://jsonplaceholder.typicode.com'

  // Posts API
  async getPosts(): Promise<Post[]> {
    const response = await firstValueFrom(
      this.http.get<Post[]>(`${this.baseUrl}/posts`)
    )
    return response
  }

  async getPost(id: number): Promise<Post | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<Post>(`${this.baseUrl}/posts/${id}`)
      )
      return response
    } catch {
      return null
    }
  }

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const response = await firstValueFrom(
      this.http.post<Post>(`${this.baseUrl}/posts`, post)
    )
    return response
  }

  async updatePost(
    id: number,
    updates: Partial<Omit<Post, 'id'>>
  ): Promise<Post | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<Post>(`${this.baseUrl}/posts/${id}`, updates)
      )
      return response
    } catch {
      return null
    }
  }

  async deletePost(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/posts/${id}`))
      return true
    } catch {
      return false
    }
  }

  // Users API
  async getUsers(): Promise<User[]> {
    const response = await firstValueFrom(
      this.http.get<User[]>(`${this.baseUrl}/users`)
    )
    return response
  }

  async getUser(id: number): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<User>(`${this.baseUrl}/users/${id}`)
      )
      return response
    } catch {
      return null
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<User>(`${this.baseUrl}/users`, user)
    )
    return response
  }

  async updateUser(
    id: number,
    updates: Partial<Omit<User, 'id'>>
  ): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<User>(`${this.baseUrl}/users/${id}`, updates)
      )
      return response
    } catch {
      return null
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.baseUrl}/users/${id}`))
      return true
    } catch {
      return false
    }
  }

  // Sample Data API (Mock Data)
  private generateMockSampleData(): SampleData[] {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
    const positions = ['Manager', 'Senior Developer', 'Junior Developer', 'Analyst', 'Director']
    const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending']
    const cities = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin', 'Paris']
    const countries = ['USA', 'UK', 'Japan', 'Germany', 'France', 'Canada']
    const names = [
      'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt',
      'Fiona Davis', 'George Wilson', 'Hannah Lee', 'Ian Malcolm', 'Julia Roberts',
      'Kevin Hart', 'Linda Taylor', 'Michael Scott', 'Nina Patel', 'Oliver Stone',
      'Patricia White', 'Quinn Adams', 'Rachel Green', 'Samuel Jackson', 'Tina Fey',
      'Victor Hugo', 'Wendy Davis', 'Xavier Lewis', 'Yara Martinez', 'Zoe Clark'
    ]

    return names.map((name, index) => ({
      id: index + 1,
      name,
      department: departments[index % departments.length],
      position: positions[index % positions.length],
      status: statuses[index % statuses.length],
      salary: 45000 + (index * 2000) + Math.floor(Math.random() * 20000),
      hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      age: 25 + Math.floor(Math.random() * 35),
      city: cities[index % cities.length],
      country: countries[index % countries.length],
      experience: Math.floor(Math.random() * 15) + 1
    }))
  }

  async getSampleData(): Promise<SampleData[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.generateMockSampleData())
      }, 500)
    })
  }
}
