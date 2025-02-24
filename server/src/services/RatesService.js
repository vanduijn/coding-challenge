import CacheService from './CacheService.js';

/**
 * RatesService class to handle currency rates and conversions.
 */
class RatesService {
    /**
     * Creates an instance of RatesService.
     * @param {Object} fixerApi - The FixerApi instance for fetching rates.
     * @param {number} cacheDuration - The duration for which the cache is valid (in milliseconds).
     */
    constructor(fixerApi, cacheDuration = 10 * 60 * 1000) { // default to 10 minutes
        this.fixerApi = fixerApi;
        this.cacheService = new CacheService(cacheDuration);
    }

    /**
     * Retrieves exchange rates for a given base currency.
     * @param {string} baseCurrency - The base currency for which to retrieve exchange rates.
     * @returns {Promise<Object>} The exchange rates data.
     * @throws {Error} If there is an error fetching the rates.
     */
    async getRates(baseCurrency) {
        const cacheKey = this.#generateCacheKey(baseCurrency);
        const cachedRates = this.cacheService.get(cacheKey);

        if (cachedRates) {
            console.log('Returning cached rates');
            return cachedRates;
        }

        const rates = await this.fixerApi.getRates(baseCurrency);
        
        if (!rates.success) {
            throw new Error('Error fetching rates : ' + rates.error);
        }
        this.cacheService.set(cacheKey, rates);
        return rates;
    }

    /**
     * Converts an amount from one currency to another.
     * @param {string} fromCurrency - The source currency.
     * @param {string} toCurrency - The target currency.
     * @param {number} amount - The amount to convert.
     * @returns {Promise<number>} The converted amount.
     * @throws {Error} If there is an error converting the currency.
     */
    async convertCurrency(fromCurrency, toCurrency, amount) {
        try {
            const rates = await this.getRates(fromCurrency);
            const rate = rates.rates[toCurrency];
            if (!rate) {
                throw new Error(`Invalid target currency: ${toCurrency}`);
            }
            const convertedAmount = amount * rate;
            return convertedAmount;
        } catch (error) {
            throw new Error('Error converting currency');
        }
    }

    /**
     * Generates a cache key for the given base currency.
     * @param {string} baseCurrency - The base currency.
     * @returns {string} The generated cache key.
     * @private
     */
    #generateCacheKey(baseCurrency) {
        return `rates_${baseCurrency}`;
    }
}

export default RatesService;