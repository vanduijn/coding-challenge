import { expect } from 'chai';
import CacheService from '../../src/services/CacheService.js';

describe('CacheService', () => {
    let cacheService;
    const cacheDuration = 1000; // 1 second

    beforeEach(() => {
        cacheService = new CacheService(cacheDuration);
    });

    it('should store and retrieve data within cache duration', () => {
        const key = 'testKey';
        const data = { value: 42 };

        cacheService.set(key, data);
        const cachedData = cacheService.get(key);

        expect(cachedData).to.deep.equal(data);
    });

    it('should return null for expired cache', (done) => {
        const key = 'testKey';
        const data = { value: 42 };

        cacheService.set(key, data);

        setTimeout(() => {
            const cachedData = cacheService.get(key);
            expect(cachedData).to.be.null;
            done();
        }, cacheDuration + 100);
    });

    it('should return null for non-existent key', () => {
        const cachedData = cacheService.get('nonExistentKey');
        expect(cachedData).to.be.null;
    });
});