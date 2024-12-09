const express = require('express');
const countryController = require('./controller');

const router = express.Router();

router.get('/', countryController.getAllCountries);
router.get('/:code', countryController.getCountryByCode);  // This is the route you're hitting
router.get('/region/:region', countryController.getCountriesByRegion);
router.get('/search', countryController.searchCountries);

module.exports = router;
