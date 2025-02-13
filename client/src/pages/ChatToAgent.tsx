import React, { useState, useEffect } from 'react';
import { Agent } from '../interfaces/AgentInterfaces';
import { ChatHistory } from '../interfaces/ChatInterfaces';
import { useAgent } from '../context/AgentContext';
import AgentSelection from '../components/AgentSelection';
import ChatInterface from '../components/ChatInterface';
import useCharacters from '../hooks/useCharacters';

const ChatToAgent: React.FC = () => {
  const { state, dispatch } = useAgent();
  const { characters } = useCharacters();
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number>(-1);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ 
    agent_name: '',
    chat_history: [] 
  });

  useEffect(() => {
    if (state.selectedAgent) {
      const index = characters.findIndex(
        (char) => char.agent.agent_details.name === state.selectedAgent
      );
      if (index !== -1 && index !== selectedCharacterIndex) {
        setSelectedCharacterIndex(index);
        setSelectedAgent(characters[index]);
        setChatHistory({ agent_name: characters[index].agent.agent_details.name, chat_history: [] });
        console.log("Selected agent:", characters[index]);
      }
    }
  }, [state.selectedAgent, characters]);

  const handleSelectAgent = (index: number) => {
    const char = characters[index];
    if (char) {
      setSelectedCharacterIndex(index);
      setSelectedAgent(char);
      setChatHistory({ agent_name: char.agent.agent_details.name, chat_history: [] });
      dispatch({ type: 'SET_AGENT', payload: char.agent.agent_details.name });
      console.log("Agent selected:", char.agent.agent_details.name);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-center gap-4">
        <AgentSelection 
          selectedCharacterIndex={selectedCharacterIndex} 
          handleSelectAgent={handleSelectAgent} 
        />
      </div>
      <ChatInterface 
        selectedAgent={selectedAgent} 
        chatHistory={chatHistory} 
        setChatHistory={setChatHistory} 
      />
    </div>
  );
};

export default ChatToAgent;
