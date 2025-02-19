import { Post, Season, Episode } from '../../interfaces/PostsInterface';

// Utility function to format time
export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Utility function to get character posts
export const getCharacterPosts = (character: any) => {
  if (!character?.agent?.seasons) return [];

  const allPosts: Post[] = [];

  character.agent.seasons.forEach((season: Season) => {
    season.episodes.forEach((episode: Episode) => {
      if (episode.posts && Array.isArray(episode.posts)) {
        const episodePosts = episode.posts.map((post: Post) => ({
          ...post,
          seasonNumber: season.season_number,
          episodeNumber: episode.episode_number,
          episodeName: episode.episode_name,
        }));
        allPosts.push(...episodePosts);
      }
    });
  });

  // Sort posts by season number, episode number, and post number
  return allPosts.sort((a, b) => {
    const aSeasonNum = a.seasonNumber ?? 0;
    const bSeasonNum = b.seasonNumber ?? 0;
    const aEpisodeNum = a.episodeNumber ?? 0;
    const bEpisodeNum = b.episodeNumber ?? 0;

    if (aSeasonNum !== bSeasonNum) {
      return aSeasonNum - bSeasonNum;
    }
    if (aEpisodeNum !== bEpisodeNum) {
      return aEpisodeNum - bEpisodeNum;
    }
    return a.post_number - b.post_number;
  });
}; 