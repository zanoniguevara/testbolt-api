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
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
  });

  private readonly TIMEOUT = 15000; // 15 seconds timeout
  private readonly RETRY_ATTEMPTS = 3; // Increased retry attempts

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
      errorMessage = `Error de red: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = `Error de conexión: No se puede conectar al servidor (${this.routeService.getBaseUrl()}). Por favor, verifique su conexión a internet y que el servidor esté accesible.`;
    } else if (error.status === 404) {
      errorMessage = `Recurso no encontrado: ${resource}`;
    } else if (error.status === 403) {
      errorMessage = `Acceso denegado al recurso: ${resource}`;
    } else if (error.status >= 500) {
      errorMessage = `Error interno del servidor al cargar ${resource}`;
    } else if (error.status === 429) {
      errorMessage = 'Demasiadas solicitudes. Por favor, espere un momento y vuelva a intentar.';
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
            delay: 1000 // Wait 1 second between retries
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
            delay: 1000 // Wait 1 second between retries
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