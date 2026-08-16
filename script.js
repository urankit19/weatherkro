const apiKey = "6a3e247b131e45bf9bc60249252008";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const dashboard = document.getElementById("weatherDashboard");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");


// Search on Enter
cityInput.addEventListener("keydown", function (event) {

  if (event.key === "Enter") {
    getWeather();
  }

});


// Main function
async function getWeather() {

  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }


  // UI state
  errorBox.style.display = "none";
  loading.style.display = "block";
  dashboard.style.opacity = "0.5";

  searchBtn.disabled = true;
  searchBtn.innerText = "Searching...";


  const url =
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;


  try {

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found. Please check the city name.");
    }


    const data = await response.json();

    updateWeather(data);

  }

  catch (error) {

    showError(error.message);

    clearWeather();

  }

  finally {

    loading.style.display = "none";

    dashboard.style.opacity = "1";

    searchBtn.disabled = false;

    searchBtn.innerText = "Search";

  }

}


// Update weather UI
function updateWeather(data) {

  const location = data.location;
  const current = data.current;


  // Location
  document.getElementById("cityName").innerText =
    `${location.name}, ${location.country}`;


  document.getElementById("localTime").innerText =
    `Local time • ${location.localtime}`;


  // Main weather
  document.getElementById("temperature").innerText =
    Math.round(current.temp_c);


  document.getElementById("condition").innerText =
    current.condition.text;


  document.getElementById("feelsLike").innerText =
    Math.round(current.feelslike_c);


  // Weather icon
  const icon = document.getElementById("weatherIcon");

  icon.src = current.condition.icon.startsWith("http")
    ? current.condition.icon
    : `https:${current.condition.icon}`;


  // Main footer
  document.getElementById("humidity").innerText =
    `${current.humidity}%`;


  document.getElementById("wind").innerText =
    `${current.wind_kph} km/h`;


  document.getElementById("minMax").innerText =
    `${Math.round(current.temp_c)}°C`;


  // Details
  document.getElementById("humidityDetail").innerText =
    `${current.humidity}%`;


  document.getElementById("windDetail").innerText =
    `${current.wind_kph} km/h`;


  document.getElementById("pressure").innerText =
    `${current.pressure_mb} mb`;


  document.getElementById("visibility").innerText =
    `${current.vis_km} km`;


  document.getElementById("cloud").innerText =
    `${current.cloud}%`;


  document.getElementById("windDirection").innerText =
    `${current.wind_dir} ${current.wind_degree}°`;


  // AQI
  updateAQI(current.air_quality);

}


// AQI
function updateAQI(aqi) {

  if (!aqi) {
    document.getElementById("aqiValue").innerText = "N/A";
    document.getElementById("aqiStatus").innerText = "Unavailable";
    return;
  }


  /*
    WeatherAPI EPA AQI:
    1 = Good
    2 = Moderate
    3 = Unhealthy for sensitive groups
    4 = Unhealthy
    5 = Very Unhealthy
    6 = Hazardous
  */

  const value = aqi["us-epa-index"];

  const status = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
  };


  document.getElementById("aqiValue").innerText =
    value || "N/A";


  document.getElementById("aqiStatus").innerText =
    status[value] || "Unknown";


  document.getElementById("aqiDescription").innerText =
    `US EPA Air Quality Index: ${value || "N/A"}`;

}


// Show error
function showError(message) {

  errorBox.innerText = message;

  errorBox.style.display = "block";

}


// Clear weather
function clearWeather() {

  document.getElementById("cityName").innerText =
    "Search for a city";

  document.getElementById("localTime").innerText =
    "Current weather information";

  document.getElementById("temperature").innerText =
    "--";

  document.getElementById("condition").innerText =
    "Waiting for location";

  document.getElementById("feelsLike").innerText =
    "--";

  document.getElementById("weatherIcon").src =
    "";

  document.getElementById("humidity").innerText =
    "--";

  document.getElementById("wind").innerText =
    "--";

  document.getElementById("minMax").innerText =
    "--";

  document.getElementById("humidityDetail").innerText =
    "--";

  document.getElementById("windDetail").innerText =
    "--";

  document.getElementById("pressure").innerText =
    "--";

  document.getElementById("visibility").innerText =
    "--";

  document.getElementById("cloud").innerText =
    "--";

  document.getElementById("windDirection").innerText =
    "--";

  document.getElementById("aqiValue").innerText =
    "--";

  document.getElementById("aqiStatus").innerText =
    "--";

  document.getElementById("aqiDescription").innerText =
    "Search a city to view air quality.";

}
