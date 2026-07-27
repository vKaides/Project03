import type { AniListAnime } from '../types/anime';

interface AnimeDetailPageProps {
  anime: AniListAnime;
  isFavorite: boolean;
  onToggleFavorite: (anime: AniListAnime) => void;
  onBackToHome: () => void;
  formatEpisodes: (episodes: number | null) => string;
  formatScore: (score: number | null) => string;
}

export function AnimeDetailPage({
  anime,
  isFavorite,
  onToggleFavorite,
  onBackToHome,
  formatEpisodes,
  formatScore,
}: AnimeDetailPageProps) {
  const title = anime.title.english || anime.title.romaji;
  const description = anime.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'No synopsis available yet.';

  return (
    <section className="anime-detail-page">
      <button type="button" className="detail-back-link" onClick={onBackToHome}>
        ← Back to home
      </button>

      <div className="detail-hero-card">
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={title}
          className="detail-hero-image"
        />

        <div className="detail-hero-content">
          <p className="favorites-label">Anime description</p>
          <h1 className="detail-title">{title}</h1>

          <div className="detail-actions">
            <button
              type="button"
              className={`favorite-toggle favorite-toggle-large ${isFavorite ? 'favorite-active' : ''}`}
              onClick={() => onToggleFavorite(anime)}
            >
              {isFavorite ? '♥ Saved' : '♡ Save'}
            </button>
            <span className="detail-pill">{formatEpisodes(anime.episodes)}</span>
            <span className="detail-pill">⭐ {formatScore(anime.averageScore)}</span>
          </div>

          <p className="detail-description">{description}</p>

          <div className="detail-meta-grid">
            <div>
              <span className="details-meta-label">Status</span>
              <p>{anime.status || 'Unknown'}</p>
            </div>
            <div>
              <span className="details-meta-label">Episodes</span>
              <p>{anime.episodes ?? '—'}</p>
            </div>
            <div>
              <span className="details-meta-label">Season</span>
              <p>
                {anime.seasonYear
                  ? `${anime.season || 'Unknown'} ${anime.seasonYear}`
                  : anime.season || 'Unknown'}
              </p>
            </div>
            <div>
              <span className="details-meta-label">Score</span>
              <p>{formatScore(anime.averageScore)}</p>
            </div>
          </div>

          {anime.genres && anime.genres.length > 0 && (
            <div className="details-tags">
              {anime.genres.map((genre) => (
                <span key={genre} className="details-tag">{genre}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
