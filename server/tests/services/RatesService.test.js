import { expect } from 'chai';
import sinon from 'sinon';
import RatesService from '../../src/services/RatesService.js';
import CacheService from '../../src/services/CacheService.js';
import FixerApi from '../../src/services/FixerApi.js';

describe('RatesService', () => {
    let ratesService;
    let fixerApiMock;
    let cacheServiceMock;
    const CACHE_DURATION = 1000; // 1 second

    beforeEach(() => {
        fixerApiMock = sinon.createStubInstance(FixerApi);
        cacheServiceMock = sinon.createStubInstance(CacheService);
        ratesService = new RatesService(fixerApiMock, CACHE_DURATION);
        ratesService.cacheService = cacheServiceMock;
    });

    it('should return cached rates if available', async () => {
        const baseCurrency = 'EUR';
        const cachedRates = { rates: { USD: 1.2 } };
        cacheServiceMock.get.returns(cachedRates);

        const rates = await ratesService.getRates(baseCurrency);

        expect(rates).to.deep.equal(cachedRates);
        expect(fixerApiMock.getRates.called).to.be.false;
    });

    it('should fetch rates from API if not cached', async () => {
        const baseCurrency = 'EUR';
        const apiRates = { rates: { USD: 1.2 }, success: true };
        cacheServiceMock.get.returns(null);
        fixerApiMock.getRates.resolves(apiRates);

        const rates = await ratesService.getRates(baseCurrency);

        expect(rates).to.deep.equal(apiRates);
        expect(fixerApiMock.getRates.calledWith(baseCurrency)).to.be.true;
        expect(cacheServiceMock.set.calledWith(`rates_${baseCurrency}`, apiRates)).to.be.true;
    });

    it('should convert currency correctly', async () => {
        const fromCurrency = 'EUR';
        const toCurrency = 'USD';
        const amount = 100;
        const rates = { rates: { USD: 1.2 } };
        sinon.stub(ratesService, 'getRates').resolves(rates);

        const convertedAmount = await ratesService.convertCurrency(fromCurrency, toCurrency, amount);

        expect(convertedAmount).to.equal(120);
    });

    it('should throw error for invalid target currency', async () => {
        const fromCurrency = 'EUR';
        const toCurrency = 'INVALID';
        const amount = 100;
        const rates = { rates: { USD: 1.2 } };
        sinon.stub(ratesService, 'getRates').resolves(rates);

        try {
            await ratesService.convertCurrency(fromCurrency, toCurrency, amount);
        } catch (error) {
            expect(error.message).to.equal('Error converting currency')
        }
    });
});