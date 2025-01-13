import { Post } from './PostsInterface';

export interface Episode {
    episode_name: string;
    episode_number: number;
    posts: Post[];
  }
  
  export interface Season {
    season_name: string;
    season_number: number;
    episodes: Episode[];
  }
  