import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private baseUrl = environment.apiUrl;

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getFullUrl(route: keyof typeof ROUTES): string {
    // Ensure proper URL construction without double slashes
    return `${this.baseUrl}/${ROUTES[route]}`.replace(/([^:]\/)\/+/g, "$1");
  }
}