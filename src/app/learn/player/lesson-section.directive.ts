import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({ selector: 'ng-template[appLessonSection]', standalone: true })
export class LessonSectionDirective {
  readonly appLessonSection = input.required<string>();
  readonly tpl = inject<TemplateRef<unknown>>(TemplateRef);
}
