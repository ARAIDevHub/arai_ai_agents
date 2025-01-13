export interface Post {
    post_id: string;
    post_number: number;
    post_content: string;
    post_highlights: string;
    post_posted: boolean;
    seasonNumber?: number;
    episodeNumber?: number;
    episodeName?: string;
  }