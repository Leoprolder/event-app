import { Pipe, PipeTransform } from '@angular/core';
import { EventType, EventTypeRu } from '../core/models/event.model';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  transform(value: EventType | null | undefined): string {
    if (!value) {
      return '';
    }
    
    const key = Object.keys(EventType).find(k => EventType[k as keyof typeof EventType] === value);
    if (key && key in EventTypeRu) {
      return EventTypeRu[key as keyof typeof EventTypeRu];
    }
    return '';
  }
}
