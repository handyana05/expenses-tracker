import { Pipe, PipeTransform, inject } from '@angular/core';
import { Localization } from './localization';
import { TranslationKey } from './translations';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly localization = inject(Localization);
  transform(key: TranslationKey): string { return this.localization.translate(key); }
}
