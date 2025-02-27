import { LitElement, html, css } from 'lit';
import { getCurrencyName, formatCurrencyValue } from './utils/currencyNames.js';
import RatesServiceClient from './services/RatesServiceClient.js';

/**
 * A web component for converting currency amounts using exchange rates.
 * 
 * @class OcRatesConvert
 * @extends {LitElement}
 */
class OcRatesConvert extends LitElement {

    #ratesServiceClient;

    static properties = {
        /** @type {number} */
        amount: { type: Number, state: true },
        /** @type {string} */
        fromCurrency: { type: String, state: true },
        /** @type {string} */
        toCurrency: { type: String, state: true },
        /** @type {number|null} */
        convertedAmount: { type: Number, state: true },
        /** @type {boolean} */
        error: { type: Boolean, state: true },
        /** @type {Object<string, number>} */
        supportedCurrencies: { type: Object, state: true },
    };

    constructor() {
        super();
        this.amount = 0;
        this.fromCurrency = 'EUR';
        this.toCurrency = 'USD';
        this.convertedAmount = null;
        this.error = false;
        this.supportedCurrencies = [];
        this.#ratesServiceClient = new RatesServiceClient('http://localhost:3000');
    }

    connectedCallback() {
        super.connectedCallback();
        this.#loadRates(this.fromCurrency);
    }

    static styles = css`
        :host {
            display: block;
            padding: 16px;
        }
        .error {
            color: red;
        }
        label {
            display: block
        }
        button {
            margin-top: 16px;}
    `;

    render() {
        return html`
            <div>
                ${this.#renderAmountInput()}
                ${this.#renderCurrencySelection('fromCurrency', 'From', this.fromCurrency, false, this.#onFromCurrencyChange)}
                ${this.#renderCurrencySelection('toCurrency', 'To', this.toCurrency, true, this.#onToCurrencyChange)}
                <button @click="${this.#convertCurrency}">Convert</button>
                ${this.#renderConversionResult()}
            </div>
        `;
    }

    /**
     * Renders the input field for the amount to be converted.
     * 
     * @returns {TemplateResult} The HTML template for the amount input field.
     */
    #renderAmountInput() {
        return html`
            <label>
                Amount:
                <input type="number" min="0" .value="${this.amount}" @input="${this.#onAmountChange}" />
            </label>
        `;
    }

    /**
     * Renders the currency selection dropdown.
     * 
     * @param {string} id - The ID of the dropdown element.
     * @param {string} label - The label for the dropdown.
     * @param {string} value - The currently selected currency code.
     * @param {boolean} showRate - Whether to show the exchange rate next to the currency name.
     * @param {Function} callback - The callback function to handle changes in the dropdown selection.
     * @returns {TemplateResult} The HTML template for the currency selection dropdown.
     */
    #renderCurrencySelection(id, label, value, showRate, callback) {
        return html`
            <label>
                ${label}:
                <select id="${id}" @change="${callback}">
                    ${Object.entries(this.supportedCurrencies).map(([code, rate]) => html`
                        <option value="${code}" ?selected="${code === value}">${getCurrencyName(code)} (${code}) ${showRate? html` - Exchange rate: ${formatCurrencyValue(rate, code)}` : ''}</option>
                    `)}
                </select>
            </label>
        `;
    }

    /**
     * Renders the result of the currency conversion.
     * 
     * @returns {TemplateResult} The HTML template for the conversion result.
     */
    #renderConversionResult() {
        if (this.error) return html`<p class="error">Error converting currency from ${this.fromCurrency} to ${this.toCurrency}, please try again</p>` 
            
        return this.convertedAmount
            ? html`<p>${formatCurrencyValue(this.amount, this.fromCurrency)} is equal to: ${formatCurrencyValue(this.convertedAmount, this.toCurrency)}</p>`
            : html``;
    }

    /**
     * Handles changes to the amount input field.
     * 
     * @param {Event} event - The input event.
     */
    #onAmountChange(event) {
        this.amount = parseFloat(event.target.value);
        this.#resetConvertedAmount();
    }

    /**
     * Handles changes to the "from" currency dropdown.
     * 
     * @param {Event} event - The change event.
     */
    #onFromCurrencyChange(event) {
        this.fromCurrency = event.target.value;
        this.#loadRates(this.fromCurrency);
    }

    /**
     * Handles changes to the "to" currency dropdown.
     * 
     * @param {Event} event - The change event.
     */
    #onToCurrencyChange(event) {
        this.toCurrency = event.target.value;
        this.#resetConvertedAmount();
    }

    /**
     * Shows an error message.
     */
    #showErrorMessage() {
        this.error = true;
    }

    /**
     * Resets the error message.
     */
    #resetErrorMessage() {
        this.error = false;
    }

    /**
     * Resets the converted amount.
     */
    #resetConvertedAmount() {
        this.convertedAmount = null;
    }

    /**
     * Converts the currency amount using the RatesServiceClient.
     */
    async #convertCurrency() {
        this.#resetErrorMessage();
        try {
            const data = await this.#ratesServiceClient.convertCurrency(this.fromCurrency, this.toCurrency, this.amount);
            this.convertedAmount = data.convertedAmount;
        } catch {
            this.#showErrorMessage();
        }
    }

    /**
     * Loads the exchange rates for the specified currency using the RatesServiceClient.
     * 
     * @param {string} currency - The base currency code.
     */
    async #loadRates(currency) {
        try {
            const data = await this.#ratesServiceClient.getRates(currency);
            this.supportedCurrencies = data.rates;
        } catch {
            this.#showErrorMessage();
        }
    }
}

customElements.define('oc-rates-convert', OcRatesConvert);