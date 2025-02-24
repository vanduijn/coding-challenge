import { LitElement, html, css } from 'lit';
import { getCurrencyName, formatCurrencyValue } from './utils/currencyNames.js';
import RatesServiceClient from './services/RatesServiceClient.js';

class OcRatesConvert extends LitElement {

    #ratesServiceClient;

    static properties = {
        amount: { type: Number, state: true },
        fromCurrency: { type: String, state: true },
        toCurrency: { type: String, state: true },
        convertedAmount: { type: Number, state: true },
        error: { type: Boolean, state: true },
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

    #renderAmountInput() {
        return html`
            <label>
                Amount:
                <input type="number" min="0" .value="${this.amount}" @input="${this.#onAmountChange}" />
            </label>
        `;
    }

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

    #renderConversionResult() {
        if (this.error) return html`<p class="error">Error converting currency from ${this.fromCurrency} to ${this.toCurrency}, please try again</p>` 
            
        return this.convertedAmount
            ? html`<p>${formatCurrencyValue(this.amount, this.fromCurrency)} is equal to: ${formatCurrencyValue(this.convertedAmount, this.toCurrency)}</p>`
            : html``;
    }

    #onAmountChange(event) {
        this.amount = parseFloat(event.target.value);
    }

    #onFromCurrencyChange(event) {
        this.fromCurrency = event.target.value;
        this.#loadRates(this.fromCurrency);
    }

    #onToCurrencyChange(event) {
        this.toCurrency = event.target.value;
        this.#resetConvertedAmount();
    }

    #showErrorMessage() {
        this.error = true;
    }

    #resetErrorMessage() {
        this.error = false;
    }

    #resetConvertedAmount() {
        this.convertedAmount = null;
    }

    async #convertCurrency() {
        this.#resetErrorMessage();
        try {
            const data = await this.#ratesServiceClient.convertCurrency(this.fromCurrency, this.toCurrency, this.amount);
            this.convertedAmount = data.convertedAmount;
        } catch {
            this.#showErrorMessage();
        }
    }

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