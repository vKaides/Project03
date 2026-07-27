import { useCallback, useEffect, useState } from 'react';
import type { AniListAnime, AniListResponse, WeeklyScheduleEntry, WeeklyScheduleResponse } from '../types/anime';

export type Category = 'Trending' | 'New Releases' | 'Completed';
export type ViewMode = 'home' | 'schedule';

const getBaseQuery = (sort: string, status: string | null, search?: string, genre?: string) => {
  const searchClause = search?.trim() ? `, search: "${search.trim().replace(/"/g, '\\"')}"` : '';
  const statusClause = status ? `, status: ${status}` : '';
  const genreClause = genre ? `, genre: "${genre}"` : '';

  return `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
      total
    }
    media (type: ANIME, sort: ${sort}${statusClause}${searchClause}${genreClause}) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      averageScore
      episodes
      description
      genres
      status
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      bannerImage
    }
  }
}
`;
};

const CATEGORIES: { key: Category; sort: string; status: string | null; label: string }[] = [
  { key: 'Trending', sort: 'SCORE_DESC', status: null, label: 'Trending' },
  { key: 'New Releases', sort: 'POPULARITY_DESC', status: 'RELEASING', label: 'New Releases' },
  { key: 'Completed', sort: 'SCORE_DESC', status: 'FINISHED', label: 'Completed' },
];

const VIEW_OPTIONS: { key: ViewMode; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'schedule', label: 'Schedule' },
];

const PER_PAGE = 24;

export function useAnime() {
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category>('Trending');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [schedule, setSchedule] = useState<WeeklyScheduleEntry[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const fetchAnime = useCallback(async (
    page: number = 1,
    search?: string,
    category?: Category,
    genre?: string | null
  ) => {
    setLoading(true);
    setError(null);

    const cat = category || activeCategory;
    const config = CATEGORIES.find((c) => c.key === cat)!;
    const resolvedGenre = genre !== undefined ? genre : genreFilter;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: getBaseQuery(config.sort, config.status, search?.trim() || undefined, resolvedGenre || undefined),
          variables: {
            page,
            perPage: PER_PAGE,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch anime data');

      const result: AniListResponse & { errors?: { message: string }[] } = await response.json();

      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      const media = result.data?.Page?.media ?? [];
      const pageInfo = result.data?.Page?.pageInfo;
      const total = pageInfo?.total ?? 0;
      const resolvedTotalPages = total > 0 ? Math.ceil(total / PER_PAGE) : 1;
      const nextPage = page < resolvedTotalPages;

      setAnimeList(media);
      setHasNextPage(nextPage);
      setTotalPages(resolvedTotalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchAnime(1, undefined, activeCategory);
  }, [activeCategory, fetchAnime]);

  const handleGenreFilter = (genre: string | null) => {
    setGenreFilter(genre);
    setViewMode('home');
    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);
    setTotalPages(1);
    setHasNextPage(false);
    fetchAnime(1, undefined, activeCategory, genre);
  };

  const handleCategoryClick = (cat: Category) => {
    if (cat === activeCategory && viewMode === 'home') return;
    setActiveCategory(cat);
    setViewMode('home');
    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);
    setGenreFilter(null);
  };

  const handleViewChange = (nextView: ViewMode) => {
    setViewMode(nextView);
    if (nextView === 'schedule') {
      setHasSearched(false);
      setSearchTerm('');
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    setHasSearched(true);
    setCurrentPage(1);
    setTotalPages(1);
    setHasNextPage(false);
    fetchAnime(1, trimmedSearch || undefined, activeCategory);
  };

  const handleClear = () => {
    setSearchTerm('');
    setHasSearched(false);
    setCurrentPage(1);
    setTotalPages(1);
    setHasNextPage(false);
    fetchAnime(1, undefined, activeCategory);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setHasNextPage(false);
    fetchAnime(page, searchTerm.trim() || undefined, activeCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    const targetCategory: Category = 'Trending';

    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);
    setTotalPages(1);
    setHasNextPage(false);
    setViewMode('home');
    setActiveCategory(targetCategory);
    fetchAnime(1, undefined, targetCategory);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatEpisodes = (episodes: number | null): string => {
    if (episodes === null) return '?/??';
    return `${episodes}/${episodes}`;
  };

  const formatScore = (score: number | null): string => {
    if (score === null) return 'N/A';
    return (score / 10).toFixed(1);
  };

  const getPaginationRange = (): (number | 'ellipsis')[] => {
    if (totalPages <= 1) return [];

    const pages: (number | 'ellipsis')[] = [];
    const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const startPage = Math.max(1, safeCurrentPage - 2);
    const endPage = Math.min(totalPages, safeCurrentPage + 2);

    if (startPage > 1) {
      pages.push(1, 'ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push('ellipsis', totalPages);
    }

    return pages.filter((page, index, arr) => page !== 'ellipsis' || arr[index - 1] !== 'ellipsis');
  };

  const paginationRange = getPaginationRange();

  const getSectionTitle = (): string => {
    if (viewMode === 'schedule') return 'Upcoming Week Schedule';
    if (hasSearched) return `Search results for "${searchTerm}"`;
    return activeCategory === 'Trending' ? 'Top Rated Anime' : activeCategory;
  };

  useEffect(() => {
    if (viewMode !== 'schedule') return;

    const fetchSchedule = async () => {
      setScheduleLoading(true);
      setScheduleError(null);

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: `
query ($page: Int, $perPage: Int, $from: Int, $to: Int) {
  Page(page: $page, perPage: $perPage) {
    airingSchedules(notYetAired: true, airingAt_greater: $from, airingAt_lesser: $to, sort: TIME) {
      airingAt
      episode
      media {
        id
        title {
          romaji
          english
        }
      }
    }
  }
}`,
            variables: {
              page: 1,
              perPage: 100,
              from: Math.floor(Date.now() / 1000),
              to: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
            },
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch weekly schedule');

        const result: WeeklyScheduleResponse & { errors?: { message: string }[] } = await response.json();

        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }

        setSchedule(result.data?.Page?.airingSchedules ?? []);
      } catch (err) {
        setScheduleError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, [viewMode]);

  return {
    animeList,
    loading,
    error,
    searchTerm,
    hasSearched,
    currentPage,
    hasNextPage,
    activeCategory,
    paginationRange,
    viewMode,
    schedule,
    scheduleLoading,
    scheduleError,
    setSearchTerm,
    handleSearch,
    handleClear,
    handleCategoryClick,
    handleGenreFilter,
    handleViewChange,
    goToPage,
    handleLogoClick,
    formatEpisodes,
    formatScore,
    getSectionTitle,
    CATEGORIES,
    VIEW_OPTIONS,
  };
}
