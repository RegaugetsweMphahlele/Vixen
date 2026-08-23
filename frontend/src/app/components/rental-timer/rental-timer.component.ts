import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rental } from '../../models/rental.model';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-rental-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded" 
         [ngClass]="isExpired() ? 'bg-danger-subtle' : 'bg-sage-subtle'"
         style="border: 1px solid rgba(255,255,255,0.05);">
      <i class="bi bi-clock" [style.color]="isExpired() ? '#BB5F3A' : '#8B9A82'"></i>
      <span class="font-body fw-semibold" 
            [style.color]="isExpired() ? '#BB5F3A' : '#8B9A82'"
            style="font-size: 0.9rem; font-variant-numeric: tabular-nums;">
        {{ isExpired() ? '⏰ Expired' : timerDisplay }}
      </span>
    </div>
  `,
  styles: [`
    .bg-sage-subtle { background: rgba(139,154,130,0.15); }
    .bg-danger-subtle { background: rgba(187,95,58,0.15); }
  `]
})
export class RentalTimerComponent implements OnInit, OnDestroy {
  @Input() rental!: Rental;
  timerDisplay: string = '';
  private intervalId: any;

  constructor(private rentalService: RentalService) {}

  ngOnInit() {
    if (this.rental) {
      this.updateTimer();
      this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateTimer() {
    if (this.rental) {
      this.timerDisplay = this.rentalService.getRentalTimer(this.rental);
    }
  }

  isExpired(): boolean {
    return this.timerDisplay === 'Expired';
  }
}