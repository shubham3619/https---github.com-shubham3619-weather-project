const apiKey = '0e33a78e9faa26879d94875aae520bde';
const weatherCardsContainer = document.getElementById('weatherCardsContainer');
const cityInput = document.getElementById('cityInput');
const addCityBtn = document.getElementById('addCityBtn');
let cities = {};

// Function to fetch weather data from the API
async function getWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to add a new city to the dashboard
async function addCity() {
    const cityName = cityInput.value.trim();

    if (!cityName) {
        alert('Please enter a city name.');
        return;
    }

    if (cities[cityName]) {
        alert('City already added.');
        return;
    }

    const weatherData = await getWeatherData(cityName);

    if (!weatherData) {
        alert('City not found. Please enter a valid city name.');
        return;
    }

    cities[cityName] = weatherData;

    // Sort the cities object by temperature before rendering the weather cards
    const sortedCities = Object.keys(cities).sort((city1, city2) => {
        const temp1 = cities[city1].main.temp;
        const temp2 = cities[city2].main.temp;
        return temp1 - temp2;
    });

    // Clear the previous weather cards
    weatherCardsContainer.innerHTML = '';

    // Render weather cards in the sorted order
    sortedCities.forEach(city => {
        const weatherData = cities[city];
        renderWeatherCard(weatherData);
    });

    cityInput.value = '';
}

// Function to dynamically generate a weather card
function renderWeatherCard(weatherData) {
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    const weatherIcon = document.createElement('img');
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;

    

    const temperatureElement = document.createElement('div');
    temperatureElement.classList.add('temperature');
    temperatureElement.textContent = `${weatherData.main.temp}°C`;

    const highLow = document.createElement('div');
    highLow.classList.add('highLow');
    const highTempElement = document.createElement('div');
    highTempElement.classList.add('high-temp');
    highTempElement.textContent = `H: ${weatherData.main.temp_max}°C`;
    highLow.appendChild(highTempElement);

    const lowTempElement = document.createElement('div');
    lowTempElement.classList.add('low-temp');
    lowTempElement.textContent = `L: ${weatherData.main.temp_min}°C`;
    highLow.appendChild(lowTempElement);

    const combine = document.createElement('div');
    combine.classList.add('combine');

    const cityNameElement = document.createElement('div');
    cityNameElement.classList.add('city-name');
    cityNameElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    combine.appendChild(cityNameElement);
    weatherCard.appendChild(weatherIcon);

    const weatherConditionElement = document.createElement('div');
    weatherConditionElement.classList.add('weather-condition');
    weatherConditionElement.textContent = weatherData.weather[0].description;
    combine.appendChild(weatherConditionElement);

    weatherCard.appendChild(temperatureElement);
    weatherCard.appendChild(highLow);
    weatherCard.appendChild(combine);
    weatherCardsContainer.appendChild(weatherCard);
}

// Event listener for Add City button click
addCityBtn.addEventListener('click', addCity);