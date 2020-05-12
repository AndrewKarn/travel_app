const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const geode = require('geode');
const request = require('request');


dotenv.config();

app.use(express.static('dist'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
// Weather config
const weatherURL = 'https://api.weatherbit.io/v2.0/forecast/daily?'
const weatherKey = process.env.weatherKey

// Pixabay stuffs
const pixabayKey = process.env.pixabayKey;

app.post('/image', (req, res) => {
    function constructPixabayURL(city, country) {
        return `https://pixabay.com/api/${pixabayKey}&q=${city}+${country}&image_type=photo`
    }

    let [country, city] = (req.body.location.split(",") || ['Paris, France'])
    console.log(constructPixabayURL(city, country));
    request.get(constructPixabayURL(city, country), {json: true}, (err, response, body) => {
        try {
            if (!err) {
                res.send(JSON.stringify(body.hits[0].largeImageURL || {'result': 'no images found'}));
            }
        } catch (e) {
            console.log(e)
            res.send(JSON.stringify('https://cdn.pixabay.com/photo/2015/03/25/13/04/page-not-found-688965_960_720.png'))
        }

    })
});


app.post('/weather', (req, res) => {
    let [lonData, latData, date1, date2] = req.body.location.split(",");
    const start_date = `&start_date=${date1}`;
    const end_date = `&end_date=${date2}`;
    const lon = `&lon=${lonData}` || '&lon=38.123';
    const lat = `lat=${latData}` || '&lat=78.543';
    const urlString = `${weatherURL}${lat}${lon}${start_date}${end_date}&units=I${weatherKey}`
    request(urlString, {json: true}, (err, response, body) => {
        try {
            res.send(JSON.stringify(`Lows of ${body.data[0].min_temp} and highs of ${body.data[0].max_temp}`));
        } catch (e) {
            res.send(JSON.stringify('We had some trouble determining the average weather, please try again with a different date span!'))
        }
    });
})


app.post('/geodata', (req, res) => {
    let [city, country] = req.body.location.split(",") || [];
    const geo = new geode(process.env.geoName, {language: 'en', country: country});
    try {
        geo.search({name: city, placename: country}, function (err, results) {
            res.send(JSON.stringify({'data': [results.geonames[0].lat, results.geonames[0].lng] || {'result': 'None found'}}));
        });
    } catch (e) {
        console.log(e);
    }
})


// routes
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})


// designates what port the app will listen to for incoming requests

module.exports = app
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})