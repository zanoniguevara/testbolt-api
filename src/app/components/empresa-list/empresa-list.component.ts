import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Empresa } from '../../interfaces/empresa.interface';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {
  empresas: Empresa[] = [];
  loading = true;
  error: string | null = null;
  apiUrl: string;
  timeoutSeconds: number;
  displayedColumns: string[] = ['codigo', 'nombre', 'rifCi', 'contacto', 'telefono', 'correo'];

  @ViewChild(MatTable) table!: MatTable<Empresa>;

  constructor(
    private apiService: ApiService,
    private routeService: RouteService
  ) {
    this.apiUrl = this.routeService.getFullUrl('EMPRESAS');
    this.timeoutSeconds = this.apiService.getTimeoutSeconds();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.error = null;
    try {
      this.empresas = await this.apiService.getEmpresas();
      if (this.table) {
        this.table.renderRows();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Error al cargar las empresas';
      console.error('Error loading empresas:', error);
    } finally {
      this.loading = false;
    }
  }
}