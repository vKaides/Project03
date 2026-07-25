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
      };
      media: AniListAnime[];
    };
  };
}