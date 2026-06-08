export interface InfoPageStructure {
  sectionKeys: string[];
}

/** Section keys map to `info.{pageKey}.sections.{sectionKey}` in i18n files. */
export const INFO_PAGE_STRUCTURE: Record<string, InfoPageStructure> = {
  about: {
    sectionKeys: ['whatYouCanDo', 'communityWriting'],
  },
  privacy: {
    sectionKeys: ['informationWeCollect', 'howWeUseData', 'cookies', 'yourRights'],
  },
  terms: {
    sectionKeys: ['acceptableUse', 'contentOwnership', 'serviceAvailability', 'changes'],
  },
  contact: {
    sectionKeys: ['generalInquiries', 'reportProblem', 'privacyRequests'],
  },
};

export const INFO_PAGE_SECTION_IDS: Record<string, Record<string, string>> = {
  privacy: { cookies: 'cookies' },
  contact: { reportProblem: 'report' },
};
