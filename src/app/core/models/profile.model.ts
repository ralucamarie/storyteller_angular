import { IUser } from './user.model';

export interface ProfileStorySummary {
  id: number;
  title: string;
  created_at: string;
  author_name: string;
  intro: string;
  writings_count: number;
  comments_count: number;
}

export interface ProfileContribution {
  id: number;
  text: string;
  created: string;
  story: ProfileStorySummary;
}

export interface ActivityPoint {
  label: string;
  count: number;
}

export interface ProfileBadge {
  id: string;
  label: string;
  icon: string;
}

export interface ProfileGamification {
  points: number;
  level: number;
  level_progress: number;
  level_max: number;
  badges: ProfileBadge[];
}

export interface ProfileStats {
  stories_written: number;
  contributions: number;
  comments: number;
}

export interface ProfileDashboard {
  user: IUser;
  stats: ProfileStats;
  gamification: ProfileGamification;
  activity: {
    daily: ActivityPoint[];
    weekly: ActivityPoint[];
  };
  own_stories: ProfileStorySummary[];
  contributions: ProfileContribution[];
  commented_stories: ProfileStorySummary[];
  favorite_stories: ProfileStorySummary[];
}
