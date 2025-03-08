import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Arancel } from '../../interfaces/arancel.interface';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-arancel-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Lista de Aranceles</h2>
      <div *ngIf="loading" class="loading">Cargando aranceles...</div>
      <div *ngIf="error" class="error">
        {{ error }}
        <button class="retry-button" (click)="loadData()">
          <span class="retry-icon">↻</span> Reintentar
        </button>
      </div>
      <div class="table-responsive" *ngIf="!loading && !error && aranceles.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Código Control</th>
              <th>Descripción</th>
              <th>Tasa Valor</th>
              <th>Tasa Especial</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let arancel of aranceles">
              <td>{{arancel.Arc_Codigo}}</td>
              <td>{{arancel.Arc_CodCtrl}}</td>
              <td>{{arancel.Arc_Descrip}}</td>
              <td>{{arancel.Arc_TasaVal}}</td>
              <td>{{arancel.Arc_TasaEsp}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="!loading && !error && aranceles.length === 0" class="no-data">
        No hay aranceles disponibles.
      </div>
      <div class="endpoint-info">
        <div class="endpoint-url">Endpoint: {{ apiUrl }}</div>
        <div class="timeout-info">Tiempo máximo de espera: {{ timeoutSeconds }} segundos</div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .table { width: 100%; margin-top: 20px; }
    .table-responsive { overflow-x: auto; }
    .loading { text-align: center; padding: 20px; }
    .error { 
      color: red; 
      padding: 20px; 
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .no-data { text-align: center; padding: 20px; color: #666; }
    .retry-button {
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .retry-button:hover {
      background-color: #e0e0e0;
    }
    .retry-icon {
      font-size: 1.2em;
    }
    .endpoint-info {
      margin-top: 20px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
      color: #666;
    }
    .endpoint-url, .timeout-info {
      padding: 5px 0;
    }
  `]
})
export class ArancelListComponent implements OnInit {
  aranceles: Arancel[] = [];
  loading = true;
  error: string | null = null;
  apiUrl: string;
  timeoutSeconds: number;

  constructor(
    private apiService: ApiService,
    private routeService: RouteService
  ) {
    this.apiUrl = this.routeService.getFullUrl('ARANCELES');
    this.timeoutSeconds = this.apiService.getTimeoutSeconds();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.error = null;
    try {
      this.aranceles = await this.apiService.getAranceles();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error al cargar los aranceles';
      console.error('Error loading aranceles:', error);
    } finally {
      this.loading = false;
    }
  }
}