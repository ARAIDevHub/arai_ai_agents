import useFetchCharacters from './useFetchCharacters';
import useProcessCharacters from './useProcessCharacters';
import useCharacterSelection from './useCharacterSelection';
import { useEffect } from 'react';

/**
 * useCharacters - A composed custom hook to manage character data and selection.
 *
 * Responsibilities:
 * 1. Fetches raw character data using `useFetchCharacters`.
 * 2. Processes raw character data into a usable format using `useProcessCharacters`.
 * 3. Manages character selection logic using `useCharacterSelection`.
 * 4. Automatically selects the first character by default when characters are loaded.
 */
const useCharacters = () => {
  const { characters: rawCharacters, loading, error } = useFetchCharacters(); // Fetch raw characters and track fetch state.
  const processedCharacters = useProcessCharacters(rawCharacters); // Process the raw characters into a usable format.
  const { selectedCharacter, handleCharacterSelect, setSelectedCharacter } = useCharacterSelection(); // Manage character selection.

  // Automatically select the first character when characters are loaded.
  useEffect(() => {
    if (!selectedCharacter && processedCharacters.length > 0) {
      handleCharacterSelect(processedCharacters[0]); // Select the first character by default.
    }
    console.log('[ProcessedCharacters] - processedCharacters:', processedCharacters);  
  }, [processedCharacters, selectedCharacter, handleCharacterSelect]);

  return {
    characters: processedCharacters, // The processed characters data.
    selectedCharacter, // The currently selected character.
    setSelectedCharacter, // Function to manually update the selected character.
    loading, // Whether the characters are still being fetched.
    error, // Any error that occurred during the fetch.
    handleCharacterSelect, // Function to select a character.
  };
};

export default useCharacters;
