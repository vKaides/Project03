import { useCallback, useEffect, useState } from 'react';
import type { AniListAnime, AniListResponse } from '../types/anime';

export type Category = 'Trending' | 'New Releases' | 'Completed';

const CATEGORIES: { key: Category; sort: string; status: string | null; label: string }[] = [
  { key: 'Trending', sort: 'SCORE_DESC', status: null, label: 'Trending' },
  { key: 'New Releases', sort: 'POPULARITY_DESC', status: 'RELEASING', label: 'New Releases' },
  { key: 'Completed', sort: 'SCORE_DESC', status: 'FINISHED', label: 'Completed' },
];

const PER_PAGE = 24;

const getBaseQuery = (sort: string, status: string | null, search?: string) => {
  const searchClause = search?.trim() ? `, search: "${search.trim().replace(/"/g, '\\"')}"` : '';
  const statusClause = status ? `, status: ${status}` : '';

  return `
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
      total
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

export function useAnimeList(initialCategory: Category = 'Trending') {
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);

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
  }, [fetchAnime, activeCategory]);

  const handleCategoryClick = (cat: Category) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setHasSearched(false);
    setSearchTerm('');
    setCurrentPage(1);
    setTotalPages(1);
    setHasNextPage(false);
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

  const getPaginationRange = () => {
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

  return {
    animeList,
    loading,
    error,
    searchTerm,
    hasSearched,
    currentPage,
    hasNextPage,
    activeCategory,
    paginationRange: getPaginationRange(),
    setSearchTerm,
    handleSearch,
    handleClear,
    handleCategoryClick,
    goToPage,
    CATEGORIES,
  };
}
