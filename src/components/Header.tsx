import { MegaMenu } from './MegaMenu';
import type { Category } from '../hooks/useAnime';

interface HeaderProps {
  searchTerm: string;
  hasSearched: boolean;
  activeCategory: Category;
  categories: { key: Category; label: string }[];
  viewMode: 'home' | 'schedule';
  viewOptions: { key: 'home' | 'schedule'; label: string }[];
  onSearchTermChange: (value: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onCategoryClick: (cat: Category) => void;
  onGenreFilter: (genre: string | null) => void;
  onViewChange: (view: 'home' | 'schedule') => void;
  onLogoClick: () => void;
}

export function Header({
  searchTerm,
  hasSearched,
  activeCategory,
  categories,
  viewMode,
  viewOptions,
  onSearchTermChange,
  onSearch,
  onClear,
  onCategoryClick,
  onGenreFilter,
  onViewChange,
  onLogoClick,
}: HeaderProps) {
  const handleFilterCategory = (slug: string) => {
    // Convert slug to a proper genre name (capitalize, hyphen to space)
    const genre = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    onGenreFilter(genre);
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <button
          type="button"
          className="logo-button"
          onClick={onLogoClick}
          aria-label="Go to the main anime list"
        >
          <img src="/AniProject.png" alt="AniProject" />
        </button>

        <nav className="header-nav">
          {viewOptions.map(({ key, label }) => (
            <a
              key={key}
              href="#"
              className={viewMode === key ? 'nav-active' : ''}
              onClick={(e) => { e.preventDefault(); onViewChange(key); }}
            >
              {label}
            </a>
          ))}

          {categories.map(({ key, label }) => (
            <a
              key={key}
              href="#"
              className={activeCategory === key && viewMode === 'home' ? 'nav-active' : ''}
              onClick={(e) => { e.preventDefault(); onCategoryClick(key); }}
            >
              {label}
            </a>
          ))}

          <span
            style={{
              width: '1px',
              height: '20px',
              background: 'var(--border)',
              margin: '0 4px',
              flexShrink: 0,
            }}
          />
          <MegaMenu onSelectCategory={handleFilterCategory} />
        </nav>

        <form className="header-search-wrapper" onSubmit={onSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search anime..."
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn">
            Search
          </button>
          {hasSearched && (
            <button
              type="button"
              onClick={onClear}
              className="header-search-btn"
              style={{ background: 'transparent', border: '1px solid var(--border)' }}
            >
              ✕
            </button>
          )}
        </form>
      </div>
    </header>
  );
}