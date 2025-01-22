export const loadImageWithFallback = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error('Image failed to load');
    }
    
    return url;
  } catch (error) {
    console.error('[ImageUtils] Error loading image:', error);
    return 'https://via.placeholder.com/400x400?text=Image+Load+Failed';
  }
}; 