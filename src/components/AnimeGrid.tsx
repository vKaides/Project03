import type { AniListAnime } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animeList: AniListAnime[];
  formatEpisodes: (episodes: number | null) => string;
  formatScore: (score: number | null) => string;
  isFavorite: (anime: AniListAnime) => boolean;
  onToggleFavorite: (anime: AniListAnime) => void;
  onSelectAnime: (anime: AniListAnime) => void;
}

export function AnimeGrid({
  animeList,
  formatEpisodes,
  formatScore,
  isFavorite,
  onToggleFavorite,
  onSelectAnime,
}: AnimeGridProps) {
  return (
    <div className="anime-grid">
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          formatEpisodes={formatEpisodes}
          formatScore={formatScore}
          isFavorite={isFavorite(anime)}
          onToggleFavorite={onToggleFavorite}
          onSelectAnime={onSelectAnime}
        />
      ))}
    </div>
  );
}