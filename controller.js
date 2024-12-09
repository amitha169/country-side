const countryService = require('./service');

/**
 * Controller for handling country-related requests.
 */
const countryController = {
    getAllCountries: async (req, res, next) => {
        try {
            const data = await countryService.fetchAllCountries();
            const processedData = data.map((country) => ({
                name: country.name.common,
                population: country.population,
                flag: country.flags.png,
                region: country.region,
                currencies: country.currencies ? Object.keys(country.currencies) : [],
                timezones: country.timezones,
            }));
            res.json(processedData);
        } catch (error) {
            next(error);
        }
    },

    getCountryByCode: async (req, res, next) => {
        try {
            const { code } = req.params;
            const data = await countryService.fetchCountryByCode(code);
            res.json({
                name: data.name.common,
                population: data.population,
                flag: data.flags.png,
                region: data.region,
                currencies: data.currencies ? Object.keys(data.currencies) : [],
                timezones: data.timezones,
            });
        } catch (error) {
            next(error);
        }
    },

    getCountriesByRegion: async (req, res, next) => {
        try {
            const { region } = req.params;
            const data = await countryService.fetchCountriesByRegion(region);
            const processedData = data.map((country) => ({
                name: country.name.common,
                population: country.population,
                flag: country.flags.png,
                region: country.region,
                currencies: country.currencies ? Object.keys(country.currencies) : [],
                timezones: country.timezones,
            }));
            res.json(processedData);
        } catch (error) {
            next(error);
        }
    },

    searchCountries: async (req, res, next) => {
        try {
            const { name, capital, region, timezone } = req.query;
            const data = await countryService.searchCountries(req.query);

            // Filter results if necessary
            const filteredData = timezone
                ? data.filter((country) => country.timezones && country.timezones.includes(timezone))
                : data;

            const processedData = filteredData.map((country) => ({
                name: country.name.common,
                population: country.population,
                flag: country.flags.png,
                region: country.region,
                currencies: country.currencies ? Object.keys(country.currencies) : [],
                timezones: country.timezones,
            }));
            res.json(processedData);
        } catch (error) {
            next(error);
        }
    },
};

module.exports = countryController;
