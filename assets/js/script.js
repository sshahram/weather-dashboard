// form variables (left-hand column)
var userFormEl = document.querySelector("#user-search");
var cityInputEl = document.querySelector("#search");
// weather varibales (right-hand column) 
var weatherContainerEl = document.querySelector("#weather-info-container");
citySearchTerm = document.querySelector("#city-search-term");


// form submission
var formSubmitHandler = function(event) {
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
    API_key = '0de5695b3a983be4cbc0966b74760673'
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`

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
    citySearchTerm.textContent = searchCity;

    // create html element to hold information
    var weather = document.createElement("div")
    weather.classList ="list-group-item list-group-item-action active"
    weather.textContent = `weather: ${forecast.main.temp.toFixed(1)} ° F`;
    weatherContainerEl.appendChild(weather);


};

userFormEl.addEventListener("submit", formSubmitHandler);