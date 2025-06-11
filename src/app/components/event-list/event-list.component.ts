import { Component, Input, Output, EventEmitter, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';

import { EventItem, EventType } from '../../core/models/event.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    RippleModule,
    TranslatePipe
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent {
  @Input({ required: true }) events!: Signal<EventItem[]>;
  @Output() editEvent = new EventEmitter<EventItem>();
  @Output() deleteEvent = new EventEmitter<string>();

  cols = [
    { field: 'name', header: 'Название' },
    { field: 'description', header: 'Описание' },
    { field: 'location', header: 'Место проведения' },
    { field: 'type', header: 'Тип' }
  ];

  constructor() { }

  onEdit(event: EventItem): void {
    this.editEvent.emit(event);
  }

  onDelete(eventId: string): void {
    this.deleteEvent.emit(eventId);
  }

  getSpecificData(event: EventItem): string {
    switch (event.type) {
      case EventType.SPORT:
        return `Участники: ${(event as any).participantsCount || 'N/A'}`;
      case EventType.MUSIC:
        return `Жанр: ${(event as any).genre || 'N/A'}`;
      default:
        return '';
    }
  }
}
