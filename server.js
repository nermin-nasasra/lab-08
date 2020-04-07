'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const PORT = process.env.PORT || 4000;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', (err) => {
    throw new Error(err);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/location', locationHandler)


Location.prototype.save = function () {
    const SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id;`;
    const VALUES = [this.search_query, this.formatted_query, this.latitude, this.longitude];

    return client.query(SQL, VALUES).then(result => {
        this.id = result.rows[0].id;
        return this;
    });
};
function locationHandler(request, response) {
    const city = request.query.city;
    superagent(
        `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
    )
        .then((res) => {
            const geoData = res.body;
            const locationData = new Location(city, geoData);
            response.status(200).json(locationData);
        })
        .catch((err) => errorHandler(err, request, response));
}
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}
////////////////////////////////////////////////////////////////////////////////////////////////


client
    .connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`my server is up and running on port ${PORT}`)
        );
    })
    .catch((err) => {
        throw new Error(`startup error ${err}`);
    });
