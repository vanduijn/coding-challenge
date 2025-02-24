import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import FixerApi from '../../src/services/FixerApi.js';

describe('FixerApi', () => {
    let fixerApi;
    const API_KEY = 'test_api_key';

    beforeEach(() => {
        fixerApi = new FixerApi(API_KEY);
    });

    it('should fetch exchange rates for a given base currency', async () => {
        const baseCurrency = 'EUR';
        const mockResponse = {
            data: {
                rates: {
                    USD: 1.2
                }
            }
        };
        sinon.stub(axios, 'get').resolves(mockResponse);

        const rates = await fixerApi.getRates(baseCurrency);

        expect(axios.get.calledWith(`${fixerApi.baseUrl}latest`, {
            params: {
                access_key: API_KEY,
                base: baseCurrency
            }
        })).to.be.true;
        expect(rates).to.deep.equal(mockResponse.data);

        axios.get.restore();
    });

    it('should throw an error if fetching rates fails', async () => {
        const baseCurrency = 'EUR';
        sinon.stub(axios, 'get').rejects(new Error('Error fetching rates'));

        try {
            await fixerApi.getRates(baseCurrency);
        } catch (error) {
            expect(error.message).to.equal('Error fetching rates');
        }

        axios.get.restore();
    });
});