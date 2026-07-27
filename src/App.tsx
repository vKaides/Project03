import { useEffect, useMemo, useState } from 'react';
import { useAnime } from './hooks/useAnime';
import { Header } from './components/Header';
import { AnimeGrid } from './components/AnimeGrid';
import { Pagination } from './components/Pagination';
import { ScheduleView } from './components/ScheduleView';
import { HeroBannerCarousel } from './components/HeroBannerCarousel';
import { AnimeDetailPage } from './components/AnimeDetailPage';
import type { HeroSlide } from './components/HeroBannerCarousel';
import type { AniListAnime } from './types/anime';

const FAVORITES_STORAGE_KEY = 'ani-project-favorites';

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

  const [selectedAnime, setSelectedAnime] = useState<AniListAnime | null>(null);
  const [favorites, setFavorites] = useState<AniListAnime[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'details'>('home');

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedValue) {
        const parsedFavorites = JSON.parse(storedValue) as AniListAnime[];
        setFavorites(parsedFavorites);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const heroSlides: HeroSlide[] = useMemo(() => {
    if (viewMode !== 'home') return [];
    return animeList.slice(0, 5).map((anime) => ({
      title: anime.title.english || anime.title.romaji,
      subtitle: 'Stream Now in HD — Ad-Free',
      image: anime.coverImage.large,
    }));
  }, [animeList, viewMode]);

  const isFavorite = (anime: AniListAnime) => favorites.some((item) => item.id === anime.id);

  const toggleFavorite = (anime: AniListAnime) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === anime.id);
      if (exists) {
        return prev.filter((item) => item.id !== anime.id);
      }

      return [...prev, anime];
    });
  };

  const handleSelectAnime = (anime: AniListAnime) => {
    setSelectedAnime(anime);
    setCurrentView('details');
    window.history.pushState({}, '', `/anime/${anime.id}`);
  };

  const getAnimeTitle = (anime: AniListAnime) => anime.title.english || anime.title.romaji;

  const handleBackToHome = () => {
    setSelectedAnime(null);
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/anime/')) {
        const id = Number(path.split('/').pop());
        const anime = animeList.find((item) => item.id === id);
        if (anime) {
          setSelectedAnime(anime);
          setCurrentView('details');
        } else {
          handleBackToHome();
        }
      } else {
        handleBackToHome();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [animeList]);

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
        {currentView === 'details' && selectedAnime ? (
          <AnimeDetailPage
            anime={selectedAnime}
            isFavorite={isFavorite(selectedAnime)}
            onToggleFavorite={toggleFavorite}
            onBackToHome={handleBackToHome}
            formatEpisodes={formatEpisodes}
            formatScore={formatScore}
          />
        ) : (
          <>
            {viewMode === 'home' && !loading && !error && heroSlides.length > 0 && (
              <HeroBannerCarousel slides={heroSlides} />
            )}

            {favorites.length > 0 && (
              <section className="favorites-panel">
                <div className="favorites-header">
                  <div>
                    <p className="favorites-label">Watchlist</p>
                    <h3 className="favorites-title">Your saved anime</h3>
                  </div>
                  <span className="favorites-count">{favorites.length}</span>
                </div>

                <div className="favorites-list">
                  {favorites.map((anime) => (
                    <button
                      key={anime.id}
                      type="button"
                      className="favorite-chip"
                      onClick={() => handleSelectAnime(anime)}
                    >
                      <img src={anime.coverImage.large} alt={getAnimeTitle(anime)} />
                      <span>{getAnimeTitle(anime)}</span>
                    </button>
                  ))}
                </div>
              </section>
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
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  onSelectAnime={handleSelectAnime}
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
          </>
        )}
      </main>
    </>
  );
}

export default App;