import { Tweet } from '../types/Tweet';

// Helper function to parse CSV text with multi-line quotes
const parseCSVText = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  // Process the text character by character
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes
        currentValue += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentValue.trim());
      currentValue = '';
    } else if (char === '\n' && !insideQuotes) {
      // End of row (only if not inside quotes)
      currentRow.push(currentValue.trim());
      if (currentRow.some(value => value)) { // Only add non-empty rows
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
    } else if (char === '\r') {
      // Skip carriage returns
      continue;
    } else {
      currentValue += char;
    }
  }
  
  // Handle the last row
  if (currentValue) {
    currentRow.push(currentValue.trim());
  }
  if (currentRow.some(value => value)) {
    rows.push(currentRow);
  }
  
  return rows;
};

export const parseTwitterCSV = (csvData: string): Tweet[] => {
  const rows = parseCSVText(csvData);
  const headers = rows[0];
  
  return rows.slice(1)
    .map(values => {
      try {
        const username = values[headers.indexOf('twitter_handle')]?.trim().toLowerCase().replace('@', '');
        
        const tweet = {
          id: values[headers.indexOf('tweet_id')]?.trim(),
          author: {
            username: username,
            name: values[headers.indexOf('Author Display Name')]?.trim() || username,
            profileImageUrl: values[headers.indexOf('Author Profile Image')]?.trim()
          },
          text: values[headers.indexOf('raw_tweet')]?.trim(),
          createdAt: values[headers.indexOf('tweet_created_at')]?.trim(),
          entities: {
            urls: values[headers.indexOf('links_used')] ? 
              values[headers.indexOf('links_used')].split(';')
                .filter(url => url.trim())
                .map(url => ({
                  url: url.trim(),
                  expanded_url: url.trim(),
                  display_url: url.trim()
                })) : []
          },
          metrics: {
            replies: parseInt(values[headers.indexOf('tweet_reply_count')]) || 0,
            retweets: parseInt(values[headers.indexOf('tweet_retweet_count')]) || 0,
            likes: parseInt(values[headers.indexOf('tweet_like_count')]) || 0,
            impressions: parseInt(values[headers.indexOf('Impressions Count')]) || 0,
            quotes: parseInt(values[headers.indexOf('tweet_quote_count')]) || 0,
            bookmarks: parseInt(values[headers.indexOf('tweet_bookmark_count')]) || 0
          },
          aiAnalysis: {
            contentQuality: parseInt(values[headers.indexOf('Smart Engagement Points')]) || 0,
            insights: [
              values[headers.indexOf('Smart Engagement Points')] ? 
                `Engagement Score: ${values[headers.indexOf('Smart Engagement Points')]}` : '',
              values[headers.indexOf('hashtags_used')] ? 
                `Hashtags: ${values[headers.indexOf('hashtags_used')]}` : '',
              values[headers.indexOf('media_type')] ? 
                `Media Type: ${values[headers.indexOf('media_type')]}` : ''
            ].filter(Boolean)
          }
        } as Tweet;
        
        if (!tweet.id || !tweet.author.username) {
          console.log('Invalid tweet data:', {
            values,
            headers,
            parsedValues: {
              id: tweet.id,
              username: tweet.author.username,
              text: tweet.text
            }
          });
        }
        
        return tweet;
      } catch (error) {
        console.error('Error parsing row:', { values, error });
        return null;
      }
    })
    .filter((tweet): tweet is Tweet => Boolean(tweet?.id && tweet?.author?.username));
}; 