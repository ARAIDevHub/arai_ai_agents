import { useState, useEffect } from 'react';
import { getCharacters } from '../api/agentsAPI';

/**
 * useFetchCharacters - A custom hook to fetch characters from the API.
 *
 * Responsibilities:
 * 1. Handles the API call to GET/fetch character data.
 * 2. Manages the state for `characters`, `loading`, and `error`.
 * 3. Provides feedback on the fetch process (loading and error states).
 */
const useFetchCharacters = () => {
  const [characters, setCharacters] = useState([]); // Holds the raw character data from the API.
  const [loading, setLoading] = useState(true); // Tracks whether the API call is in progress.
  const [error, setError] = useState<Error | null>(null); // Tracks any errors during the fetch process.

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true); // Mark the fetch as in progress.
      try {
        const data = await getCharacters(); // Call the API to fetch characters.
        if (!Array.isArray(data)) {
          throw new Error(`Expected array, received: ${typeof data}`); // Validate the response type.
        }
        setCharacters(data); // Save the fetched data to state.
      } catch (err) {
        // Handle errors during the fetch process.
        const error = err instanceof Error ? err : new Error('Failed to fetch characters');
        setError(error);
      } finally {
        setLoading(false); // Mark the fetch as complete, regardless of success or failure.
      }
    };

    fetchCharacters(); // Execute the fetch when the hook is used.
  }, []); // Dependency array is empty to ensure this runs only once on component mount.

  return { characters, loading, error }; // Return the characters data and state for use in components.
};

export default useFetchCharacters;
