import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { ResourceConfig, ActionType } from '@core/types';

@Injectable({
  providedIn: 'root'
})
export class RefineRouterService {
  generateRoutes(resources: ResourceConfig[]): Route[] {
    const routes: Route[] = [];
    
    for (const resource of resources) {
      routes.push(...this.createResourceRoutes(resource));
      
      if (resource.children) {
        routes.push(...this.createNestedResourceRoutes(resource, resource.children));
      }
    }
    
    return routes;
  }

  private createResourceRoutes(resource: ResourceConfig): Route[] {
    const routes: Route[] = [];
    const basePath = resource.name;

    if (resource.list) {
      // Check if create or edit should be in modal
      const hasModalActions = resource.meta?.createInModal || resource.meta?.editInModal;
      
      if (hasModalActions) {
        // Create nested routes for modal actions
        const children: Route[] = [];
        
        if (resource.create && resource.meta?.createInModal) {
          children.push({
            path: 'create',
            component: resource.create,
            data: { resource: resource.name, action: 'create' as ActionType, modal: true }
          });
        }
        
        if (resource.edit && resource.meta?.editInModal) {
          children.push({
            path: ':id/edit',
            component: resource.edit,
            data: { resource: resource.name, action: 'edit' as ActionType, modal: true }
          });
        }

        routes.push({
          path: basePath,
          component: resource.list,
          data: { resource: resource.name, action: 'list' as ActionType },
          children: children
        });
      } else {
        routes.push({
          path: basePath,
          component: resource.list,
          data: { resource: resource.name, action: 'list' as ActionType }
        });
      }
    }

    if (resource.show) {
      routes.push({
        path: `${basePath}/:id`,
        component: resource.show,
        data: { resource: resource.name, action: 'show' as ActionType }
      });
    }

    // Only create standalone routes if not in modal
    if (resource.edit && !resource.meta?.editInModal) {
      routes.push({
        path: `${basePath}/:id/edit`,
        component: resource.edit,
        data: { resource: resource.name, action: 'edit' as ActionType }
      });
    }

    if (resource.create && !resource.meta?.createInModal) {
      routes.push({
        path: `${basePath}/create`,
        component: resource.create,
        data: { resource: resource.name, action: 'create' as ActionType }
      });
    }

    return routes;
  }

  private createNestedResourceRoutes(parent: ResourceConfig, children: ResourceConfig[]): Route[] {
    const routes: Route[] = [];
    
    for (const child of children) {
      const parentPath = parent.name;
      const childPath = child.name;

      if (child.list) {
        routes.push({
          path: `${parentPath}/:parentId/${childPath}`,
          component: child.list,
          data: { 
            resource: child.name, 
            action: 'list' as ActionType,
            parentResource: parent.name
          }
        });
      }

      if (child.show) {
        routes.push({
          path: `${parentPath}/:parentId/${childPath}/:id`,
          component: child.show,
          data: { 
            resource: child.name, 
            action: 'show' as ActionType,
            parentResource: parent.name
          }
        });
      }

      if (child.edit) {
        routes.push({
          path: `${parentPath}/:parentId/${childPath}/:id/edit`,
          component: child.edit,
          data: { 
            resource: child.name, 
            action: 'edit' as ActionType,
            parentResource: parent.name
          }
        });
      }

      if (child.create) {
        routes.push({
          path: `${parentPath}/:parentId/${childPath}/create`,
          component: child.create,
          data: { 
            resource: child.name, 
            action: 'create' as ActionType,
            parentResource: parent.name
          }
        });
      }

      if (child.children) {
        routes.push(...this.createNestedResourceRoutes(child, child.children));
      }
    }
    
    return routes;
  }
}