export type WritingLayout = 'stack' | 'image_left' | 'image_right';

export const WRITING_SIDE_IMAGE_MAX_WIDTH_PERCENT = 40;

export const WRITING_LAYOUTS: WritingLayout[] = ['stack', 'image_left', 'image_right'];

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
    id: 'image_left',
    label: 'Image left, text wraps (max 40% width)',
    shortLabel: 'Left',
  },
  {
    id: 'image_right',
    label: 'Image right, text wraps (max 40% width)',
    shortLabel: 'Right',
  },
];

const LAYOUT_SET = new Set<string>(WRITING_LAYOUTS);

const LEGACY_LAYOUT_MAP: Record<string, WritingLayout> = {
  image_left_50: 'image_left',
  image_left_30: 'image_left',
  text_left_70: 'image_right',
};

export function isWritingLayout(value: unknown): value is WritingLayout {
  return typeof value === 'string' && LAYOUT_SET.has(value);
}

export function resolveWritingLayout(
  source: { layout?: WritingLayout | string | null } | null | undefined
): WritingLayout {
  const raw = source?.layout;
  if (typeof raw === 'string' && raw in LEGACY_LAYOUT_MAP) {
    return LEGACY_LAYOUT_MAP[raw];
  }
  return isWritingLayout(raw) ? raw : 'stack';
}

export function writingHasImage(
  source:
    | { imageUrl?: string | null; image_url?: string | null }
    | null
    | undefined
): boolean {
  return !!(source?.imageUrl ?? source?.image_url);
}

export function isSideWritingLayout(layout: WritingLayout): boolean {
  return layout === 'image_left' || layout === 'image_right';
}

export function layoutImageWidthPercent(layout: WritingLayout): number | null {
  return isSideWritingLayout(layout) ? WRITING_SIDE_IMAGE_MAX_WIDTH_PERCENT : null;
}

/** Layout used when rendering a saved writing. */
export function resolveWritingDisplayLayout(
  source:
    | {
        layout?: WritingLayout | string | null;
        imageUrl?: string | null;
        image_url?: string | null;
      }
    | null
    | undefined
): WritingLayout {
  const layout = resolveWritingLayout(source);
  if (isSideWritingLayout(layout)) {
    return layout;
  }
  if (writingHasImage(source)) {
    return 'image_left';
  }
  return layout;
}
