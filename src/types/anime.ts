export interface AniListAnime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
    extraLarge?: string | null;
  };
  averageScore: number | null;
  episodes: number | null;
  description?: string | null;
  genres?: string[];
  status?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  startDate?: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
  bannerImage?: string | null;
}

export interface AniListResponse {
  data: {
    Page: {
      pageInfo: {
        hasNextPage: boolean;
        total: number | null;
      };
      media: AniListAnime[];
    };
  };
}

export interface WeeklyScheduleEntry {
  airingAt: number;
  episode: number;
  media: {
    id: number;
    title: {
      romaji: string;
      english: string | null;
    };
  };
}

export interface WeeklyScheduleResponse {
  data: {
    Page: {
      airingSchedules: WeeklyScheduleEntry[];
    };
  };
}