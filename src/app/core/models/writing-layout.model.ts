export type WritingLayout =
  | 'stack'
  | 'image_left_50'
  | 'image_left_30'
  | 'text_left_70';

export const WRITING_LAYOUTS: WritingLayout[] = [
  'stack',
  'image_left_50',
  'image_left_30',
  'text_left_70',
];

export interface WritingLayoutOption {
  id: WritingLayout;
  label: string;
  shortLabel: string;
}

export const WRITING_LAYOUT_OPTIONS: WritingLayoutOption[] = [
  {
    id: 'stack',
    label: 'Image above, text below',
    shortLabel: 'Top / bottom',
  },
  {
    id: 'image_left_50',
    label: 'Image left 50%, text right 50%',
    shortLabel: '50 / 50',
  },
  {
    id: 'image_left_30',
    label: 'Image left 30%, text right 70%',
    shortLabel: '30 / 70',
  },
  {
    id: 'text_left_70',
    label: 'Text left 70%, image right 30%',
    shortLabel: '70 / 30',
  },
];

const LAYOUT_SET = new Set<string>(WRITING_LAYOUTS);

export function isWritingLayout(value: unknown): value is WritingLayout {
  return typeof value === 'string' && LAYOUT_SET.has(value);
}

export function resolveWritingLayout(
  source: { layout?: WritingLayout | string | null } | null | undefined
): WritingLayout {
  const raw = source?.layout;
  return isWritingLayout(raw) ? raw : 'stack';
}
