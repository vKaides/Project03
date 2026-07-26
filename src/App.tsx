import { useMemo } from 'react';
import { useAnime } from './hooks/useAnime';
import { Header } from './components/Header';
import { AnimeGrid } from './components/AnimeGrid';
import { Pagination } from './components/Pagination';
import { ScheduleView } from './components/ScheduleView';
import { HeroBannerCarousel } from './components/HeroBannerCarousel';
import type { HeroSlide } from './components/HeroBannerCarousel';

function App() {
  const {
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
  } = useAnime();

  const heroSlides: HeroSlide[] = useMemo(() => {
    if (viewMode !== 'home') return [];
    return animeList.slice(0, 5).map((anime) => ({
      title: anime.title.english || anime.title.romaji,
      subtitle: 'Stream Now in HD — Ad-Free',
      image: anime.coverImage.large,
    }));
  }, [animeList, viewMode]);

  return (
    <>
      <Header
        searchTerm={searchTerm}
        hasSearched={hasSearched}
        activeCategory={activeCategory}
        categories={CATEGORIES.map(({ key, label }) => ({ key, label }))}
        viewMode={viewMode}
        viewOptions={VIEW_OPTIONS}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClear}
        onCategoryClick={handleCategoryClick}
        onGenreFilter={handleGenreFilter}
        onViewChange={handleViewChange}
        onLogoClick={handleLogoClick}
      />

      <main className="main-content">
        {viewMode === 'home' && !loading && !error && heroSlides.length > 0 && (
          <HeroBannerCarousel slides={heroSlides} />
        )}

        <h2 className="section-title">{getSectionTitle()}</h2>

        {viewMode === 'schedule' ? (
          <ScheduleView schedule={schedule} loading={scheduleLoading} error={scheduleError} />
        ) : (
          <>
            {loading && <p className="state-message">Loading anime...</p>}
            {error && <p className="state-message state-error">Error: {error}</p>}

            {!loading && !error && hasSearched && animeList.length === 0 && (
              <p className="state-message">
                No anime found for "{searchTerm}". Try a different search term.
              </p>
            )}

            <AnimeGrid
              animeList={animeList}
              formatEpisodes={formatEpisodes}
              formatScore={formatScore}
            />

            {!loading && animeList.length > 0 && (
              <Pagination
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                paginationRange={paginationRange}
                onPageChange={goToPage}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}

export default App;