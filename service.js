const axios = require('axios');
const NodeCache = require('node-cache');

const REST_COUNTRIES_API = 'https://restcountries.com/v2';
const cache = new NodeCache({ stdTTL: 3600 });

const fetchWithCache = async (key, url) => {
    const cachedData = cache.get(key);
    if (cachedData) {
        console.log(`Cache hit for key: ${key}`);
        return cachedData;
    }

    console.log(`Cache miss for key: ${key}. Fetching from API...`);
    try {
        const response = await axios.get(url);
        const data = response.data;
        cache.set(key, data);
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        throw new Error('Failed to fetch data from the external API');
    }
};

const countryService = {    
    fetchAllCountries: async () => fetchWithCache('all_countries', `${REST_COUNTRIES_API}/all`),
    fetchCountryByCode: async (code) => fetchWithCache(`country_${code}`, `${REST_COUNTRIES_API}/alpha/${code}`),
    fetchCountriesByRegion: async (region) => fetchWithCache(`region_${region}`, `${REST_COUNTRIES_API}/region/${region}`),
    
    // Optimized search function with cache handling
    searchCountries: async (query) => {
        // Check if specific search criteria have been cached before
        let cacheKey = 'search';
        if (query.name) cacheKey += `_name_${query.name}`;
        if (query.capital) cacheKey += `_capital_${query.capital}`;
        if (query.region) cacheKey += `_region_${query.region}`;
        if (query.timezone) cacheKey += `_timezone_${query.timezone}`;

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`Cache hit for key: ${cacheKey}`);
            return cachedData;
        }

        // If no cache, fetch all countries and filter based on the search parameters
        const allCountries = await fetchWithCache('all_countries', `${REST_COUNTRIES_API}/all`);

        const filteredCountries = allCountries.filter(country => {
            if (query.name && !country.name.common.toLowerCase().includes(query.name.toLowerCase())) return false;
            if (query.capital && (!country.capital || !country.capital.some(cap => cap.toLowerCase().includes(query.capital.toLowerCase())))) return false;
            if (query.region && country.region.toLowerCase() !== query.region.toLowerCase()) return false;
            if (query.timezone && (!country.timezones || !country.timezones.some(tz => tz.includes(query.timezone)))) return false;
            return true;
        });

        // Cache the filtered results
        cache.set(cacheKey, filteredCountries);

        console.log(`Cache miss for key: ${cacheKey}. Caching the filtered result.`);
        return filteredCountries;
    },
};

module.exports = countryService;
