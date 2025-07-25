import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NavigationService, ApiService } from "@core";
import {
  injectQuery,
  injectMutation,
} from "@tanstack/angular-query-experimental";
import type { Post } from "@core";
import { PostListComponent } from "@app/features/posts/components/post-list/post-list.component";

@Component({
  selector: "app-post-list-container",
  standalone: true,
  imports: [CommonModule, RouterOutlet, PostListComponent],
  template: `
    <app-post-list
      [posts]="filteredPosts()"
      [loading]="loading()"
      [searchText]="searchText"
      (searchTextChange)="onSearchTextChange($event)"
      (viewPost)="viewPost($event)"
      (editPost)="editPost($event)"
      (createPost)="createPost()"
      (deletePost)="deletePost($event)"
    />

    <!-- Modal outlet for create/edit forms -->
    <router-outlet></router-outlet>
  `,
})
export class PostListContainerComponent {
  private navigationService = inject(NavigationService);
  private apiService = inject(ApiService);

  searchText = "";

  postsQuery = injectQuery(() => ({
    queryKey: ["posts"],
    queryFn: () => this.apiService.getPosts(),
  }));

  deleteMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.apiService.deletePost(id),
    onSuccess: () => {
      this.postsQuery.refetch();
    },
  }));

  filteredPosts = computed(() => {
    const posts = this.postsQuery.data() || [];
    if (!this.searchText) return posts;

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.body.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  });

  loading = computed(
    () => this.postsQuery.isPending() || this.deleteMutation.isPending(),
  );

  onSearchTextChange(searchText: string) {
    this.searchText = searchText;
  }

  viewPost(id: number) {
    this.navigationService.goToShow("posts", id.toString());
  }

  editPost(id: number) {
    this.navigationService.goToEdit("posts", id.toString());
  }

  createPost() {
    this.navigationService.goToCreate("posts");
  }

  deletePost(id: number) {
    this.deleteMutation.mutate(id);
  }
}
