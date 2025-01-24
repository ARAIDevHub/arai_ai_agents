import React, { useState, useEffect } from "react";
import useCharacters from "../hooks/useCharacters";
import { MessageSquare, Heart } from "lucide-react";
import { Post, Episode, Season } from "../interfaces/PostsInterface";
import { createSeason, createEpisodePosts, postToTwitter, startPostManager,updateSeasons } from "../api/agentsAPI";
import { Button } from "../components/button";

const SocialFeed: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const [selectedCharacterIndex, setSelectedCharacterIndex] =
    useState<number>(-1);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [characterPosts, setCharacterPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [delayBetweenPosts, setDelayBetweenPosts] = useState<number>(5); // Default delay of 5 minutes
  const [timeLeft, setTimeLeft] = useState<number>(delayBetweenPosts * 60); // Initialize with delay in seconds
  const [unpostedCount, setUnpostedCount] = useState<number>(0);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Update timeLeft whenever delayBetweenPosts changes
    setTimeLeft(delayBetweenPosts * 60);
  }, [delayBetweenPosts]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getCharacterPosts = (character: any) => {
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
      // Provide default values in case of undefined
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

  const handleCharacterSelect = (char: any, index: number) => {
    setSelectedCharacterIndex(index);
    setSelectedCharacter(char);
    const posts = getCharacterPosts(char);
    setCharacterPosts(posts);
    console.log("Posts loaded:", posts.length);

    // Log the current selected agent
    console.log("Current selected agent:", char);

    const unpostedPosts = posts.filter(post => !post.post_posted);
    setUnpostedCount(unpostedPosts.length);
  };

  const handleGenerateContent = async () => {
    if (!selectedCharacter || isGenerating) return;

    setIsGenerating(true);
    try {
      // Extract the master file path from the character
      const masterFilePath = `configs/${selectedCharacter.agent.agent_details.name}/${selectedCharacter.agent.agent_details.name}_master.json`;

      // First create new season
      await createSeason(masterFilePath);

      // Then create posts for episodes
      const updatedAgentWithPosts = await createEpisodePosts(masterFilePath);

      // Update the selected character with final data
      setSelectedCharacter(updatedAgentWithPosts);

      // Update posts
      const posts = getCharacterPosts(updatedAgentWithPosts);
      setCharacterPosts(posts);
    } catch (error) {
      console.error("Error generating content:", error);
      // Handle error (show notification, etc.)
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartPostManager = async () => {
    if (!selectedCharacter) return;

    try {
      console.log("Starting post manager for:", selectedCharacter.agent.agent_details.name);
      const response = await startPostManager(selectedCharacter.agent.agent_details.name);
      console.log("Post manager started successfully:", response);
    } catch (error) {
      console.error("Error starting post manager:", error);
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handlePostToTwitter = async () => {
    if (!selectedCharacter) return;

    // Toggle posting state
    setIsPosting(!isPosting);

    if (isPosting) {
      // If already posting, stop the process
      console.log("Stopping post to Twitter.");
      return;
    }

    const unpostedPosts = characterPosts.filter(post => !post.post_posted);

    const postContentToTwitter = async (post: Post) => {
      try {
        console.log("Posting to Twitter for:", selectedCharacter.agent.agent_details.name);
        const response = await postToTwitter(selectedCharacter.agent.agent_details.name, post.post_content);
        console.log("Posted to Twitter successfully:", response);

        post.post_posted = true;
        setCharacterPosts([...characterPosts]);
        setUnpostedCount(prevCount => prevCount - 1);
      } catch (error) {
        console.error("Error posting to Twitter:", error);
      }
    };

    const postLoop = async (posts: Post[], delayInMinutes: number) => {
      const delayInMilliseconds = delayInMinutes * 60 * 1000; // Convert minutes to milliseconds

      // Reset the timer at the start of the post loop
      setTimeLeft(delayInMinutes * 60);

      // Create a map of all posts in the fullSeasonsArray
      const fullSeasonsArray = selectedCharacter.agent.seasons;
      const allPostsMap = new Map<string, Post>();

      // Create a map of all posts in the fullSeasonsArray
      fullSeasonsArray.forEach((season: Season) => {
        season.episodes.forEach((episode: Episode) => {
          episode.posts.forEach((p: Post) => {
            allPostsMap.set(p.post_id, p);
          });
        });
      });

      for (const post of posts) {
        await postContentToTwitter(post);
        post.post_posted = true;
        setCharacterPosts([...characterPosts]);

        try {
          let agentName = selectedCharacter.agent.agent_details.name;

          // Update the post_posted status using the allPostsMap
          if (allPostsMap.has(post.post_id)) {
            allPostsMap.get(post.post_id)!.post_posted = true;
          }

          // Attempt to update the agent's master data with the full seasons array
          console.log("postLoop - Updating agent with full seasons array:", selectedCharacter);
          await updateSeasons(agentName, fullSeasonsArray);
          console.log("postLoop - Updating agent with Name:", agentName);
          console.log("postLoop - Updating agent with Seasons:", fullSeasonsArray);

          console.log("Agent updated successfully.");
        } catch (error) {
          console.error("Error updating agent:", error);
        }

        console.log(`Waiting for ${delayInMilliseconds} milliseconds before next post.`);
        await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));

        // Reset the timer after each post
        setTimeLeft(delayInMinutes * 60);
      }
    };

    console.log("Starting post loop with delay:", delayBetweenPosts, "minutes");
    startCountdown(); // Start the countdown when posting begins
    postLoop(unpostedPosts, delayBetweenPosts);
  };

  if (loading) {
    return (
      <div className="bg-slate-800 text-gray-300 rounded-lg p-4 border border-cyan-800 text-center mt-8">
        Loading AI Network...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 text-gray-300 rounded-lg p-4 border border-red-800 text-center mt-8">
        No Existing Agents - {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto  max-w-4xl">
      {/* Agent Selection Row */}
      <div className=" flex p-3 items-center justify-center gap-4">
        <div className="flex items-center">
          <label className="text-lg font-semibold text-white mr-2">
            Select Agent:
          </label>
          <select
            className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800 "
            onChange={(e) => {
              const index = parseInt(e.target.value);
              const char = characters[index];
              if (char) handleCharacterSelect(char, index);
            }}
            value={selectedCharacterIndex}
          >
            <option value={-1} className="text-white font-semibold">
              Select an Agent
            </option>
            {characters.map((char, index) => (
              <option key={index} value={index}>
                {char.agent.agent_details.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="delayInput" className="text-lg font-semibold text-white mr-2">
            Post Delay (min):
          </label>
          <input
            id="delayInput"
            type="number"
            value={delayBetweenPosts}
            onChange={(e) => setDelayBetweenPosts(Number(e.target.value))}
            min="0"
            className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800 font-semibold"
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div
        className="flex flex-col h-[70vh] relative"
        style={{
          backgroundImage: selectedCharacter?.agent?.profile_image?.details?.url
            ? `url(${selectedCharacter.agent.profile_image.details.url})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Add an overlay div for opacity */}
        <div className="absolute inset-0 bg-slate-900/80" />

        {/* Wrap content in relative div to appear above overlay */}
        <div className="relative z-10 flex flex-col h-full justify-center items-center">
          {/* Feed Header */}
          <div className="mb-4 pt-4 px-4 flex items-center relative w-full">
            <div className="flex flex-col items-center w-full text-center">
              <h2 className="text-2xl font-bold text-white font-semibold">
                {selectedCharacter
                  ? `${selectedCharacter.agent.agent_details.name}'s Feed`
                  : "Select an Agent"}
              </h2>
              <p className="text-gray-400 mb-2 font-semibold">
                {unpostedCount} Posts Remaining
              </p>
            </div>
            <div className="absolute right-0 text-white text-lg p-3 font-semibold">
              Next post in: {formatTime(timeLeft)}
            </div>
          </div>

          {selectedCharacter && (
            <div className="flex gap-4 justify-center p-3">
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate Posts Content"}
              </Button>

              <Button
                onClick={handleStartPostManager}
                className="bg-orange-400 hover:bg-orange-500"
              >
                Login to Twitter
              </Button>

              <Button
                onClick={handlePostToTwitter}
                className={`${
                  isPosting ? "bg-green-500 hover:bg-green-400" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isPosting ? "Posting..." : "Post to Twitter"}
              </Button>

            </div>
          )}

          {/* Posts Feed */}
          <div className="flex-grow overflow-y-auto space-y-4 p-4">
            {characterPosts.map((post) => (
              <div
                key={post.post_id}
                className="relative max-w-2xl mx-auto bg-slate-900/80 p-6 rounded-lg backdrop-blur-sm border border-cyan-900/50"
              >
                {/* Post Status Label */}
                <div
                  className={`absolute top-4 right-4 px-2 py-1 rounded text-sm font-semibold ${
                    post.post_posted
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {post.post_posted ? "Posted" : "Not Posted"}
                </div>

                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600"
                    style={{
                      backgroundImage: selectedCharacter?.agent.profile_image
                        ?.details?.url
                        ? `url(${selectedCharacter.agent.profile_image.details.url})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-cyan-400 text-left">
                      {selectedCharacter?.agent.agent_details.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <span>
                        Season {post.seasonNumber || 0}, Episode{" "}
                        {post.episodeNumber || 0}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Post {post.post_number}</span>
                    </div>
                  </div>
                </div>

                {/* Post Highlights */}
                {post.post_highlights && (
                  <div className="mt-4 mb-4 bg-slate-800/30 rounded-lg p-4 border-l-2 border-cyan-500/30">
                    <p className="text-gray-400 text-sm italic">
                      {post.post_highlights}
                    </p>
                  </div>
                )}

                {/* Post Content */}
                <p className="text-gray-300 mb-2 whitespace-pre-wrap">
                  {post.post_content}
                </p>

                {/* Post Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
                  <div className="flex space-x-4 text-sm text-gray-400">
                    <button className="flex items-center space-x-2 hover:text-cyan-400 transition duration-300">
                      <Heart className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 50)}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-cyan-400 transition duration-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 20)}</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
