export interface AniListAnime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  coverImage: {
    large: string;
  };
  averageScore: number | null;
  episodes: number | null;
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