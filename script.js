document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch weather data from the API based on user input
    const apiKey = '2e44151f52befa2a805295658788e71e';
    const cityHistory=JSON.parse(localStorage.getItem("city")) ||[];
    
    
    function fetchWeatherData(city) {
      
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          displayCurrentWeather(city, data);
          displayForecast(data);
          addToSearchHistory(city);
        })
        // .catch(error => console.error('Error fetching weather data:', error));
    }
  
    // Function to display current weather conditions
    function displayCurrentWeather(city, data) {
       const currentWeatherSection = document.getElementById('currentWeather');
        const cityName = data.city.name;
        const date = new Date(data.list[0].dt * 1000).toLocaleDateString('en-US' , { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let iconUrl = '';
        if (data.list[0].weather && data.list[0].weather.length > 0) {
        iconUrl = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
        } else {
            //handlt the case where weather data is missing
            iconUrl = 'default-weather-icon-url.png'; // or provide a default icon URL
        }
        const temperatureFahrenheit = data.list[0].main.temp;
        const humidity = data.list[0].main.humidity;
        const windSpeed = data.list[0].wind.speed;

        const currentWeatherHTML = `
        <h2>${cityName}</h2>
        <p>Date: ${date}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperatureFahrenheit}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        
        `;

        currentWeatherSection.innerHTML = currentWeatherHTML;
    
      



}
  
    function displayForecast(forecastData) {
      const forecastSection = document.getElementById('forecast');
     forecastSection.innerHTML = ''; //clear existing forecast data

     const dates ={};
     forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt_txt.split(' ')[0]).toLocaleDateString('en-US');
        if (!dates[date] && Object.keys(dates).length < 5) {
            dates[date] = true;

         const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`; 
        const temperature = forecast.main.temp; 
        const humidity = forecast.main.humidity; 
        const windSpeed = forecast.wind.speed; 

        const forecastHTML = `
        <div class="forecast-day"> 
        <h3>${date}</h3> 
        <img src="${iconUrl}" alt="Weather Icon"> 
        <p>Temperature: ${temperature}°F</p> 
        <p>Humidity: ${humidity}%</p> 
        <p>Wind Speed: ${windSpeed} mph</p>
         </div> 
         
         `; 

        forecastSection.innerHTML += forecastHTML;
     }
    });

}
        
        


  
    // Function to add searched city to the search history
    function addToSearchHistory(city) {
      const searchHistorySection = document.getElementById('searchHistory');
      const cityElement = document.createElement('div');
      cityElement.textContent = city;
      cityElement.classList.add('searchedCity');
      searchHistorySection.appendChild(cityElement);
    }
  
    // Event listener for form submission
    document.getElementById('searchForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const city = document.getElementById('cityInput').value.trim();
      fetchWeatherData(city);
    });
  
    // Event listener for click on search history
    document.getElementById('searchHistory').addEventListener('click', function(event) {
      if (event.target.classList.contains('searchedCity')) {
        const city = event.target.textContent;
        fetchWeatherData(city);
      }
    });
  });
