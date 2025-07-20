import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { RouteParams, ActionType } from "@core/types";

export interface GoOptions {
  to: {
    resource: string;
    action: ActionType;
    id?: string;
  };
  query?: Record<string, any>;
  type?: "push" | "replace";
  options?: {
    parentResource?: string;
    parentId?: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private router = inject(Router);

  constructor() {}

  go(options: GoOptions): Promise<boolean> {
    const { to, query, type = "push", options: navOptions } = options;
    const url = this.buildUrl(to, navOptions);

    const navigationExtras = {
      queryParams: query,
      replaceUrl: type === "replace",
    };

    return this.router.navigate([url], navigationExtras);
  }

  private buildUrl(
    to: { resource: string; action: ActionType; id?: string },
    options?: { parentResource?: string; parentId?: string },
  ): string {
    const { resource, action, id } = to;
    const { parentResource, parentId } = options || {};

    let url = "";

    if (parentResource && parentId) {
      url += `/${parentResource}/${parentId}`;
    }

    url += `/${resource}`;

    if (action === "create") {
      url += "/create";
    } else if (id) {
      url += `/${id}`;
      if (action === "edit") {
        url += "/edit";
      }
    }

    return url;
  }

  goToList(
    resource: string,
    options?: { parentResource?: string; parentId?: string },
  ): Promise<boolean> {
    return this.go({
      to: { resource, action: "list" },
      options,
    });
  }

  goToShow(
    resource: string,
    id: string,
    options?: { parentResource?: string; parentId?: string },
  ): Promise<boolean> {
    return this.go({
      to: { resource, action: "show", id },
      options,
    });
  }

  goToEdit(
    resource: string,
    id: string,
    options?: { parentResource?: string; parentId?: string },
  ): Promise<boolean> {
    return this.go({
      to: { resource, action: "edit", id },
      options,
    });
  }

  goToCreate(
    resource: string,
    options?: { parentResource?: string; parentId?: string },
  ): Promise<boolean> {
    return this.go({
      to: { resource, action: "create" },
      options,
    });
  }
}
