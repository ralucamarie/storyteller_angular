export interface CategoryDisplay {
  label: string;
  color: string;
}

export const CATEGORY_NAMES = [
  'fantasy',
  'scienceFiction',
  'mysteryThriller',
  'romance',
  'horror',
  'historicalFiction',
  'adventure',
  'biography',
  'memoir',
  'selfHelp',
  'travel',
  'trueCrime',
  'scienceTechnology',
  'history',
  'politics',
  'business',
  'sports',
  'entertainment',
  'health',
  'opinionEssays',
  'socialIssues',
  'inspirational',
  'fanFiction',
  'childrenStories',
  'youngAdult',
] as const;

const CATEGORY_COLORS = new Map<string, string>([
  ['fantasy', 'rgba(205, 133, 63, 0.5)'],
  ['scienceFiction', 'rgba(112, 128, 144, 0.7)'],
  ['mysteryThriller', 'rgba(82, 67, 57, 0.7)'],
  ['romance', 'rgba(233, 150, 122, 0.7)'],
  ['horror', 'rgba(139, 69, 19, 0.7)'],
  ['historicalFiction', 'rgba(160, 82, 45, 0.7)'],
  ['adventure', 'rgba(210, 180, 140, 0.7)'],
  ['biography', 'rgba(72, 61, 49, 0.7)'],
  ['memoir', 'rgba(205, 175, 149, 0.7)'],
  ['selfHelp', 'rgba(107, 142, 35, 0.7)'],
  ['travel', 'rgba(189, 183, 107, 0.7)'],
  ['trueCrime', 'rgba(139, 0, 0, 0.7)'],
  ['scienceTechnology', 'rgba(70, 130, 180, 0.7)'],
  ['history', 'rgba(139, 105, 20, 0.7)'],
  ['politics', 'rgba(85, 107, 47, 0.7)'],
  ['business', 'rgba(112, 97, 85, 0.7)'],
  ['sports', 'rgba(154, 205, 50, 0.7)'],
  ['entertainment', 'rgba(176, 101, 107, 0.7)'],
  ['health', 'rgba(102, 205, 170, 0.7)'],
  ['opinionEssays', 'rgba(75, 54, 33, 0.7)'],
  ['socialIssues', 'rgba(119, 136, 153, 0.7)'],
  ['inspirational', 'rgba(244, 164, 96, 0.7)'],
  ['fanFiction', 'rgba(186, 85, 211, 0.7)'],
  ['childrenStories', 'rgba(255, 218, 185, 0.7)'],
  ['youngAdult', 'rgba(128, 128, 0, 0.7)'],
]);

export function categoryTranslationKey(name: string): string {
  return `categories.${name}`;
}

function formatCategoryLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

export function getCategoryColor(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return CATEGORY_COLORS.get(value) ?? 'gray';
}

export function formatCategory(
  value: string | null | undefined,
  labelResolver?: (name: string) => string
): CategoryDisplay {
  if (!value) {
    return { label: '', color: '' };
  }
  const color = getCategoryColor(value);
  const label = labelResolver
    ? labelResolver(value)
    : formatCategoryLabel(value);
  return { label, color };
}

export interface StoryCategoryOption {
  name: string;
  label: string;
}

export function getStoryCategoryOptions(
  labelResolver: (name: string) => string
): StoryCategoryOption[] {
  return CATEGORY_NAMES.map((name) => ({
    name,
    label: labelResolver(name),
  })).sort((a, b) => a.label.localeCompare(b.label));
}
