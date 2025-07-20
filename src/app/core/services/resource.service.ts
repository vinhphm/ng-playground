import { Injectable, signal, computed } from '@angular/core';
import { ResourceConfig } from '@core/types';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private _resources = signal<ResourceConfig[]>([]);

  readonly resources = this._resources.asReadonly();
  readonly flatResources = computed(() => this.flattenResources(this._resources()));

  register(resources: ResourceConfig[]): void {
    this.validateResources(resources);
    this._resources.set(resources);
  }

  getResource(name: string): ResourceConfig | undefined {
    return this.flatResources().find(resource => resource.name === name);
  }

  getAllResources(): ResourceConfig[] {
    return this.flatResources();
  }

  private flattenResources(resources: ResourceConfig[]): ResourceConfig[] {
    const flat: ResourceConfig[] = [];
    
    for (const resource of resources) {
      flat.push(resource);
      if (resource.children) {
        flat.push(...this.flattenResources(resource.children));
      }
    }
    
    return flat;
  }

  private validateResources(resources: ResourceConfig[]): void {
    const names = new Set<string>();
    
    this.collectResourceNames(resources, names);
    
    if (names.size !== this.flattenResources(resources).length) {
      throw new Error('Duplicate resource names found');
    }
  }

  private collectResourceNames(resources: ResourceConfig[], names: Set<string>): void {
    for (const resource of resources) {
      if (names.has(resource.name)) {
        throw new Error(`Duplicate resource name: ${resource.name}`);
      }
      names.add(resource.name);
      
      if (resource.children) {
        this.collectResourceNames(resource.children, names);
      }
    }
  }
}