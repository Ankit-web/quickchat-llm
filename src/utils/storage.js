const STORAGE_KEY = 'quickchat_history';
const MAX_MESSAGES = 50; // Prevent localStorage quota errors (5-10MB limit)

/**
 * Load chat history from localStorage
 * Returns empty array if no history or parsing fails
 */
export function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!Array.isArray(parsed)) {
      console.warn('Invalid history format, resetting');
      return [];
    }
    
    // Only keep last 50 messages to prevent quota issues
    return parsed.slice(-MAX_MESSAGES);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * Save chat history to localStorage
 * Handles quota exceeded errors gracefully
 */
export function saveHistory(messages) {
  try {
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save history:', error);
    
    // If quota exceeded, remove old data and try with fewer messages
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, keeping only last 10 messages');
      localStorage.removeItem(STORAGE_KEY);
      const reduced = messages.slice(-10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      } catch (retryError) {
        console.error('Still cannot save after reducing messages');
      }
    }
  }
}

/**
 * Clear all chat history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}
