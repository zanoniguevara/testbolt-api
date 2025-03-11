import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Arancel } from '../../interfaces/arancel.interface';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-arancel-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './arancel-list.component.html',
  styleUrls: ['./arancel-list.component.scss']
})
export class ArancelListComponent implements OnInit {
  aranceles: Arancel[] = [];
  loading = true;
  error: string | null = null;
  apiUrl: string;
  timeoutSeconds: number;
  displayedColumns: string[] = ['codigo', 'codigoControl', 'descripcion', 'tasaValor', 'tasaEspecial'];

  @ViewChild(MatTable) table!: MatTable<Arancel>;

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
      if (this.table) {
        this.table.renderRows();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error al cargar los aranceles';
      console.error('Error loading aranceles:', error);
    } finally {
      this.loading = false;
    }
  }
}