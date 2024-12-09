const express = require('express');
const app = express();
const countryRoutes = require('./routes');  // Import routes

const PORT = 3000;

app.use(express.json());

// Register the routes here
app.use('/countries', countryRoutes);  // Handle all country-related routes

app.get('/', (req, res) => {
    res.send('Welcome to the Country Dashboard Backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
