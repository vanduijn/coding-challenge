class RatesServiceClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Retrieves exchange rates for a given base currency.
     * @param {string} baseCurrency - The base currency for which to retrieve exchange rates.
     * @returns {Promise<Object>} The exchange rates data.
     * @throws {Error} If there is an error fetching the rates.
     */
    async getRates(baseCurrency = 'EUR') {
        try {
            const response = await fetch(`${this.baseURL}/api/rates?base=${baseCurrency}`);
            if (!response.ok) {
                throw new Error('Error fetching rates');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Converts an amount from one currency to another.
     * @param {string} fromCurrency - The source currency.
     * @param {string} toCurrency - The target currency.
     * @param {number} amount - The amount to convert.
     * @returns {Promise<Object>} The converted amount data.
     * @throws {Error} If there is an error converting the currency.
     */
    async convertCurrency(fromCurrency = 'EUR', toCurrency = 'USD', amount = 1) {
        try {
            const response = await fetch(`${this.baseURL}/api/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
            if (!response.ok) {
                throw new Error('Error converting currency');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default RatesServiceClient;