// global variables
API_key = 'appid=0de5695b3a983be4cbc0966b74760673'
var citySearchEl = $("#search-city");
var citySearchEl = $("#city-list");
var unit = "units=imperial";
var apiUrlDaily ="https://api.openweathermap.org/data/2.5/weather?q=";
var apiUrlForecast = "https://api.openweathermap.org/data/2.5/onecall?";
var apiUrlUvIndex = "https://api.openweathermap.org/data/2.5/uvi?";
var cityArray = [];
var numSaved = 10;
var inputEl = document.getElementById("search");

// function to get current weather information

var currentWeather = function (citySearched) {
  var apiUrl = apiUrlDaily + citySearched + "&" + API_key + "&" + unit;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      return response.json().then(function (data) {
        $("#city-name").html(data.name);
        // current date
        var date = moment().format("L")
        $("#date").html(date);

        // current weather icon
        var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        $("#icon-today").attr("src", iconUrl);

        // current temperature
        $("#temperature").html(data.main.temp + " \u00B0F");

        // current humidity
        $("#humidity").html(data.main.humidity + " %");

        // current speed
        $("#wind-speed").html(data.wind.speed + " MPH");

        // current UV Index
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        uvIndexFunction(lat, lon);
        forcastForFiveDays(lat, lon);
      });
    } else {
      alert("Please provide a valid city name.");
    }
  });
};

// function to get UV Index and color code it
var uvIndexFunction = function (lat, lon) {
  var apiUrl = apiUrlUvIndex + API_key + "&lat=" + lat + "&lon=" + lon + "&" + unit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      // remove all class background
      $("#uv-index").removeClass();
      $("#uv-index").html(data.value);
      if (data.value < 3) {
        $("#uv-index").addClass("p-1 rounded bg-success text-white");
      } else if (data.value < 8) {
        $("#uv-index").addClass("p-1 rounded bg-warning text-white");
      } else {
        $("#uv-index").addClass("p-1 rounded bg-danger text-white");
      }
    });
};

// save searched cities
var CityNameSaved = function (city) {
    var newSearch = 0;
    cityArray = JSON.parse(localStorage.getItem("weatherInfo"));
    if (cityArray == null) {
      cityArray = [];
      cityArray.unshift(city);
    } else {
      for (var i = 0; i < cityArray.length; i++) {
        if (city.toLowerCase() == cityArray[i].toLowerCase()) {
          return newSearch;
        }
      }
        cityArray.unshift(city);
    }
    if (city) {
    localStorage.setItem("weatherInfo", JSON.stringify(cityArray));
    newSearch = 1;
    return newSearch;
  }
  };

// display searched cities
var btnCreate = function (text) {
  var btn = $("<button>").text(text).addClass("list-group-item list-group-item-action").attr("type", "submit");
  return btn;
};

var cityBtn = function (citySearched) {
    var cities = JSON.parse(localStorage.getItem("weatherInfo"));
    if (cities.length == 1) {
      var btnCity = btnCreate(citySearched);
      citySearchEl.prepend(btnCity);
    } else {
      for (var i = 1; i < cities.length; i++) {
        if (citySearched.toLowerCase() == cities[i].toLowerCase()) {
          return;
        }
      }
        var btnCity = btnCreate(citySearched);
        citySearchEl.prepend(btnCity);
        $(":button.list-group-item-action").on("click", function () {
        searchHandler(event);
      });
    }
  };

var listCities = function () {
  cityArray = JSON.parse(localStorage.getItem("weatherInfo"));
  if (cityArray == null) {
    cityArray = [];
  }
  for (var i = 0; i < cityArray.length; i++) {
    var btnName = btnCreate(cityArray[i]);
    citySearchEl.append(btnName);
  }
};


//Function to get weather information for the 5 days ahead
var forcastForFiveDays = function (lat, lon) {
  var apiUrl = apiUrlForecast + "lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly" + "&" + API_key + "&" + unit;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    }) .then(function (data) {
      for (var i = 1; i < 6; i++) {
        // future date
        var time = data.daily[i].dt;
        var date = moment.unix(time).format("L");
        $("#day-" + i).html(date);
        // future weather icon
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        $("#icon-day-" + i).attr("src", iconUrl);
        // future temperature
        var temperatureFuture = data.daily[i].temp.day + " \u00B0F";
        $("#temperature-" + i).html(temperatureFuture);
        // future humidity
        var humidityFuture = data.daily[i].humidity;
        $("#humidity-" + i).html(humidityFuture + " %");
      }
    });
};

listCities();

var formHandler = function (event) {
  event.preventDefault();
  var citySearched = $("#search").val().trim();
 inputEl.value ="";
  var newSearch = CityNameSaved(citySearched);
  currentWeather(citySearched);
  if (newSearch == 1) {
    cityBtn(citySearched);
  }
};
var searchHandler = function (event) {
  event.preventDefault();
  // name of the city
  var citySearched = event.target.textContent.trim();
  currentWeather(citySearched);
};

$("#search-city").on("submit", function () {
  formHandler(event);
});
$(":button.list-group-item-action").on("click", function () {
  searchHandler(event);
});