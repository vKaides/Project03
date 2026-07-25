import type { AniListAnime } from '../types/anime';

interface AnimeCardProps {
  anime: AniListAnime;
  formatEpisodes: (episodes: number | null) => string;
  formatScore: (score: number | null) => string;
}

export function AnimeCard({ anime, formatEpisodes, formatScore }: AnimeCardProps) {
  return (
    <div className="anime-card">
      <div className="anime-card-poster">
        <img
          src={anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          className="anime-card-img"
          loading="lazy"
        />

        {/* Episode badge - top left */}
        <span className="anime-card-episode-badge">
          {formatEpisodes(anime.episodes)}
        </span>

        {/* Score badge - bottom right */}
        <span className="anime-card-score-badge">
          ⭐ {formatScore(anime.averageScore)}
        </span>

        {/* Hover overlay with play button */}
        <div className="anime-card-overlay">
          <div className="play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <h3 className="anime-card-title">
        {anime.title.english || anime.title.romaji}
      </h3>
    </div>
  );
}