import axios from 'axios';

/**
 * FixerApi class to interact with the Fixer.io API.
 */
class FixerApi {
    /**
     * Creates an instance of FixerApi.
     * @param {string} apiKey - The API key for accessing the Fixer.io API.
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'http://data.fixer.io/api/';
    }

    /**
     * Retrieves exchange rates for a given base currency.
     * @param {string} baseCurrency - The base currency for which to retrieve exchange rates.
     * @returns {Promise<Object>} The exchange rates data.
     * @throws {Error} If there is an error fetching the rates.
     */
    async getRates(baseCurrency) {
        try {
            const response = await axios.get(`${this.baseUrl}latest`, {
                params: {
                    access_key: this.apiKey,
                    base: baseCurrency
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching rates');
        }
    }
}

export default FixerApi;
