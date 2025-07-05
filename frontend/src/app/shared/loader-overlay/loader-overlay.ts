import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader-overlay',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loader-overlay.html',
  styleUrl: './loader-overlay.scss'
})
export class LoaderOverlay {
  @Input() loading: boolean = false;
  @Input() text: string = 'Processing...'

  
}
