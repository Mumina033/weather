let currentDayTimeElement = document.getElementById("current-day-time");
let temperatureElement = document.getElementById("temperature");
let fahrenheitTemperature = null;
let celsiusTemperature = null;
let defaultLocation = "Boston";
let searchForm = document.querySelector(".search-form");
let cityInput = document.getElementById("city-input");
let cityHeading = document.getElementById("city-heading");

function updateCurrentForecast(temperature, description) {
  let currentDate = new Date();
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeek = daysOfWeek[currentDate.getDay()];
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let amOrPm = hours >= 12 ? "pm" : "am";
  let hours12 = hours % 12 || 12;
  let formattedTime = `${hours12}:${
    minutes < 10 ? "0" + minutes : minutes
  }${amOrPm}`;
  let updatedForecast = `Current Weather: ${formattedTime} ${description} `;
  document.getElementById("current-weather-description").textContent = ``;
  currentDayTimeElement.textContent = updatedForecast;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayWeekForecast(response) {
  let forecasted = response.data.daily.slice(0, 6);
  let weekForecastElement = document.querySelector("#week-forecast");
  let weekforecastHTML = `<div class="row">`;
  forecasted.forEach(function (forecastedDay) {
    weekforecastHTML =
      weekforecastHTML +
      `<div class="col-2">
    <div class="square-container">
      <strong>${formatDay(forecastedDay.dt)}</strong>
      <div class="temperature-max">
        <p class="temperature">${Math.round(
          forecastedDay.temp.max
        )}<span class="unit-symbol">°F</span></p>
      </div>
      <div class="temperature-min">
        <p class="temperature">${Math.round(
          forecastedDay.temp.min
        )}<span class="unit-symbol">°C</span></p>
      </div>
    </div>
  </div>`;
  });
  weekforecastHTML = weekforecastHTML + `</div>`;
  weekForecastElement.innerHTML = weekforecastHTML;
}

function updateWeeklyTemperatures(coordinates) {
  let apiKey = "96ad27349a64ea1dcdfbe6f4d458c085";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then((response) => {
    displayWeekForecast(response);
  });
}

function getWeather() {
  let locationInput = document.getElementById("city-input");
  let location = locationInput.value.trim();
  location = location.charAt(0).toUpperCase() + location.slice(1);
  let apiKey = "3528082d914ee257763d64714a895801";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      fahrenheitTemperature = response.data.main.temp;
      celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
      currentWeatherDescription = response.data.weather[0].description;
      let cityName = response.data.name;
      cityHeading.textContent = cityName;
      temperatureElement.textContent = `${Math.round(fahrenheitTemperature)}`;
      updateCurrentForecast(
        Math.round(fahrenheitTemperature),
        currentWeatherDescription
      );
      let conditionCode = response.data.weather[0].icon;
      let icon = document.querySelector("#icon");
      icon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${conditionCode}.png`
      );
      updateWeeklyTemperatures(response.data.coord);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusLink = document.querySelector("#celsius-link");

fahrenheitLink.addEventListener("click", function (event) {
  event.preventDefault();
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  temperatureElement.textContent = Math.round(fahrenheitTemperature);
});

celsiusLink.addEventListener("click", function (event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.textContent = Math.round(celsiusTemperature);
});

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather();
  }
});

function displayWeatherForDefaultLocation() {
  let apiKey = "3528082d914ee257763d64714a895801";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=imperial&appid=${apiKey}`;

  axios
    .get(apiUrl)
    .then((response) => {
      fahrenheitTemperature = response.data.main.temp;
      celsiusTemperature = ((fahrenheitTemperature - 32) * 5) / 9;
      currentWeatherDescription = response.data.weather[0].description;
      let cityName = response.data.name;
      cityHeading.textContent = cityName;
      temperatureElement.textContent = `${Math.round(fahrenheitTemperature)}`;
      updateCurrentForecast(
        Math.round(fahrenheitTemperature),
        currentWeatherDescription
      );
      let conditionCode = response.data.weather[0].icon;
      let icon = document.querySelector("#icon");
      icon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${conditionCode}.png`
      );
      updateWeeklyTemperatures(response.data.coord);
    })
    .catch((error) => {
      console.error("Error fetching default weather data:", error);
    });
}

displayWeatherForDefaultLocation();
