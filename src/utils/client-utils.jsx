// src/utils/client-utils.js
// Create a utility for safely accessing browser APIs

// Helper function to check if code is running in browser
export const isBrowser = () => typeof window !== "undefined";

// Safe wrapper for window access
export const getWindowProperty = (property, fallback) => {
    if (isBrowser()) {
        return window[property];
    }
    return fallback;
};

// Safe wrapper for document access
export const getDocumentProperty = (property, fallback) => {
    if (isBrowser()) {
        return document[property];
    }
    return fallback;
};

// Example: Safely get window dimensions
export const getWindowDimensions = () => {
    if (!isBrowser()) {
        return { width: 0, height: 0 };
    }

    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
};

// Example: Safely get user agent
export const getUserAgent = () => {
    return getWindowProperty("navigator", {}).userAgent || "";
};

// Example: Safe local storage access
export const getLocalStorageItem = (key, fallback = null) => {
    if (!isBrowser()) {
        return fallback;
    }

    try {
        const item = localStorage.getItem(key);
        return item !== null ? item : fallback;
    } catch (error) {
        console.error("Local storage access error:", error);
        return fallback;
    }
};
