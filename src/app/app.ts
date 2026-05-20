import { Component } from '@angular/core';
import { MovimentometroComponent } from './components/movimentometro/movimentometro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MovimentometroComponent],
  template: `<app-movimentometro></app-movimentometro>`
})
export class App {}
