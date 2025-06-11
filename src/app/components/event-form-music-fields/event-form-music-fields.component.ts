import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-event-form-music-fields',
    standalone: true,
    imports: [
        CommonModule,
        FloatLabel,
        ReactiveFormsModule,
        InputTextModule
    ],
    templateUrl: './event-form-music-fields.component.html',
    styleUrl: './event-form-music-fields.component.scss'
})
export class EventFormMusicFieldsComponent implements OnInit {
    @Input({ required: true }) parentFormGroup!: FormGroup;

    constructor() { }

    ngOnInit(): void {
        if (!this.parentFormGroup.get('genre')) {
            this.parentFormGroup.addControl(
                'genre',
                new FormControl('', Validators.required)
            );
        }
    }


    get genreControl(): FormControl {
        return this.parentFormGroup.get('genre') as FormControl;
    }
}
