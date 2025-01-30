import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the shape of the state
interface AgentState {
  selectedAgent: string | null;
  isButtonActive: boolean; // Example state for a button
  isGenerating: boolean;
  isLoggedIn: boolean;
  isPosting: boolean;
  delayBetweenPosts: number; // Add delayBetweenPosts to the state
}

// Define the actions
type Action = 
  | { type: 'SET_AGENT'; payload: string }
  | { type: 'TOGGLE_BUTTON'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'SET_POSTING'; payload: boolean }
  | { type: 'SET_DELAY'; payload: number }; // Add action for setting delay

// Create the context
const AgentContext = createContext<{
  state: AgentState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Define the reducer
const agentReducer = (state: AgentState, action: Action): AgentState => {
  console.log(`[Agentcontext] - agentReducer called with state: ${JSON.stringify(state)} and action: ${JSON.stringify(action)}`);
  switch (action.type) {
    case 'SET_AGENT':
      return { ...state, selectedAgent: action.payload };
    case 'TOGGLE_BUTTON':
      return { ...state, isButtonActive: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_POSTING':
      return { ...state, isPosting: action.payload };
    case 'SET_DELAY':
      return { ...state, delayBetweenPosts: action.payload }; // Handle delay action
    default:
      throw new Error(`Unhandled action type:`);
  }
};

// Create a provider component
export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, { 
    selectedAgent: null,
    isButtonActive: false, // Initialize the button state
    isGenerating: false,
    isLoggedIn: false,
    isPosting: false,
    delayBetweenPosts: 5 // Initialize delay with a default value
  });

  return (
    <AgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook to use the AgentContext
export const useAgent = () => {
  console.log("[Agentcontext] - useAgent hook called");
  const context = useContext(AgentContext);
  console.log(`[Agentcontext] - useAgent hook called with context: ${JSON.stringify(context)}`);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}; 