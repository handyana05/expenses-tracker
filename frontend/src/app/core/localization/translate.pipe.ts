import { Pipe, PipeTransform, inject } from '@angular/core';
import { Localization } from './localization';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly localization = inject(Localization);
  transform(text: string): string { return this.localization.translate(text); }
}
