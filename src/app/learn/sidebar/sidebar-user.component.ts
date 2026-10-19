import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { LearningFacade } from '../../core/services/learning.facade';

const RING_RADIUS = 19;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      routerLink="/journey"
      data-testid="sidebar-level"
      class="flex items-center gap-3 border-t border-stone-800 px-4 py-3 transition hover:bg-stone-900"
      [attr.aria-label]="label()"
      [attr.title]="'Level ' + game.level().level.number + ' · ' + game.level().level.title"
    >
      <!-- Avatar inside a ring that fills as the learner moves toward the next level -->
      <span class="relative block h-11 w-11 shrink-0" aria-hidden="true">
        <svg width="44" height="44" viewBox="0 0 44 44" class="block">
          <circle cx="22" cy="22" [attr.r]="radius" fill="none" class="stroke-stone-800" stroke-width="3" />
          <circle
            data-testid="sidebar-ring"
            cx="22"
            cy="22"
            [attr.r]="radius"
            fill="none"
            class="stroke-gold-400 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
            stroke-width="3"
            stroke-linecap="round"
            [attr.stroke-dasharray]="ringLength"
            [attr.stroke-dashoffset]="dashOffset()"
            transform="rotate(-90 22 22)"
          />
        </svg>
        <span class="absolute inset-0 grid place-items-center text-sm font-bold text-gold-300">{{ facade.initials() || '?' }}</span>
        <span
          data-testid="sidebar-level-badge"
          class="absolute -bottom-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-bold text-stone-950"
        >{{ game.level().level.number }}</span>
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex items-center justify-between gap-2">
          <span class="truncate text-sm font-semibold text-stone-100" data-testid="sidebar-name">{{ facade.name() || 'Learner' }}</span>
          @if (facade.streak() > 0) {
            <span
              data-testid="sidebar-streak"
              class="shrink-0 rounded-full bg-gold-500/15 px-2 py-0.5 text-xs font-semibold text-gold-300"
              [attr.title]="facade.streak() + '-day streak'"
            >
              <span aria-hidden="true">🔥</span> {{ facade.streak() }}
            </span>
          }
        </span>
        <span class="block text-xs text-stone-400" data-testid="sidebar-next">{{ xpLine() }}</span>
      </span>
    </a>
  `,
})
export class SidebarUserComponent {
  readonly facade = inject(LearningFacade);
  readonly game = inject(GamificationService);

  protected readonly radius = RING_RADIUS;
  protected readonly ringLength = RING_LENGTH;

  protected readonly dashOffset = computed(() => RING_LENGTH * (1 - this.game.level().percent / 100));

  /** "160 XP · 90 to go", or "160 XP · top level" once there is nothing left to reach. */
  protected readonly xpLine = computed(() => {
    const { next, xp, xpForLevel, xpIntoLevel } = this.game.level();
    return next ? `${xp} XP · ${xpForLevel - xpIntoLevel} to go` : `${xp} XP · top level`;
  });

  /** The full story for screen readers; the sighted layout shows just the number and the ring. */
  protected readonly label = computed(() => {
    const { level, next, xp, xpForLevel, xpIntoLevel } = this.game.level();
    const streak = this.facade.streak();
    const parts = [
      `${this.facade.name() || 'Learner'}`,
      `level ${level.number}, ${level.title}`,
      `${xp} XP`,
      next ? `${xpForLevel - xpIntoLevel} XP to level ${next.number}` : 'top level reached',
    ];
    if (streak > 0) {
      parts.splice(1, 0, `${streak}-day streak`);
    }
    return `${parts.join(', ')}. Open your journey`;
  });
}
