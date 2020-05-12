function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    const formText = document.getElementById('city').value
    const date = document.getElementById('date').value
    let today = new Date();
    let end_date = new Date(date)
    end_date.setDate(end_date.getDate() + 2);
    let tripDate = new Date(`${date}`);
    Client.postServer(formText, 'image').then(res => res.json()
        .then(function (result) {
            document.getElementById('travel_picture').src = result;
            document.getElementById('my-trip-to').innerHTML = `My trip to: ${formText}`;
            document.getElementById('days-until').innerHTML = `Days Until Trip: ${(tripDate - today) / Math.ceil((1000 * 3600 * 24))}`;
            document.getElementById('departing').innerHTML = `Departing: ${date}`;
            Client.postServer((formText), 'geodata').then((geoData) => {
                geoData.json().then((coordinates) => {
                    let [lat, long] = coordinates.data;
                    Client.postServer(`${long},${lat},${date},${end_date.toLocaleDateString('fr-CA')}`, 'weather').then((weatherResponse) => {
                        weatherResponse.json().then((weatherData) => {
                            document.getElementById('weather_for_trip').innerHTML = weatherData;
                        })
                    })
                });
            })
        })
    )
}

export {handleSubmit}
