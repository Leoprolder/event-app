export enum EventType {
  SPORT = 'Sport',
  MUSIC = 'Music',
  OTHER = 'Other',
}

export enum EventTypeRu {
    SPORT = 'Спорт',
    MUSIC = 'Музыка',
    OTHER = 'Другое',
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  type: EventType;
}

export interface SportEvent extends Event {
  type: EventType.SPORT;
  participantsCount: number;
}

export interface MusicEvent extends Event {
  type: EventType.MUSIC;
  genre: string;
}

export type EventItem = Event | SportEvent | MusicEvent;
