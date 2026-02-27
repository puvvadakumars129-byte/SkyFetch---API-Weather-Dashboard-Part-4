 function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // DOM references
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');
    this.recentSearchesSection = document.getElementById('recent-searches-section');
    this.recentSearchesContainer = document.getElementById('recent-searches-container');

    // Recent searches
    this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    this.maxRecentSearches = 5;

    this.init();
}

WeatherApp.prototype.init = function () {
    const self = this;

    // Search button click
    this.searchBtn.addEventListener('click', function () {
        const city = self.cityInput.value.trim();
        if (city) {
            self.getWeather(city);
        }
    });

    // Press Enter key
    this.cityInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const city = self.cityInput.value.trim();
            if (city) {
                self.getWeather(city);
            }
        }
    });

    // Display saved searches on load
    this.displayRecentSearches();
};

WeatherApp.prototype.getWeather = function (city) {
    const self = this;

    fetch(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            self.displayWeather(data);
            self.addRecentSearch(city);
        })
        .catch(error => {
            self.weatherDisplay.innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
};

WeatherApp.prototype.displayWeather = function (data) {
    const html = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    this.weatherDisplay.innerHTML = html;
};

WeatherApp.prototype.addRecentSearch = function (city) {

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    // Add to beginning
    this.recentSearches.unshift(city);

    // Limit to maxRecentSearches
    if (this.recentSearches.length > this.maxRecentSearches) {
        this.recentSearches.pop();
    }

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));

    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {

    // Clear container
    this.recentSearchesContainer.innerHTML = '';

    if (this.recentSearches.length === 0) {
        this.recentSearchesSection.style.display = 'none';
        return;
    }

    this.recentSearchesSection.style.display = 'block';

    const self = this;

    this.recentSearches.forEach(city => {
        const btn = document.createElement('button');
        btn.textContent = city;
        btn.classList.add('recent-search-btn');

        btn.addEventListener('click', function () {
            self.getWeather(city);
        });

        this.recentSearchesContainer.appendChild(btn);
    });
};


// ===== Initialize App =====
// Replace YOUR_API_KEY with your actual OpenWeatherMap API key
const app = new WeatherApp('YOUR_API_KEY');