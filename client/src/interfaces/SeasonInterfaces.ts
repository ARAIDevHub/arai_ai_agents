export interface Post {
  post_id: string;
  post_number: number;
  post_content: string;
  post_highlights: string;
  post_posted: boolean;
}

export interface Episode {
  episode_name: string;
  episode_number: number;
  episode_description: string;
  episode_highlights: string;
  episode_summary: string;
  episode_posted: boolean;
  current_post_number: number;
  posts: Post[];
}

export interface Season {
  season_name: string;
  season_number: number;
  season_description: string;
  season_highlights: string;
  season_summary: string;
  season_posted: false;
  current_episode_number: number;
  episodes: Episode[];
} 