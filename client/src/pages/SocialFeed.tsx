import React, { useState, useEffect, useRef } from "react";
import useCharacters from "../hooks/useCharacters";
import { Post, Episode, Season } from "../interfaces/PostsInterface";
import { createSeason, createEpisodePosts, postToTwitter, startPostManager, updateSeasons, deleteSeason } from "../api/agentsAPI";
import { Button } from "../components/button";
import Notification from "../components/Notification.tsx";
import { useAgent } from '../context/AgentContext'; // Import the useAgent hook
import AgentSelection from '../components/AgentSelection';

const SocialFeed: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const { state, dispatch } = useAgent();
  const [selectedCharacterIndex, setSelectedCharacterIndex] =
    useState<number>(-1);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [characterPosts, setCharacterPosts] = useState<Post[]>([]);
  const [unpostedCount, setUnpostedCount] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [draftConcept, setDraftConcept] = useState<string>("");
  const [numPostsToGenerate, setNumPostsToGenerate] = useState<number>(1);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    if (state.selectedAgent) {
      const index = characters.findIndex(
        (char) => char.agent.agent_details.name === state.selectedAgent
      );

      if (index !== -1 && index !== selectedCharacterIndex) {
        const char = characters[index];
        if (char) {
          handleCharacterSelect(index);
        }
      }
    }
  }, [state.selectedAgent, characters, selectedCharacterIndex]);

  useEffect(() => {
    if (selectedCharacter) {
      setDraftConcept(selectedCharacter.agent.concept || "");
    }
  }, [selectedCharacter]);

  useEffect(() => {
    if (selectedCharacter && selectedSeason !== null) {
      const posts = getCharacterPosts(selectedCharacter).filter(post => post.seasonNumber === selectedSeason);
      setCharacterPosts(posts);
    }
  }, [selectedCharacter, selectedSeason]);

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

  const handleCharacterSelect = (index: number) => {
    const char = characters[index];
    console.log("Selected character:", char); // Debugging log

    if (!char || !char.agent || !char.agent.agent_details) {
      console.error("Character or agent details are undefined");
      return;
    }

    setSelectedCharacterIndex(index);
    setSelectedCharacter(char);
    dispatch({ type: 'SET_AGENT', payload: char.agent.agent_details.name });
    const posts = getCharacterPosts(char);
    setCharacterPosts(posts);

    const unpostedPosts = posts.filter(post => !post.post_posted);
    setUnpostedCount(unpostedPosts.length);
  };

  const handleStartPostManager = async () => {
    if (!selectedCharacter) return;

    dispatch({ type: 'SET_LOGGED_IN', payload: false }); // Ensure initial state is not logged in
    dispatch({ type: 'SET_GENERATING', payload: true }); // Set logging in state to true

    try {
      const response = await startPostManager(selectedCharacter.agent.agent_details.name.replace(" ", "_"));

      if (response) {
        dispatch({ type: 'SET_LOGGED_IN', payload: true }); // Set logged in state to true
        setNotification({ message: "Logged in successfully!", type: 'success' });
      } else {
        setNotification({ message: "Please check your .env Twitter configuration.", type: 'error' });
      }
    } catch (error) {
      console.error("Error starting post manager:", error);

      // Check for specific error conditions
      if (error instanceof Error && error.message.includes("credentials")) {
        setNotification({ message: "Error: Missing or incorrect credentials. Please check your .env file.", type: 'error' });
      } else {
        setNotification({ message: "Please check your .env Twitter configuration", type: 'error' });
      }
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false }); // Reset logging in state
    }
  };

  const handlePostToTwitter = async () => {
    dispatch({ type: 'SET_POSTING', payload: !state.isPosting });
    if (state.isPosting) {
      return;
    }

    const unpostedPosts = characterPosts.filter(post => !post.post_posted);

    const postContentToTwitter = async (post: Post) => {
      try {
        const response = await postToTwitter(selectedCharacter.agent.agent_details.name.replace(" ", "_"), post.post_content);

        // Update the post status in the selectedCharacter
        const updatedSeasons = selectedCharacter.agent.seasons.map((season: Season) => {
          return {
            ...season,
            episodes: season.episodes.map((episode: Episode) => {
              return {
                ...episode,
                posts: episode.posts.map((p: Post) => {
                  if (p.post_id === post.post_id) {
                    return { ...p, post_posted: true };
                  }
                  return p;
                })
              };
            })
          };
        });

        setSelectedCharacter({
          ...selectedCharacter,
          agent: {
            ...selectedCharacter.agent,
            seasons: updatedSeasons
          }
        });

        setCharacterPosts([...characterPosts]);
        setUnpostedCount(prevCount => prevCount - 1);

        // Update the JSON file to mark the post as posted
        let agentName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
        await updateSeasons(agentName, updatedSeasons);

        // Set hasPosted to true after the first post
        if (!state.hasPosted) {
          dispatch({ type: 'SET_HAS_POSTED', payload: true });
          dispatch({ type: 'SET_TIME_LEFT', payload: state.delayBetweenPosts * 60 });
        }
      } catch (error) {
        console.error("Error posting to Twitter:", error);
      }
    };

    const postLoop = async (posts: Post[], delayInMinutes: number) => {
      const delayInMilliseconds = delayInMinutes * 60 * 1000;

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
          let agentName = selectedCharacter.agent.agent_details.name.replace(" ", "_");

          // Update the post_posted status using the allPostsMap
          if (allPostsMap.has(post.post_id)) {
            allPostsMap.get(post.post_id)!.post_posted = true;
          }

          await updateSeasons(agentName, fullSeasonsArray);
        } catch (error) {
          console.error("Error updating agent:", error);
        }

        await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
        dispatch({ type: 'SET_TIME_LEFT', payload: delayInMinutes * 60 });
      }
    };

    postLoop(unpostedPosts, state.delayBetweenPosts);
  };

  const handleConceptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftConcept(e.target.value);
  };

  const handleNumPostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumPostsToGenerate(Number(e.target.value));
  };

  const handleGenerateMultiplePosts = async () => {
    if (!selectedCharacter || state.isGeneratingContent) return;

    dispatch({ type: 'SET_GENERATING_CONTENT', payload: true });
    try {
      const tempName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
      const masterFilePath = `configs/${tempName}/${tempName}_master.json`;

      // for (let i = 0; i < numPostsToGenerate; i++) {
      console.log(`Creating Number of Posts: ${numPostsToGenerate}`);
        await createSeason(masterFilePath);
        const updatedAgentWithPosts = await createEpisodePosts(masterFilePath, numPostsToGenerate);
        setSelectedCharacter(updatedAgentWithPosts);
        const posts = getCharacterPosts(updatedAgentWithPosts);
        setCharacterPosts(posts);
      // }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      dispatch({ type: 'SET_GENERATING_CONTENT', payload: false });
    }
  };

  const handleSeasonSelect = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    const posts = getCharacterPosts(selectedCharacter).filter(post => post.seasonNumber === seasonNumber);
    setCharacterPosts(posts);
  };

  // Add this function to handle season deletion
  const handleDeleteSeason = async (seasonNumber: number) => {
    if (!selectedCharacter) return;

    const tempName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
    const masterFilePath = `configs/${tempName}/${tempName}_master.json`;

    try {
      const updatedAgent = await deleteSeason(masterFilePath, seasonNumber);
      setSelectedCharacter(updatedAgent);
      setCharacterPosts(getCharacterPosts(updatedAgent));
      setSelectedSeason(null); // Reset selected season
    } catch (error) {
      console.error("Error deleting season:", error);
    }
  };

  // Add a button for deleting the season in the renderSeasonTabs function
  const renderSeasonTabs = () => {
    if (!selectedCharacter) return null;

    return (
      <div className="flex space-x-4 mb-4">
        {selectedCharacter.agent.seasons.map((season: Season) => (
          <div key={season.season_number} className="flex items-center">
            <button
              onClick={() => handleSeasonSelect(season.season_number)}
              className={`px-4 py-2 rounded-lg ${
                selectedSeason === season.season_number
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-800 text-gray-400"
              }`}
            >
              Season {season.season_number}
            </button>
            <button
              onClick={() => handleDeleteSeason(season.season_number)}
              className="ml-2 px-2 py-1 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800 text-gray-300 rounded-lg p-4 border border-cyan-800 text-center mt-8">
        Loading ARAI AI Agents Network...
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
    <div className="container mx-auto max-w-4xl">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex p-3 items-center justify-center gap-4">
        <AgentSelection 
          selectedCharacterIndex={selectedCharacterIndex} 
          handleSelectAgent={handleCharacterSelect} 
        />
        <div className="flex items-center">
          <label htmlFor="delayInput" className="text-lg font-semibold text-white mr-2">
            Post Delay (min):
          </label>
          <input
            id="delayInput"
            type="number"
            value={state.delayBetweenPosts}
            onChange={(e) => dispatch({ type: 'SET_DELAY', payload: Number(e.target.value) })}
            min="0"
            className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800 font-semibold"
          />
        </div>
      </div>
      {selectedCharacter && (
        <div
          className="flex flex-col h-[70vh] relative"
          style={{
            backgroundImage: selectedCharacter.agent.profile_image?.details?.url
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
                Next post in: {formatTime(state.timeLeft)}
              </div>
            </div>

            {/* Concept Section */}
            <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">Content Generation Concept</h3>
              <textarea
                value={draftConcept}
                onChange={handleConceptChange}
                className="w-full p-2 bg-slate-800 text-white rounded-lg border border-cyan-800"
                rows={4}
              />
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  value={numPostsToGenerate}
                  onChange={handleNumPostsChange}
                  min="1"
                  className="w-16 p-2 bg-slate-800 text-white rounded-lg border border-cyan-800 mr-2"
                />
                <Button
                  onClick={handleGenerateMultiplePosts}
                  disabled={state.isGeneratingContent}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isGeneratingContent ? "Generating..." : `Generate ${numPostsToGenerate} Posts`}
                </Button>
              </div>
            </div>

            {selectedCharacter && (
              <div className="flex gap-4 justify-center p-3">
                {/* <Button
                  onClick={handleGenerateContent}
                  disabled={state.isGenerating}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isGenerating ? "Generating..." : "Generate Posts Content"}
                </Button> */}

                <Button
                  onClick={handleStartPostManager}
                  className={`${
                    state.isLoggedIn
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-orange-400 hover:bg-orange-500"
                  }`}
                >
                  {state.isLoggedIn ? "Logged in" : "Login to Twitter"}
                </Button>

                <Button
                  onClick={handlePostToTwitter}
                  className={`${
                    state.isPosting ? "bg-green-500 hover:bg-green-400" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {state.isPosting ? "Posting..." : "Post to Twitter"}
                </Button>

              </div>
            )}

            {selectedCharacter && (
              <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
                <h3 className="text-lg font-semibold text-white mb-2">Select Season</h3>
                {renderSeasonTabs()}
              </div>
            )}

            {/* Posts Feed */}
            <div className="flex-grow overflow-y-auto space-y-4 ">
              {characterPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="relative max-w-2xl mx-auto slate-800/30 p-6 rounded-lg backdrop-blur-sm border border-orange-500/30"
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
                    <div className="mt-4 mb-4 bg-slate-900/50 rounded-lg p-4 border-l-2 border-orange-500/30">
                      <p className="text-gray-400 text-sm italic">
                        {post.post_highlights}
                      </p>
                    </div>
                  )}

                  {/* Post Content */}
                  <p className="text-gray-300 mb-2 whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg">
                    {post.post_content}
                  </p>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;