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
}
