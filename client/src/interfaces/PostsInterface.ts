export interface Post {
    post_id: string;
    post_number: number;
    post_content: string;
    post_highlights?: string;
    post_posted: boolean;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeName?: string;
  }

export interface Episode {
  episode_number: number;
  episode_name: string;
  posts: Post[];
}

export interface Season {
  season_number: number;
  episodes: Episode[];
}