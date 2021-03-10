API_key = '0de5695b3a983be4cbc0966b74760673'

// form variables (left-hand column)
var searchBtnEl = document.querySelector("#searchBtn");
var cityInputEl = document.querySelector("#citySearch");
// weather varibales (right-hand column) 
var weatherContainerEl = document.querySelector("#weatherInfo");



// form submission
var searchClickHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var cityname = cityInputEl.value.trim();

    if (cityname) {
        // add function to display the result
        getWeatherInfo(cityname);
        cityInputEl.value= "";
    } else {
        alert("Please enter a valid city!")
    }
};

var getWeatherInfo = function(city) {
    // format the weather api url
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=imperial`

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
                    // add function to display results
                    displayWeatherinfo(data, city);
                });
            } else {
                alert("Error: " + response.status)
            }
        })
        .catch(function(error) {
            alert("Unable to connect to weather api!")
        });

};

var displayWeatherinfo = function(forecast, searchCity) {
    console.log(forecast);
    console.log(searchCity);

    // check it api returns any weather information
    if(forecast.length === 0) {
        weatherContainerEl.textContent = "No weather information found.";
        return;
    }
    // clear old content
    weatherContainerEl.textContent = "";

    // create html element to hold information

    // city name and date
    var cityName = document.createElement("h2")
    cityName.classList ="card-title d-flex align-items-center lead font-weight-bold"
    cityName.textContent =  forecast.name + " (" + moment().format("L") + ") ";
    weatherContainerEl.appendChild(cityName);

    // weather icon
    var iconURL = "http://openweathermap.org/img/wn/" + forecast.weather[0].icon +"@2x.png";
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", iconURL);
    weatherContainerEl.appendChild(weatherIcon);

    // temperature
    var temperature = document.createElement("div")
    temperature.classList ="card-text"
    temperature.textContent = "Temperature: " +  forecast.main.temp +  " \u00B0F";
    weatherContainerEl.appendChild(temperature);

    // humidity
    var humidity = document.createElement("div")
    humidity.classList ="card-text"
    humidity.textContent = "Humidity: " +  forecast.main.humidity +  " %";
    weatherContainerEl.appendChild(humidity);

    // wind speed
    var windSpeed = document.createElement("div")
    windSpeed.classList ="card-text"
    windSpeed.textContent = "Wind Speed: " +  forecast.wind.speed +  " MPH";
    weatherContainerEl.appendChild(windSpeed);

    // uv index
    // add function for uv index here

};

// var weatherIcon = function(icon) {
//     apiUrlIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`

// }

searchBtnEl.addEventListener("click", searchClickHandler);
