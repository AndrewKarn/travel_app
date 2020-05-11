const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const geode = require('geode');


dotenv.config();

app.use(express.static('dist'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
const request = require('request');
// Weather config
const weatherURL = 'https://api.weatherbit.io/v2.0/current?'
const weatherKey = '&key=9d698e472eef4712976778684810606e'

// Pixabay stuffs
const pixabayKey = '?key=16485261-477f6123e26514552107f546c';

function constructPixabayURL(city, country) {
    return `https://pixabay.com/api/${pixabayKey}&q=${city}+${country}&image_type=photo`
}

app.post('/image', (req, res) => {
    let [country, city] = (req.body.location.split(",") ?? ['Paris, France'])
    request.get(constructPixabayURL(city, country), {json: true}, (err, response, body) => {
        try {
            if (!err) {
                res.send(JSON.stringify(body.hits[0].largeImageURL ?? {'result': 'no images found'}));
            }
        } catch (e) {
            console.log(e)
            res.send(JSON.stringify({'result': 'no images found'}))
        }

    })
});


app.post('/weather', (req, res) => {
    let [lonData, latData] = req.body.location.split(",");
    console.log(req.body.location)
    const lon = `&lon=${lonData}` ?? '&lon=38.123';
    const lat = `&lat=${latData}` ?? '&lat=78.543';
    const urlString = `${weatherURL}${lat}${lon}${weatherKey}`;
    console.log(urlString);
    request(urlString, {json: true}, (err, response, body) => {
        if (!err) {
            res.send(JSON.stringify(body.data[0].city_name));
        } else {
            return console.log(err);
        }
    });
})


app.post('/geodata', (req, res) => {
    let [city, country] = req.body.location.split(",") ?? [];
    const geo = new geode('drew.karn', {language: 'en', country: country});
    geo.search({name: city, placename: country}, function (err, results) {
        res.send(JSON.stringify({'data':[results.geonames[0].lat, results.geonames[0].lng] ?? {'result': 'None found'}}));
    });
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