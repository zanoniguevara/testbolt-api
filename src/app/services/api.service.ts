import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, timeout, retry } from 'rxjs';
import { Empresa } from '../interfaces/empresa.interface';
import { Arancel } from '../interfaces/arancel.interface';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private readonly TIMEOUT = 30000; // Increased timeout to 30 seconds
  private readonly RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds between retries

  constructor(
    private http: HttpClient,
    private routeService: RouteService
  ) {}

  getTimeoutSeconds(): number {
    return this.TIMEOUT / 1000;
  }

  private handleError(error: HttpErrorResponse, resource: string): never {
    let errorMessage = `Error al cargar ${resource}`;
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = `Error de conexión: No se puede conectar al servidor (${this.routeService.getBaseUrl()}). Verifique su conexión a internet y que el servidor esté accesible.`;
          break;
        case 404:
          errorMessage = `No se encontró el recurso: ${resource}`;
          break;
        case 403:
          errorMessage = `Acceso denegado al recurso: ${resource}`;
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Por favor, espere un momento y vuelva a intentar.';
          break;
        case 500:
        case 501:
        case 502:
        case 503:
          errorMessage = `Error del servidor (${error.status}): El servidor no está disponible temporalmente`;
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage, error);
    throw new Error(errorMessage);
  }

  async getEmpresas(): Promise<Empresa[]> {
    try {
      const url = this.routeService.getFullUrl('EMPRESAS');
      const response = await firstValueFrom(
        this.http.get<Empresa[]>(url, {
          headers: this.headers,
          withCredentials: false
        }).pipe(
          retry({
            count: this.RETRY_ATTEMPTS,
            delay: this.RETRY_DELAY,
            resetOnSuccess: true
          }),
          timeout(this.TIMEOUT),
          catchError((error: HttpErrorResponse) => {
            throw this.handleError(error, 'empresas');
          })
        )
      );
      
      if (!Array.isArray(response)) {
        throw new Error('Formato de respuesta inválido para empresas');
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al obtener empresas');
    }
  }

  async getAranceles(): Promise<Arancel[]> {
    try {
      const url = this.routeService.getFullUrl('ARANCELES');
      const response = await firstValueFrom(
        this.http.get<Arancel[]>(url, {
          headers: this.headers,
          withCredentials: false
        }).pipe(
          retry({
            count: this.RETRY_ATTEMPTS,
            delay: this.RETRY_DELAY,
            resetOnSuccess: true
          }),
          timeout(this.TIMEOUT),
          catchError((error: HttpErrorResponse) => {
            throw this.handleError(error, 'aranceles');
          })
        )
      );
      
      if (!Array.isArray(response)) {
        throw new Error('Formato de respuesta inválido para aranceles');
      }
      
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al obtener aranceles');
    }
  }
}