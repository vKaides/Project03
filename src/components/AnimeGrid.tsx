import type { AniListAnime } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animeList: AniListAnime[];
  formatEpisodes: (episodes: number | null) => string;
  formatScore: (score: number | null) => string;
}

export function AnimeGrid({ animeList, formatEpisodes, formatScore }: AnimeGridProps) {
  return (
    <div className="anime-grid">
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          formatEpisodes={formatEpisodes}
          formatScore={formatScore}
        />
      ))}
    </div>
  );
}