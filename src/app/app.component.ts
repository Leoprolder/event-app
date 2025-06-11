import { Component, signal, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';

import { EventService } from './core/services/event.service';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventItem } from './core/models/event.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    DialogModule,
    RippleModule,
    EventListComponent,
    EventFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Список мероприятий';

  displayEventForm = signal(false);
  currentEvent = signal<EventItem | null>(null);
  events!: Signal<EventItem[]>;

  resetFormTrigger = signal(0);

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events = this.eventService.events;
  }

  openAddEventForm(): void {
    this.currentEvent.set(null);
    this.resetFormTrigger.update(val => val + 1);
    this.displayEventForm.set(true);
  }

  openEditEventForm(event: EventItem): void {
    this.currentEvent.set(event);
    this.resetFormTrigger.set(0);
    this.displayEventForm.set(true);
  }

  closeEventForm(): void {
    this.displayEventForm.set(false);
    this.currentEvent.set(null);
  }

  onEventSaved(eventData: EventItem): void {
    if (this.currentEvent()) {
      this.eventService.updateEvent(eventData);
    } else {
      this.eventService.addEvent(eventData as Omit<EventItem, 'id'>);
    }
    this.closeEventForm();
  }

  onEventDeleted(eventId: string): void {
    if (confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      this.eventService.deleteEvent(eventId);
    }
  }
}
