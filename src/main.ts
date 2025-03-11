import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EmpresaListComponent } from './app/components/empresa-list/empresa-list.component';
import { ArancelListComponent } from './app/components/arancel-list/arancel-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    EmpresaListComponent,
    ArancelListComponent,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Sistema de Gestión</span>
    </mat-toolbar>
    
    <div class="app-container">
      <app-empresa-list></app-empresa-list>
      <app-arancel-list></app-arancel-list>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }
    
    @media (max-width: 600px) {
      .app-container {
        padding: 8px;
      }
    }
  `]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
}).catch(err => console.error(err));