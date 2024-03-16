import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ranked',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule,],
  templateUrl: './ranked.component.html',
  styleUrl: './ranked.component.scss'
})
export class RankedComponent {

}
