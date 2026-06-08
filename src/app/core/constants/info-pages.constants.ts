export interface InfoSection {
  heading: string;
  paragraphs: string[];
  id?: string;
}

export interface InfoPageContent {
  title: string;
  intro: string;
  sections: InfoSection[];
}

export const INFO_PAGES: Record<string, InfoPageContent> = {
  about: {
    title: 'About Storyteller',
    intro:
      'Storyteller is a collaborative writing platform where authors create stories together, chapter by chapter.',
    sections: [
      {
        heading: 'What you can do',
        paragraphs: [
          'Browse and discover stories from the community, start your own narrative, or contribute to ongoing tales.',
          'Track your activity on your profile dashboard, favorite authors and stories, and filter content by category or author.',
        ],
      },
      {
        heading: 'Community writing',
        paragraphs: [
          'Each story grows through writings and comments from multiple contributors. Real-time typing indicators show when others are adding to a story.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'Last updated: June 2026. This policy explains how Storyteller collects, uses, and protects your information.',
    sections: [
      {
        heading: 'Information we collect',
        paragraphs: [
          'When you register, we collect your name, email address, and public author name. We also store stories, writings, comments, and favorites linked to your account.',
          'We use authentication tokens stored locally in your browser to keep you signed in.',
        ],
      },
      {
        heading: 'How we use your data',
        paragraphs: [
          'Your data is used to provide the service: displaying stories, attributing contributions, personalizing your dashboard, and securing your account.',
          'We do not sell your personal information to third parties.',
        ],
      },
      {
        heading: 'Cookies & local storage',
        id: 'cookies',
        paragraphs: [
          'Storyteller uses essential cookies and browser storage for login sessions (JWT access and refresh tokens). These are required for the application to function.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You may request access, correction, or deletion of your account data by contacting us. You can log out at any time to clear session tokens from your device.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'By using Storyteller, you agree to the following terms. Please read them carefully.',
    sections: [
      {
        heading: 'Acceptable use',
        paragraphs: [
          'You must provide accurate registration information and keep your credentials secure. You are responsible for content you publish under your author name.',
          'Do not post unlawful, harassing, or infringing content. We may remove content or suspend accounts that violate these terms.',
        ],
      },
      {
        heading: 'Content ownership',
        paragraphs: [
          'You retain rights to the original text you submit. By posting on Storyteller, you grant the platform a non-exclusive license to display and store your content so the service can operate.',
          'Collaborative story segments may combine contributions from multiple users; each contributor owns their respective writing.',
        ],
      },
      {
        heading: 'Service availability',
        paragraphs: [
          'Storyteller is provided as-is during development and academic use. We do not guarantee uninterrupted availability but aim to maintain a reliable experience.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: [
          'We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact & Support',
    intro: 'Need help or have feedback? Reach out to the Storyteller team.',
    sections: [
      {
        heading: 'General inquiries',
        paragraphs: [
          'For questions about your account, stories, or the platform, email us at support@storyteller.app.',
        ],
      },
      {
        heading: 'Report a problem',
        id: 'report',
        paragraphs: [
          'If you encounter a bug or inappropriate content, include a description, the story link if applicable, and screenshots when possible so we can respond quickly.',
        ],
      },
      {
        heading: 'Privacy requests',
        paragraphs: [
          'For data access or deletion requests related to privacy, contact privacy@storyteller.app with the email address associated with your account.',
        ],
      },
    ],
  },
};
