/** i18n keys under `levels.*` for profile XP titles (level number is 1-based). */
export const PROFILE_LEVEL_KEYS = [
  'inkling',
  'storyteller',
  'wordsmith',
  'sagaKeeper',
  'grandChronicler',
] as const;

export function profileLevelTitleKey(level: number): string {
  const index = Math.max(1, Math.floor(level)) - 1;
  const keyIndex =
    index < PROFILE_LEVEL_KEYS.length ? index : PROFILE_LEVEL_KEYS.length - 1;
  return `levels.${PROFILE_LEVEL_KEYS[keyIndex]}`;
}
