import { InjectionToken } from '@angular/core';

/**
 * Provided by the lesson player to the sections it renders. The player owns the page's <h1> (the section title),
 * so headings inside a section, such as the topic intro in `app-page-header`, step down a level.
 */
export const IN_LESSON_PLAYER = new InjectionToken<boolean>('IN_LESSON_PLAYER');
