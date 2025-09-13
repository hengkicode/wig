// Session timeout from environment (default 1 hour)
const SESSION_TIMEOUT = process.env.NEXT_PUBLIC_SESSION_TIMEOUT || 3600000;

/**
 * Safely save data to localStorage with expiry
 */
export const saveToLocalStorage = (key, value, customTimeout = null) => {
  try {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + (customTimeout || SESSION_TIMEOUT),
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Safely get data from localStorage with expiry check
 */
export const getFromLocalStorage = (key) => {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Check if expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    // Remove corrupted data
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing corrupted localStorage item:', e);
    }
    return null;
  }
};

/**
 * Safely remove data from localStorage
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Clear all localStorage data
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return getFromLocalStorage('username') !== null;
};

/**
 * Get user data from localStorage
 */
export const getUserData = () => {
  return {
    id: getFromLocalStorage('id'),
    username: getFromLocalStorage('username'),
    namaDivisi: getFromLocalStorage('nama_divisi'),
    divisi: getFromLocalStorage('divisi'),
  };
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData) => {
  const success = (
    saveToLocalStorage('id', userData.id) &&
    saveToLocalStorage('username', userData.username) &&
    saveToLocalStorage('nama_divisi', userData.nama_divisi) &&
    saveToLocalStorage('divisi', userData.divisi)
  );
  
  return success;
};

/**
 * Logout user by clearing localStorage
 */
export const logout = () => {
  return clearLocalStorage();
};