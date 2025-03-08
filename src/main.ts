import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EmpresaListComponent } from './app/components/empresa-list/empresa-list.component';
import { ArancelListComponent } from './app/components/arancel-list/arancel-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmpresaListComponent, ArancelListComponent],
  template: `
    <div class="app-container">
      <h1>Sistema de Gestión</h1>
      <app-empresa-list></app-empresa-list>
      <app-arancel-list></app-arancel-list>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
  `]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch())
  ]
}).catch(err => console.error(err));