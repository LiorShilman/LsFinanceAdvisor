import { Directive, HostListener, Input } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
        selector: '[numbersOnly]'
})
export class NumbersOnlyDirective {
        @Input('field') field?: string;

        constructor(private ngControl: NgControl) { }

        @HostListener('input', ['$event']) onInput(event: Event): void {
                if (this.field === 'price') {
                        const value = (event.target as HTMLInputElement)?.value ?? '';
                        this.ngControl.control?.setValue(parseFloat(value) || 0);
                        if (value.slice(-1) === '.' && !value.slice(0, -1).includes('.')) {
                                (event.target as HTMLInputElement).value = value;
                        }
                }
        }
}