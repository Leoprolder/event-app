import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FloatLabel } from 'primeng/floatlabel';

import { EventItem, EventType, SportEvent, MusicEvent, Event, EventTypeRu } from '../../core/models/event.model';

import { EventFormSportFieldsComponent } from '../event-form-sport-fields/event-form-sport-fields.component';
import { EventFormMusicFieldsComponent } from '../event-form-music-fields/event-form-music-fields.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    RippleModule,
    FloatLabel,
    EventFormSportFieldsComponent,
    EventFormMusicFieldsComponent
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() event: EventItem | null = null;
  @Input() resetTrigger!: number;

  @Output() eventSaved = new EventEmitter<EventItem>();
  @Output() cancel = new EventEmitter<void>();

  eventForm!: FormGroup;
  eventTypes = [
    { label: EventTypeRu.SPORT, value: EventType.SPORT },
    { label: EventTypeRu.MUSIC, value: EventType.MUSIC },
    { label: EventTypeRu.OTHER, value: EventType.OTHER }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] || changes['resetTrigger']) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.eventForm) {
      this.eventForm.reset();
      this.removeSpecificControls();
    }

    this.eventForm = this.fb.group({
      id: [this.event?.id || null],
      name: [this.event?.name || '', Validators.required],
      description: [this.event?.description || '', Validators.required],
      location: [this.event?.location || '', Validators.required],
      type: [null, Validators.required]
    });

    if (this.event) {
      this.addSpecificControls(this.event.type);
      if (this.event.type === EventType.SPORT && 'participantsCount' in this.event) {
        this.eventForm.get('participantsCount')?.setValue(this.event.participantsCount);
      } else if (this.event.type === EventType.MUSIC && 'genre' in this.event) {
        this.eventForm.get('genre')?.setValue(this.event.genre);
      }
    } else {
      this.eventForm.get('type')?.setValue(EventType.OTHER);
      this.addSpecificControls(EventType.OTHER);
    }

    this.eventForm.get('type')?.valueChanges.subscribe(type => {
      this.onEventTypeChange(type);
    });
  }


  onEventTypeChange(eventType: EventType): void {
    this.removeSpecificControls();
    this.addSpecificControls(eventType);
    this.eventForm.updateValueAndValidity();
  }

  private addSpecificControls(eventType: EventType): void {
    if (eventType === EventType.SPORT) {
      this.eventForm.addControl('participantsCount', new FormControl(null, [Validators.required, Validators.min(1)]));
    } else if (eventType === EventType.MUSIC) {
      this.eventForm.addControl('genre', new FormControl('', Validators.required));
    }
  }

  private removeSpecificControls(): void {
    if (this.eventForm.get('participantsCount')) {
      this.eventForm.removeControl('participantsCount');
    }
    if (this.eventForm.get('genre')) {
      this.eventForm.removeControl('genre');
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      let savedEvent: EventItem;

      if (formValue.type === EventType.SPORT) {
        savedEvent = {
          id: formValue.id,
          name: formValue.name,
          description: formValue.description,
          location: formValue.location,
          type: EventType.SPORT,
          participantsCount: formValue.participantsCount
        } as SportEvent;
      } else if (formValue.type === EventType.MUSIC) {
        savedEvent = {
          id: formValue.id,
          name: formValue.name,
          description: formValue.description,
          location: formValue.location,
          type: EventType.MUSIC,
          genre: formValue.genre
        } as MusicEvent;
      } else {
        savedEvent = {
          id: formValue.id,
          name: formValue.name,
          description: formValue.description,
          location: formValue.location,
          type: EventType.OTHER
        } as Event;
      }

      this.eventSaved.emit(savedEvent);
    } else {
      this.markAllAsDirty(this.eventForm);
    }
  }

  private markAllAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        this.markAllAsDirty(control);
      }
    });
  }

  onCancel(): void {
    this.eventForm.reset();
    this.cancel.emit();
  }

  get nameControl(): FormControl {
    return this.eventForm.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.eventForm.get('description') as FormControl;
  }

  get locationControl(): FormControl {
    return this.eventForm.get('location') as FormControl;
  }

  get typeControl(): FormControl {
    return this.eventForm.get('type') as FormControl;
  }
}
