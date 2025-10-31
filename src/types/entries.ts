export interface Entry {
  id: string;
  userId: string;
  mood: MOOD;
  content?: string;
  date: string; // ISO string (ex: "2025-10-18T00:00:00Z")
  createdAt: string;
  updatedAt: string;
}

export type GetEntryListData = Entry[];

export interface GetEntryListParams {
  year?: number;
  month?: number;
}

export type GetEntryData = Entry;
export type GetEntryParams = Pick<Entry, "id">;

export type PostEntryPayload = Pick<Entry, "mood" | "content" | "date">;

export type PatchEntryPayload = Pick<Entry, "mood" | "content">;

export const MOODS = ["LOVE", "GOOD", "NEUTRAL", "BAD", "ANGRY"] as const;
export type MOOD = (typeof MOODS)[number];

export interface GetHasWrittenTodayData {
  hasWrittenToday: boolean;
}

export interface GetStreakData {
  currentStreak: number;
  maxStreak: number;
}

export interface GetStatsData {
  summaryMonth: string;
  total: number;
  stats: {
    LOVE: number;
    GOOD: number;
    NEUTRAL: number;
    BAD: number;
    ANGRY: number;
  };
  mostFrequentMood: MOOD;
}
