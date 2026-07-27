import type { AniListAnime } from '../types/anime';

interface AnimeCardProps {
  anime: AniListAnime;
  formatEpisodes: (episodes: number | null) => string;
  formatScore: (score: number | null) => string;
  isFavorite: boolean;
  onToggleFavorite: (anime: AniListAnime) => void;
  onSelectAnime: (anime: AniListAnime) => void;
}

export function AnimeCard({
  anime,
  formatEpisodes,
  formatScore,
  isFavorite,
  onToggleFavorite,
  onSelectAnime,
}: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;

  return (
    <article className="anime-card" onClick={() => onSelectAnime(anime)}>
      <div className="anime-card-poster">
        <img
          src={anime.coverImage.large}
          alt={title}
          className="anime-card-img"
          loading="lazy"
        />

        <button
          type="button"
          className={`favorite-toggle ${isFavorite ? 'favorite-active' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(anime);
          }}
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <span className="anime-card-episode-badge">
          {formatEpisodes(anime.episodes)}
        </span>

        <span className="anime-card-score-badge">
          ⭐ {formatScore(anime.averageScore)}
        </span>

        <div className="anime-card-overlay">
          <div className="play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <h3 className="anime-card-title">{title}</h3>
      {anime.description && (
        <p className="anime-card-description">
          {anime.description.replace(/<[^>]+>/g, '').slice(0, 90)}
          {anime.description.replace(/<[^>]+>/g, '').length > 90 ? '...' : ''}
        </p>
      )}
    </article>
  );
}