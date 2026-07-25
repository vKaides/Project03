import { useAnime } from './hooks/useAnime';
import { Header } from './components/Header';
import { AnimeGrid } from './components/AnimeGrid';
import { Pagination } from './components/Pagination';
import { ScheduleView } from './components/ScheduleView';

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
    handleViewChange,
    goToPage,
    handleLogoClick,
    formatEpisodes,
    formatScore,
    getSectionTitle,
    CATEGORIES,
    VIEW_OPTIONS,
  } = useAnime();

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
        onViewChange={handleViewChange}
        onLogoClick={handleLogoClick}
      />

      <main className="main-content">
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