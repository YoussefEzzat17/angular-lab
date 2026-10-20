// ─── Topic IDs ────────────────────────────────────────────────────────────────
export type TopicId =
  | 'binding' | 'pipes' | 'directives' | 'communication' | 'forms'
  | 'routing' | 'guards' | 'signals' | 'rxjs' | 'di' | 'movies'
  | 'interceptor' | 'facade' | 'change-detection' | 'lazy-loading'
  | 'content-projection' | 'resource' | 'defer';

// ─── Lesson Sections ──────────────────────────────────────────────────────────
export type SectionKind = 'concept' | 'try-it' | 'reference';

export interface LessonSection {
  /** Stable kebab-case id — bookmarks and progress are keyed on this. Never 'quiz' or 'complete'. */
  id: string;
  title: string;
  kind: SectionKind;
  /** Estimated reading/interaction time in minutes. */
  minutes: number;
}

export interface TopicObjective {
  text: string;
  /** Optional: which section teaches this objective. */
  sectionId?: string;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export type QuizQuestionType = 'single' | 'multi' | 'true-false';

export interface QuizChoice {
  id: string;
  text: string;
}

export interface QuizQuestion {
  /** Stable id, e.g. 'guards-07'. Never reassign. */
  id: string;
  type: QuizQuestionType;
  prompt: string;
  /** Optional code snippet shown with the question. */
  code?: string;
  /** For true-false: [{id:'true',text:'True'},{id:'false',text:'False'}] — never shuffled. */
  choices: QuizChoice[];
  /** For single/tf: one element. For multi: ≥ 2. */
  correct: string[];
  explanation: string;
  /** Which section to review if this question is answered incorrectly. */
  sectionId: string;
}

export interface QuizBank {
  topicId: TopicId;
  /** Increment when questions change — stored in attempts for audit. */
  version: number;
  /** Should contain 10–15 questions: 6 are drawn at random, so more questions means more variety. */
  questions: QuizQuestion[];
}

export const QUIZ_RULES = { draw: 6, passRatio: 0.75 } as const;

export interface QuizAttempt {
  id: string;
  topicId: TopicId;
  bankVersion: number;
  submittedAt: string; // ISO
  questionIds: string[];
  /** Shuffled choice order used during this attempt, keyed by questionId. */
  choiceOrder: Record<string, string[]>;
  /** User's selected choice ids, keyed by questionId. */
  answers: Record<string, string[]>;
  correctIds: string[];
  score: number;
  total: number;
  passed: boolean;
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export type TopicStatus = 'not-started' | 'in-progress' | 'completed';

export interface TopicProgress {
  firstVisitedAt?: string;
  lastVisitedAt?: string;
  sectionsDone: string[];
  lastSectionId?: string;
  completedAt?: string;
  /** 'quiz' = passed the quiz. 'legacy' = was marked complete before quiz system existed. */
  completedVia?: 'quiz' | 'legacy';
  bestScore?: number;
  /** Keep only the last 5 attempts. */
  attempts: QuizAttempt[];
}

export type ActivityKind = 'section-done' | 'quiz-passed' | 'quiz-failed';

export interface ActivityEntry {
  at: string; // ISO
  kind: ActivityKind;
  topicId: TopicId;
  sectionId?: string;
  score?: number;
}

export interface ProgressStateV2 {
  version: 2;
  topics: Partial<Record<TopicId, TopicProgress>>;
  /** Keep only the last 30 entries. */
  activity: ActivityEntry[];
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export interface ProfileData {
  version: 1;
  /** Empty string if user skipped onboarding name prompt. */
  name: string;
  createdAt: string;
  onboardingDone: boolean;
  tourDone: boolean;
  /** 'YYYY-MM-DD' local date strings. Keep last 400. */
  activeDays: string[];
}

// ─── Bookmark ─────────────────────────────────────────────────────────────────
export interface Bookmark {
  topicId: TopicId;
  sectionId: string;
  at: string; // ISO
}
