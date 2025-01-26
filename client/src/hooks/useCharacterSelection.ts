import { useState } from 'react';

/**
 * useCharacterSelection - A custom hook to manage character selection logic.
 *
 * Responsibilities:
 * 1. Manages the `selectedCharacter` state.
 * 2. Provides a function (`handleCharacterSelect`) to update the selected character.
 * 3. Ensures the selected character data is validated before updating.
 */
const useCharacterSelection = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Holds the currently selected character.

  /**
   * handleCharacterSelect - Updates the selected character.
   * 
   * @param character - The character to select.
   */
  const handleCharacterSelect = (character: any) => {
    if (!character?.agent?.agent_details) {
      console.error('Invalid character data'); // Log an error if the character data structure is invalid.
      return;
    }
    setSelectedCharacter(character); // Update the selected character state.
  };

  return { selectedCharacter, handleCharacterSelect, setSelectedCharacter }; // Return the state and handlers for character selection.
};

export default useCharacterSelection;
