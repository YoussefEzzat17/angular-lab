/** The words a screen reader would say for a control: its label, or what is written on it. */
export function accessibleName(el: Element): string {
  const labelledBy = el.getAttribute('aria-labelledby');
  const labelledText = labelledBy ? document.getElementById(labelledBy)?.textContent : '';
  return (el.getAttribute('aria-label') || labelledText || el.getAttribute('title') || el.textContent || '').replace(/\s+/g, ' ').trim();
}

function fieldHasLabel(field: Element, root: HTMLElement): boolean {
  if (field.getAttribute('aria-label') || field.getAttribute('aria-labelledby') || field.closest('label')) {
    return true;
  }
  return !!field.id && !!root.querySelector(`label[for="${field.id}"]`);
}

const short = (el: Element) => el.outerHTML.replace(/\s+/g, ' ').slice(0, 100);

/**
 * Checks the quiet accessibility mistakes in rendered markup and returns one line per problem:
 * images without alt text, controls and links without a name, form fields without a label,
 * duplicate ids, and buttons whose role was replaced so they stop being buttons.
 */
export function auditAccessibility(root: HTMLElement): string[] {
  const problems: string[] = [];

  for (const img of Array.from(root.querySelectorAll('img'))) {
    if (!img.hasAttribute('alt')) problems.push(`image without alt text: ${short(img)}`);
  }
  for (const button of Array.from(root.querySelectorAll('button'))) {
    if (!accessibleName(button)) problems.push(`button without a name: ${short(button)}`);
    if (button.getAttribute('role') === 'listitem') problems.push(`button exposed as a list item: ${short(button)}`);
  }
  for (const link of Array.from(root.querySelectorAll('a[href]'))) {
    if (!accessibleName(link)) problems.push(`link without a name: ${short(link)}`);
  }
  for (const field of Array.from(root.querySelectorAll('input:not([type="hidden"]), textarea, select'))) {
    if (!fieldHasLabel(field, root)) problems.push(`field without a label: ${short(field)}`);
  }
  const ids = Array.from(root.querySelectorAll('[id]')).map((el) => el.id);
  for (const id of new Set(ids.filter((value, i) => ids.indexOf(value) !== i))) {
    problems.push(`duplicate id: ${id}`);
  }
  return problems;
}
