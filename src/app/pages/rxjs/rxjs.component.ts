import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  interval,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  template: `
    <section dir="rtl" class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12" style="direction: rtl">
      <p class="text-sm font-semibold text-violet-400">درس تفاعلي · HANDS-ON</p>
      <h1 class="mt-1 text-3xl font-bold sm:text-4xl">RxJS من الصفر</h1>
      <p class="mt-3 max-w-3xl text-slate-400">
        RxJS مكتبة بتساعدك تتعامل مع أي حاجة بتحصل "مع الوقت" — ضغطة زرار، كتابة في input، رد من API — كأنها
        <strong class="text-violet-300">نهر بيانات (Stream)</strong> واحد تقدر تفلتره وتغيّره وتتحكم فيه بدل ما تتعامل معاه كأحداث منفصلة.
        جرّب الأمثلة تحت، وشغّل الـ console عشان تشوف اللي بيحصل تحت السطح.
      </p>

      <!-- 1 · WHY RXJS -->
      <article class="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-xs font-bold tracking-wider text-violet-300">1 · ليه اتعملت RxJS؟</p>
        <h2 class="mt-2 text-xl font-bold">المشكلة قبل RxJS</h2>
        <p class="mt-2 text-sm text-slate-400">
          لما عندك أحداث كتير بتحصل بمرور الوقت (كتابة، نقرات، ردود API)، التعامل معاهم بـ callbacks عادي بيوصلك لمشكلة اسمها
          <span class="text-violet-300">Callback Hell</span>: كل حدث محتاج شرط، ومحتاج تلغي القديم يدوي، ومفيش طريقة موحدة تدمج أو تفلتر أو تأخر الأحداث دي.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-800 p-4">
            <p class="text-xs font-bold text-rose-300">❌ من غير RxJS</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-slate-300" dir="ltr">input.addEventListener('input', () =&gt; &#123;
  clearTimeout(timer);
  timer = setTimeout(() =&gt; &#123;
    fetch('/api?q=' + input.value)
      .then(res =&gt; res.json())
      .then(data =&gt; &#123;
        // لو وصل رد قديم متأخر بعد رد أحدث، هيبوظ الترتيب
      &#125;);
  &#125;, 400);
&#125;);</pre>
          </div>
          <div class="rounded-xl bg-violet-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ مع RxJS</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-violet-100" dir="ltr">searchTerm$.pipe(
  debounceTime(400),
  distinctUntilChanged(),
  switchMap(q => this.api.search(q))
).subscribe(results => this.results = results);
// switchMap بيلغي أي طلب قديم تلقائي 👍</pre>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-400">
          يعني RxJS مش بس بتسهّل الكود، هي بتحل حاجات صعب تعملها يدوي: إلغاء طلب قديم، تأخير الاستجابة، دمج أكتر من مصدر بيانات، ومنع الأحداث المتكررة.
        </p>
      </article>

      <!-- 2 · OBSERVABLE -->
      <article class="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-xs font-bold tracking-wider text-violet-300">2 · إيه هو الـ Observable؟</p>
        <h2 class="mt-2 text-xl font-bold">مصنع للقيم اللي بتوصل بمرور الوقت</h2>
        <p class="mt-2 text-sm text-slate-400">
          <code class="text-violet-300">Observable</code> هو "وعد" بقيم هتوصل تباعًا، مش قيمة واحدة زي الـ Promise. لحد ما تعمله
          <code class="text-violet-300">.subscribe()</code> هو مش بيشتغل خالص — زي فيلم على Netflix متحمّلش غير لما تدوس Play.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-violet-200" dir="ltr">Producer  ──▶  [ Observable Stream ]  ──▶  Subscriber
                 ──1──2──3──4──5──X (complete)
                     ↑ map/filter/… تقدر تحوّل كل قيمة قبل ما توصلك</pre>

        <div class="mt-5 rounded-xl bg-slate-800 p-4">
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              (click)="startTicker()"
              [disabled]="tickerRunning()"
              class="rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ▶ subscribe()
            </button>
            <button
              type="button"
              (click)="stopTicker()"
              [disabled]="!tickerRunning()"
              class="rounded-lg border border-rose-400/50 px-4 py-2 font-semibold text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ■ unsubscribe()
            </button>
            <span class="text-sm text-slate-400">
              الحالة: <strong [class.text-emerald-400]="tickerRunning()" [class.text-slate-500]="!tickerRunning()">{{ tickerRunning() ? 'شغّال 🟢' : 'واقف ⚪' }}</strong>
            </span>
          </div>
          <p class="mt-4 text-sm text-slate-300">القيم اللي وصلت: <span class="text-violet-300">{{ tickerValues().join(' ، ') || '—' }}</span></p>
          <p class="mt-2 text-xs text-slate-500">دوس subscribe، سيب الأرقام تعدّي، وبعدين دوس unsubscribe — هتلاحظ إنها بتوقف فورًا زي ما وقفت الفيلم.</p>
        </div>
      </article>

      <!-- 3 · OPERATORS -->
      <article class="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-xs font-bold tracking-wider text-violet-300">3 · الـ Operators الأشهر</p>
        <h2 class="mt-2 text-xl font-bold">map و filter — بتحوّل الـ stream وانت ماشي</h2>
        <p class="mt-2 text-sm text-slate-400">
          الـ operators هي دوال بتتحط جوه <code class="text-violet-300">.pipe()</code> وكل واحدة بتاخد القيمة اللي جاية من فوق وتطلع قيمة جديدة تنزل تحت — زي سير مصنع فيه محطات.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-violet-200" dir="ltr">source:  1──2──3──4──5──6──7──8──9──10
filter(even):    2────4────6────8────10
map(x => x*10):  20───40───60───80───100
take(3):         20───40───60|  (بيقفل بعد 3 قيم)</pre>
        <button
          type="button"
          (click)="runOperatorsDemo()"
          [disabled]="operatorsRunning()"
          class="mt-4 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          شغّل: source → filter(even) → map(×10) → take(3)
        </button>
        <div class="mt-4 rounded-xl bg-slate-800 p-4 text-sm text-slate-300">
          النتيجة: <span class="text-violet-300">{{ operatorsResult().join(' ، ') || '—' }}</span>
        </div>
      </article>

      <!-- 4 · SEARCH: debounce + switchMap -->
      <article class="mt-5 rounded-2xl border border-violet-400/30 bg-violet-950/20 p-6">
        <p class="text-xs font-bold tracking-wider text-violet-300">4 · debounceTime + distinctUntilChanged + switchMap</p>
        <h2 class="mt-2 text-xl font-bold">مربع بحث حقيقي بيلغي الطلبات القديمة</h2>
        <p class="mt-2 text-sm text-slate-400">
          <code class="text-violet-300">debounceTime(400)</code> بيستنى تسيب الكتابة 400ms قبل ما يبعت. <code class="text-violet-300">distinctUntilChanged()</code>
          بيمنع البحث لو القيمة متغيرتش. <code class="text-violet-300">switchMap</code> لو طلب جديد جه، بيلغي القديم فورًا (مهم جدًا عشان الترتيب متتلخبطش).
        </p>
        <input
          type="text"
          [ngModel]="searchInputValue()"
          (ngModelChange)="onSearchInput($event)"
          placeholder="اكتب اسم فيلم... جرّب تكتب بسرعة"
          class="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
          dir="rtl"
        />
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-xs text-slate-400">عدد مرات "النداء على الـ API"</p>
            <strong class="text-2xl text-violet-300">{{ apiCallCount() }}</strong>
            <p class="mt-1 text-xs text-slate-500">لاحظ إنه مش بيزيد مع كل حرف — بفضل debounce</p>
          </div>
          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-xs text-slate-400">آخر نتيجة وصلت (ومش اتلغت)</p>
            <strong class="text-lg text-emerald-300">{{ searchResult() || '—' }}</strong>
          </div>
        </div>
      </article>

      <!-- 5 · SUBSCRIBE & MEMORY LEAK -->
      <article class="mt-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 p-6">
        <p class="text-xs font-bold tracking-wider text-rose-300">5 · subscribe() ومشكلة Memory Leak</p>
        <h2 class="mt-2 text-xl font-bold">الاشتراك اللي متسبناش، بيفضل شغّال للأبد</h2>
        <p class="mt-2 text-sm text-slate-400">
          لما تعمل <code class="text-rose-300">.subscribe()</code> على Observable لسه شغّال (زي interval أو Router events)، الاشتراك ده بيفضل
          "حي" في الذاكرة حتى لو الكومبوننت اتقفل. النتيجة: الذاكرة بتتراكم، وأحيانًا الكود بيشتغل على عنصر ملوش وجود.
        </p>
        <pre class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-rose-200" dir="ltr">افتح صفحة  ──▶  subscribe()  ──▶  ✅ شغّال
اقفل الصفحة ──▶  ما حدش عمل unsubscribe ──▶  ⚠️ لسه شغّال في الذاكرة!
افتحها تاني ──▶  subscribe() تاني ──▶  ⚠️⚠️ دلوقتي 2 نسخة شغّالة سوا
...وهكذا Memory Leak</pre>

        <div class="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="createLeakySubscription()"
            class="rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white hover:bg-rose-400"
          >
            💥 افتح الصفحة (subscribe بدون تنظيف)
          </button>
          <button
            type="button"
            (click)="cleanupLeaks()"
            [disabled]="leakedSubscriptionsCount() === 0"
            class="rounded-lg border border-emerald-400/50 px-4 py-2 font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            🧹 نظّف كل الاشتراكات (ngOnDestroy)
          </button>
          <span class="text-sm">
            اشتراكات نسيانة شغّالة:
            <strong class="text-lg" [class.text-rose-400]="leakedSubscriptionsCount() > 0" [class.text-emerald-400]="leakedSubscriptionsCount() === 0">
              {{ leakedSubscriptionsCount() }}
            </strong>
          </span>
        </div>
        <p class="mt-4 text-sm text-slate-400">
          الحل التقليدي: خزّن كل الاشتراكات وامسحها في <code class="text-rose-300">ngOnDestroy()</code>:
        </p>
        <pre class="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300" dir="ltr">private sub = new Subscription();

ngOnInit() &#123;
  this.sub.add(this.someObservable$.subscribe(...));
&#125;

ngOnDestroy() &#123;
  this.sub.unsubscribe(); // بيقفل كل الاشتراكات اللي اتضافوا
&#125;</pre>
      </article>

      <!-- 6 · ASYNC PIPE -->
      <article class="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6">
        <p class="text-xs font-bold tracking-wider text-emerald-300">6 · async pipe — الحل الأشيك</p>
        <h2 class="mt-2 text-xl font-bold">خلّي Angular تعمل subscribe/unsubscribe نيابةً عنك</h2>
        <p class="mt-2 text-sm text-slate-400">
          بدل ما تعمل <code class="text-emerald-300">.subscribe()</code> يدوي وتفتكر تعمل <code class="text-emerald-300">unsubscribe</code> في
          <code class="text-emerald-300">ngOnDestroy</code>، استخدم <code class="text-emerald-300">| async</code> في الـ template. هي بتشترك أوتوماتيك لما
          العنصر يظهر، وبتلغي الاشتراك أوتوماتيك لما يتقفل — يعني مفيش أي احتمال Memory Leak من الأساس.
        </p>
        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-900 p-4">
            <p class="text-xs font-bold text-rose-300">❌ الطريقة اليدوية</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-slate-300" dir="ltr">movies$: Observable&lt;Movie[]&gt;;
movies: Movie[] = [];
private sub!: Subscription;

ngOnInit() &#123;
  this.sub = this.movies$.subscribe(
    m =&gt; this.movies = m
  );
&#125;

ngOnDestroy() &#123;
  this.sub.unsubscribe(); // لازم تفتكرها!
&#125;</pre>
          </div>
          <div class="rounded-xl bg-emerald-950/30 p-4">
            <p class="text-xs font-bold text-emerald-300">✅ مع async pipe</p>
            <pre class="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-100" dir="ltr">movies$ = this.api.getMovies();

// في الـ template بس:
&#64;for (m of movies$ | async; track m.id) &#123;
  ...
&#125;
// مفيش subscribe، مفيش unsubscribe 🎉</pre>
          </div>
        </div>

        <div class="mt-5 rounded-xl bg-slate-800 p-4">
          <p class="text-xs text-slate-400">مثال شغّال دلوقتي (نفس الـ ticker بتاع فوق، لكن بـ async pipe):</p>
          <p class="mt-2 text-sm">
            القيمة الحالية: <strong class="text-emerald-300">{{ asyncDemo$ | async }}</strong>
          </p>
          <p class="mt-2 text-xs text-slate-500">مفيش زرار subscribe ولا unsubscribe هنا — الـ pipe بيعمل ده لوحده طول ما الصفحة مفتوحة.</p>
        </div>
      </article>

      <!-- 7 · CHEAT SHEET -->
      <article class="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-xs font-bold tracking-wider text-violet-300">7 · Cheat Sheet سريع</p>
        <h2 class="mt-2 text-xl font-bold">الـ Operators اللي هتستخدمها كل يوم</h2>
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-800">
          <table class="w-full text-right text-sm">
            <thead class="bg-slate-800 text-slate-300">
              <tr>
                <th class="px-4 py-2 font-semibold">Operator</th>
                <th class="px-4 py-2 font-semibold">بيعمل إيه</th>
                <th class="px-4 py-2 font-semibold">مثال استخدام</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-400">
              @for (row of cheatSheet; track row.op) {
                <tr>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-violet-300" dir="ltr">{{ row.op }}</td>
                  <td class="px-4 py-2">{{ row.desc }}</td>
                  <td class="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-500" dir="ltr">{{ row.use }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `,
})
export class RxjsComponent implements OnDestroy {
  // ── 2 · Observable ticker demo ──────────────────────────────
  readonly tickerRunning = signal(false);
  readonly tickerValues = signal<number[]>([]);
  private tickerSub?: Subscription;

