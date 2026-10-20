export interface GlossaryEntry {
  title: string;
  text: string;
}

/** Plain-language meanings for words beginners meet in the lessons. Used by <app-term>. */
export const GLOSSARY: Record<string, GlossaryEntry> = {
  stream: {
    title: 'Stream',
    text: 'Values that arrive one after another over time, like clicks or messages from a server. RxJS lets you treat all of them the same way.',
  },
  injector: {
    title: 'Injector',
    text: 'The part of Angular that creates services and hands them to whoever asks with inject(), reusing one instance when it should be shared.',
  },
  service: {
    title: 'Service',
    text: 'A plain class that holds logic or data you want to share between components, such as loading data or keeping a cart.',
  },
  bundle: {
    title: 'Bundle',
    text: 'A JavaScript file the browser downloads. Smaller bundles load faster, so splitting your code into several bundles helps.',
  },
  onpush: {
    title: 'OnPush',
    text: 'A change detection mode where Angular re-checks a component only when it has a reason: a new input, an event inside it, or a signal it reads.',
  },
  multicasting: {
    title: 'Multicasting',
    text: 'Sending one value to many listeners at the same time.',
  },
  'side-effect': {
    title: 'Side effect',
    text: 'Anything code does besides returning a value: logging, saving to storage, changing the page title, calling a server.',
  },
};
