import { useState, useEffect, useCallback } from 'react';
import type { AniListAnime, AniListResponse } from '../types/anime';

export type Category = 'Trending' | 'New Releases' | 'Completed';

const getBaseQuery = (sort: string, status: string | null, search?: string) => {
  const searchClause = search?.trim() ? `, search: "${search.trim().replace(/"/g, '\\"')}"` : '';
  const statusClause = status ? `, status: ${status}` : '';

  return `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    media (type: ANIME, sort: ${sort}${statusClause}${searchClause}) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
      episodes
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

const PER_PAGE = 24;
const MAX_VISIBLE_PAGES = 5;

export function useAnime() {
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Trending');

  const fetchAnime = useCallback(async (
    page: number = 1,
    search?: string,
    category?: Category
  ) => {
    setLoading(true);
    setError(null);

    const cat = category || activeCategory;
    const config = CATEGORIES.find((c) => c.key === cat)!;

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: getBaseQuery(config.sort, config.status, search?.trim() || undefined),
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
      const hasNext = result.data?.Page?.pageInfo?.hasNextPage ?? false;

      setAnimeList(media);
      setHasNextPage(hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchAnime(1, undefined, activeCategory);
  }, [fetchAnime, activeCategory]);

  const handleCategoryClick = (cat: Category) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1);
    fetchAnime(1, searchTerm.trim() || undefined, activeCategory);
  };

  const handleClear = () => {
    setSearchTerm('');
    setHasSearched(false);
    setCurrentPage(1);
    fetchAnime(1, undefined, activeCategory);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchAnime(page, searchTerm.trim() || undefined, activeCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    const targetCategory: Category = 'Trending';

    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);

    if (activeCategory === targetCategory) {
      fetchAnime(1, undefined, targetCategory);
    } else {
      setActiveCategory(targetCategory);
    }

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
    const pages: (number | 'ellipsis')[] = [];

    if (currentPage <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= MAX_VISIBLE_PAGES; i++) {
        pages.push(i);
      }
      if (hasNextPage) {
        pages.push('ellipsis');
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      const start = currentPage - 1;
      const end = currentPage + 1;
      for (let i = start; i <= end; i++) {
        if (hasNextPage || i <= currentPage) {
          pages.push(i);
        }
      }
      if (hasNextPage) {
        pages.push('ellipsis');
      }
    }

    return pages;
  };

  const paginationRange = getPaginationRange();

  const getSectionTitle = (): string => {
    if (hasSearched) return `Search results for "${searchTerm}"`;
    return activeCategory === 'Trending' ? 'Top Rated Anime' : activeCategory;
  };

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
    setSearchTerm,
    handleSearch,
    handleClear,
    handleCategoryClick,
    goToPage,
    handleLogoClick,
    formatEpisodes,
    formatScore,
    getSectionTitle,
    CATEGORIES,
  };
}