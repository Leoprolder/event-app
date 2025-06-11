import { Injectable, signal } from '@angular/core';
import { EventItem, EventType, SportEvent, MusicEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly _events = signal<EventItem[]>([
    { id: '1', name: 'Олимпийские игры 2024', description: 'Крупнейшие спортивные соревнования.', location: 'Париж', type: EventType.SPORT, participantsCount: 10000 } as SportEvent,
    { id: '2', name: 'Концерт Rammstein', description: 'Европейский тур 2025.', location: 'Берлин', type: EventType.MUSIC, genre: 'Industrial Metal' } as MusicEvent,
    { id: '3', name: 'IT-конференция "Будущее технологий"', description: 'Обсуждение последних трендов в IT.', location: 'Рига', type: EventType.OTHER },
    { id: '4', name: 'Марафон "Бегущий город"', description: 'Ежегодный городской марафон.', location: 'Москва', type: EventType.SPORT, participantsCount: 5000 } as SportEvent,
  ]);

  readonly events = this._events.asReadonly();

  constructor() { }

  getEventById(id: string): EventItem | undefined {
    return this._events().find(event => event.id === id);
  }

  addEvent(newEvent: Omit<EventItem, 'id'>): void {
    const eventToAdd: EventItem = { ...newEvent, id: this.generateUniqueId() };
    this._events.update(currentEvents => [...currentEvents, eventToAdd]);
    console.log('Мероприятие добавлено:', eventToAdd);
  }

  updateEvent(updatedEvent: EventItem): void {
    this._events.update(currentEvents =>
      currentEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    console.log('Мероприятие обновлено:', updatedEvent);
  }

  deleteEvent(id: string): void {
    this._events.update(currentEvents => currentEvents.filter(event => event.id !== id));
    console.log('Мероприятие удалено с ID:', id);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
