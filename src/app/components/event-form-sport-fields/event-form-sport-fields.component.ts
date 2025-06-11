import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
    selector: 'app-event-form-sport-fields',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputNumberModule,
        FloatLabel
    ],
    templateUrl: './event-form-sport-fields.component.html',
    styleUrl: './event-form-sport-fields.component.scss'
})
export class EventFormSportFieldsComponent implements OnInit {
    @Input({ required: true }) parentFormGroup!: FormGroup;

    constructor() { }

    ngOnInit(): void {
        if (!this.parentFormGroup.get('participantsCount')) {
            this.parentFormGroup.addControl(
                'participantsCount',
                new FormControl(null, [Validators.required, Validators.min(1)])
            );
        }
    }

    get participantsCountControl(): FormControl {
        return this.parentFormGroup.get('participantsCount') as FormControl;
    }
}