  startTicker(): void {
    this.tickerValues.set([]);
    this.tickerRunning.set(true);
    this.tickerSub = interval(500)
      .pipe(map((n) => n + 1))
      .subscribe((value) => this.tickerValues.update((values) => [...values, value]));
  }

  stopTicker(): void {
    this.tickerSub?.unsubscribe();
    this.tickerRunning.set(false);
  }

  // ── 3 · operators playground ────────────────────────────────
  readonly operatorsRunning = signal(false);
  readonly operatorsResult = signal<number[]>([]);

  runOperatorsDemo(): void {
    this.operatorsResult.set([]);
    this.operatorsRunning.set(true);
    interval(300)
      .pipe(
        map((n) => n + 1),
        filter((n) => n % 2 === 0),
        map((n) => n * 10),
        take(3),
      )
      .subscribe({
        next: (value) => this.operatorsResult.update((values) => [...values, value]),
        complete: () => this.operatorsRunning.set(false),
      });
  }

  // ── 4 · debounce + switchMap search demo ────────────────────
  readonly searchInputValue = signal('');
  readonly apiCallCount = signal(0);
  readonly searchResult = signal('');
  private readonly searchTerm$ = new Subject<string>();

  private readonly searchSub = this.searchTerm$
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.apiCallCount.update((count) => count + 1)),
      switchMap((term) => this.fakeSearchApi(term)),
    )
    .subscribe((result) => this.searchResult.set(result));

  onSearchInput(value: string): void {
    this.searchInputValue.set(value);
    this.searchTerm$.next(value);
  }

  private fakeSearchApi(term: string): Observable<string> {
    if (!term.trim()) {
      return of('');
    }
    return of(`نتيجة بحث عن "${term}" ✅`).pipe(delay(500));
  }

  // ── 5 · memory leak demo ────────────────────────────────────
  readonly leakedSubscriptionsCount = signal(0);
  private readonly leakedSubscriptions: Subscription[] = [];

  createLeakySubscription(): void {
    const sub = interval(1000).subscribe();
    this.leakedSubscriptions.push(sub);
    this.leakedSubscriptionsCount.set(this.leakedSubscriptions.length);
  }

  cleanupLeaks(): void {
    this.leakedSubscriptions.forEach((sub) => sub.unsubscribe());
    this.leakedSubscriptions.length = 0;
    this.leakedSubscriptionsCount.set(0);
  }

  // ── 6 · async pipe demo ─────────────────────────────────────
  readonly asyncDemo$ = interval(700).pipe(map((n) => `tick #${n + 1}`));

  readonly cheatSheet = [
    { op: 'map', desc: 'يحوّل كل قيمة لقيمة تانية', use: 'map(x => x * 2)' },
    { op: 'filter', desc: 'يسيب بس القيم اللي بتحقق شرط', use: 'filter(x => x > 0)' },
    { op: 'tap', desc: 'ينفّذ side effect (زي console.log) من غير ما يغيّر القيمة', use: 'tap(x => console.log(x))' },
    { op: 'debounceTime', desc: 'يستنى مدة سكون قبل ما يبعت القيمة', use: 'debounceTime(400)' },
    { op: 'distinctUntilChanged', desc: 'يمنع تكرار نفس القيمة ورا بعض', use: 'distinctUntilChanged()' },
    { op: 'switchMap', desc: 'يبدّل لـ Observable جديد ويلغي القديم فورًا (مثالي للبحث)', use: 'switchMap(q => api.search(q))' },
    { op: 'mergeMap', desc: 'يشغّل كل الطلبات مع بعض من غير إلغاء', use: 'mergeMap(id => api.get(id))' },
    { op: 'concatMap', desc: 'يشغّل الطلبات واحد ورا التاني بالترتيب', use: 'concatMap(job => run(job))' },
    { op: 'combineLatest', desc: 'يجمع آخر قيمة من كذا Observable مع بعض', use: 'combineLatest([a$, b$])' },
    { op: 'take(n)', desc: 'ياخد أول n قيمة وبعدين يقفل الـ stream', use: 'take(3)' },
    { op: 'takeUntil', desc: 'يقفل الـ stream لما Observable تاني يطلع قيمة (مفيد جدًا في ngOnDestroy)', use: 'takeUntil(this.destroy$)' },
    { op: 'catchError', desc: 'يمسك أي error في الـ stream ويرجّع بديل بدل ما يبوظ كل حاجة', use: 'catchError(() => of([]))' },
  ];

  ngOnDestroy(): void {
    this.tickerSub?.unsubscribe();
    this.searchSub.unsubscribe();
    this.cleanupLeaks();
  }
}
