import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostModalService } from '../services/post-modal.service';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Component({
  selector: 'app-post-edit-route',
  standalone: true,
  template: '',
})
export class PostEditRouteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postModalService = inject(PostModalService);

  private mockPosts: Post[] = [
    {
      id: 1,
      title: 'Getting Started with Angular',
      content: 'Angular is a powerful framework for building dynamic web applications...',
      author: 'John Doe',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Advanced TypeScript Tips',
      content: 'TypeScript brings static typing to JavaScript...',
      author: 'Jane Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Building Reactive Forms',
      content: 'Reactive forms in Angular provide a model-driven approach...',
      author: 'Bob Johnson',
      createdAt: new Date('2024-01-25')
    }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const post = this.mockPosts.find(p => p.id === id);
    
    if (post) {
      // Open the edit modal when this route is activated
      this.postModalService.openEditModal(post);
    } else {
      // Handle case where post is not found
      console.error('Post not found:', id);
    }
  }
}