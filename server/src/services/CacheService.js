/**
 * CacheService class to handle in-memory caching.
 */
class CacheService {
    /**
     * Creates an instance of CacheService.
     * @param {number} cacheDuration - The duration for which the cache is valid (in milliseconds).
     */
    constructor(cacheDuration) {
        this.cache = {};
        this.cacheDuration = cacheDuration;
    }

    /**
     * Retrieves the cached data for the given key.
     * @param {string} key - The key for the cached data.
     * @returns {*} The cached data or null if the cache is expired or not found.
     */
    get(key) {
        const now = Date.now();
        const cachedItem = this.cache[key];

        if (cachedItem && (now - cachedItem.timestamp < this.cacheDuration)) {
            return cachedItem.data;
        }

        return null;
    }

    /**
     * Sets the data in the cache with the given key.
     * @param {string} key - The key for the cached data.
     * @param {*} data - The data to be cached.
     */
    set(key, data) {
        const now = Date.now();
        this.cache[key] = {
            data: data,
            timestamp: now
        };
    }
}

export default CacheService;