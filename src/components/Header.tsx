import type { Category } from '../hooks/useAnime';

interface HeaderProps {
  searchTerm: string;
  hasSearched: boolean;
  activeCategory: Category;
  categories: { key: Category; label: string }[];
  onSearchTermChange: (value: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onCategoryClick: (cat: Category) => void;
  onLogoClick: () => void;
}

export function Header({
  searchTerm,
  hasSearched,
  activeCategory,
  categories,
  onSearchTermChange,
  onSearch,
  onClear,
  onCategoryClick,
  onLogoClick,
}: HeaderProps) {
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
          {categories.map(({ key, label }) => (
            <a
              key={key}
              href="#"
              className={activeCategory === key ? 'nav-active' : ''}
              onClick={(e) => { e.preventDefault(); onCategoryClick(key); }}
            >
              {label}
            </a>
          ))}
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