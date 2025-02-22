import React, { useState, useEffect } from "react";
import useCharacters from "../hooks/useCharacters";
import { Post, Episode, Season } from "../interfaces/PostsInterface";
import { createSeason, createEpisodePosts, postToTwitter, startPostManager, updateSeasons, deleteSeason, updateBackstory } from "../api/agentsAPI";
import { Button } from "../components/button";
import Notification from "../components/Notification.tsx";
import { useAgent } from '../context/AgentContext';
import AgentSelection from '../components/AgentSelection';
import BackstoryEditor from '../components/socialFeedComponents/BackstoryEditor';
import CharacterPosts from '../components/socialFeedComponents/CharacterPosts';
import SeasonTabs from '../components/socialFeedComponents/SeasonTabs';
import { formatTime, getCharacterPosts } from '../utils/SocialFeedUtils/SocialFeedUtils.ts';
import { Edit, Eye, Send } from 'lucide-react';

const SocialFeed: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const { state, dispatch } = useAgent();
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number>(-1);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [characterPosts, setCharacterPosts] = useState<Post[]>([]);
  const [unpostedCount, setUnpostedCount] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('generate');
  const [activeSubmenu, setActiveSubmenu] = useState<'sub1' | 'sub2'>('sub1');

  // Define the type for main tabs
  type MainTab = 'generate' | 'displayContent' | 'postContent' | 'placeholder3';

  // Define the type for submenu tabs
  type SubmenuTab = { id: 'sub1' | 'sub2'; label: string };

  const subMenuTabs: SubmenuTab[] = [
    { id: 'sub1', label: 'Submenu 1' },
    { id: 'sub2', label: 'Submenu 2' }
  ];

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
      setSelectedCharacter(selectedCharacter);
    }
  }, [selectedCharacter]);

  useEffect(() => {
    if (selectedCharacter && selectedSeason !== null) {
      const posts = getCharacterPosts(selectedCharacter).filter(post => post.seasonNumber === selectedSeason);
      setCharacterPosts(posts);
    }
  }, [selectedCharacter, selectedSeason]);

  useEffect(() => {
    setUnpostedCount(characterPosts.filter(post => !post.post_posted).length);
  }, [characterPosts]);

  const handleCharacterSelect = (index: number) => {
    const char = characters[index];
    console.log("Selected character:", char);

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

    dispatch({ type: 'SET_LOGGED_IN', payload: false });
    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const response = await startPostManager(selectedCharacter.agent.agent_details.name.replace(" ", "_"));

      if (response) {
        dispatch({ type: 'SET_LOGGED_IN', payload: true });
        setNotification({ message: "Logged in successfully!", type: 'success' });
      } else {
        setNotification({ message: "Please check your .env Twitter configuration.", type: 'error' });
      }
    } catch (error) {
      console.error("Error starting post manager:", error);

      if (error instanceof Error && error.message.includes("credentials")) {
        setNotification({ message: "Error: Missing or incorrect credentials. Please check your .env file.", type: 'error' });
      } else {
        setNotification({ message: "Please check your .env Twitter configuration", type: 'error' });
      }
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
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
        console.log("Post content to Twitter:", response);

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

        const updatedPosts = getCharacterPosts(selectedCharacter);
        setCharacterPosts(updatedPosts);
        setUnpostedCount(updatedPosts.filter(post => !post.post_posted).length);

        let agentName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
        await updateSeasons(agentName, updatedSeasons);

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

      const fullSeasonsArray = selectedCharacter.agent.seasons;
      const allPostsMap = new Map<string, Post>();

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

  const handleGenerateMultiplePosts = async (numPosts: number) => {
    if (!selectedCharacter || state.isGeneratingContent) return;

    dispatch({ type: 'SET_GENERATING_CONTENT', payload: true });
    try {
      const tempName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
      const masterFilePath = `configs/${tempName}/${tempName}_master.json`;

      console.log(`Creating Number of Posts: ${numPosts}`);
      await createSeason(masterFilePath);
      const updatedAgentWithPosts = await createEpisodePosts(masterFilePath, numPosts);
      setSelectedCharacter(updatedAgentWithPosts);
      const posts = getCharacterPosts(updatedAgentWithPosts);
      setCharacterPosts(posts);
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

  const handleDeleteSeason = async (seasonNumber: number) => {
    if (!selectedCharacter) return;

    const tempName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
    const masterFilePath = `configs/${tempName}/${tempName}_master.json`;

    try {
      const updatedAgent = await deleteSeason(masterFilePath, seasonNumber);
      setSelectedCharacter(updatedAgent);
      setCharacterPosts(getCharacterPosts(updatedAgent));
      setSelectedSeason(null);
    } catch (error) {
      console.error("Error deleting season:", error);
    }
  };

  const renderAgentContent = () => {
    if (!selectedCharacter) {
      return (
        <div className="flex flex-col h-[70vh] justify-center items-center">
          <h2 className="text-2xl font-bold text-white">Select an Agent</h2>
        </div>
      );
    }

    return (
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
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="relative z-10 flex flex-col h-full justify-center items-center">
          <div className="mb-4 pt-4 px-4 flex items-center relative w-full">
            <div className="flex flex-col items-center w-full text-center">
              <h2 className="text-2xl font-bold text-white font-semibold">
                {`${selectedCharacter.agent.agent_details.name}'s Feed`}
              </h2>
              <p className="text-gray-400 mb-2 font-semibold">
                {unpostedCount} Posts Remaining
              </p>
            </div>

          </div>


          <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Select Season</h3>
            <SeasonTabs
              selectedCharacter={selectedCharacter}
              selectedSeason={selectedSeason}
              handleSeasonSelect={handleSeasonSelect}
              handleDeleteSeason={handleDeleteSeason}
            />
          </div>

          <CharacterPosts
            characterPosts={characterPosts}
            selectedCharacter={selectedCharacter}
          />
        </div>
      </div>
    );
  };

  // Define a reusable component for the background
  const TabContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
      className="flex flex-col h-[70vh] relative"
      style={{
        backgroundImage: selectedCharacter?.agent.profile_image?.details?.url
          ? `url(${selectedCharacter.agent.profile_image.details.url})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-slate-900/80" />
      <div className="relative z-10 flex flex-col h-full justify-center items-center">
        {children}
      </div>
    </div>
  );

  // Update renderTabContent to render based on activeMainTab
  const renderTabContent = () => {
    switch (activeMainTab) {
      case 'generate':
        return (
          <TabContentWrapper>
            <div className="p-4 bg-slate-900 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <BackstoryEditor
                  selectedCharacter={selectedCharacter}
                  setSelectedCharacter={setSelectedCharacter}
                  handleGenerateMultiplePosts={handleGenerateMultiplePosts}
                />
              </div>
            </div>
          </TabContentWrapper>
        );
      case 'displayContent':
        return (
          <TabContentWrapper>
            {renderAgentContent()}
          </TabContentWrapper>
        );
      case 'postContent':
        return (
          <TabContentWrapper>
            <div className="p-4 bg-slate-900 rounded-lg shadow-md">
              <p className="text-gray-400 mb-2 font-semibold">
                {unpostedCount} Posts Remaining
              </p>
              <div className="text-white text-lg p-3 font-semibold">
                Next post in: {formatTime(state.timeLeft)}
              </div>
              <div className="flex gap-4 justify-center p-3">
                <Button
                  onClick={handleStartPostManager}
                  className={`${state.isLoggedIn
                    ? "bg-green-400 hover:bg-green-500"
                    : "bg-orange-400 hover:bg-orange-500"
                  }`}
                >
                  {state.isLoggedIn ? "Logged in" : "Login to Twitter"}
                </Button>

                <Button
                  onClick={handlePostToTwitter}
                  className={`${state.isPosting ? "bg-green-500 hover:bg-green-400" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {state.isPosting ? "Posting..." : "Post to Twitter"}
                </Button>
              </div>
            </div>
          </TabContentWrapper>
        );
      case 'placeholder3':
        return (
          <TabContentWrapper>
            <div className="p-4 bg-slate-900 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-white">Placeholder 3</h3>
              <p className="text-gray-400">Content for Placeholder 3...</p>
            </div>
          </TabContentWrapper>
        );
      default:
        return null;
    }
  };

  // Function to render the content based on the active submenu
  const renderSubmenuContent = () => {
    switch (activeSubmenu) {
      case 'sub1':
        return <div>Content for Submenu 1</div>;
      case 'sub2':
        return <div>Content for Submenu 2</div>;
      default:
        return null;
    }
  };



  return (
    <div className="container mx-auto max-w-4xl">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-left gap-4 mb-4 p-4 ">
        <Button onClick={() => setActiveMainTab('generate')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeMainTab === 'generate' ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' : 'text-gray-400 hover:text-cyan-400'}`}>
          <Edit size={20} />
          Generate
        </Button>
        <Button onClick={() => setActiveMainTab('displayContent')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeMainTab === 'displayContent' ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' : 'text-gray-400 hover:text-cyan-400'}`}>
          <Eye size={20} />
          Display Content
        </Button>
        <Button onClick={() => setActiveMainTab('postContent')} className={`flex items-center gap-2 px-4 py-2 rounded ${activeMainTab === 'postContent' ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' : 'text-gray-400 hover:text-cyan-400'}`}>
          <Send size={20} />
          Post Content
        </Button>

      </div>
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

      {renderTabContent()}
      {renderSubmenuContent()}

    </div>
  );
};

export default SocialFeed;