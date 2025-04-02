//This function executes when the button is pushed, and it grabs the weather info from the API
function getWeather(){
    const apiKey = '60ff0493fc0209ccef573e52dc268352'; //my api key from the weather app https://openweathermap.org/
    const city = document.getElementById('city').value; //stores the value input by the user in the search bar

    

    //error handling
    if (!city){ //if the search bar is blank
        alert('Please enter a city'); //notify the user and exit the function
        return
    }

    //storing URLS
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;//THIS WORKS
    // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; //upcoming forecast  ORIGINAL
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/hourly?q=Lockport,us&mode=xml&appid=${apiKey}`; //CANT GET THIS TO WORK

    //fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json()) //jsonify the data
        .then(data => {
            displayWeather(data); //calling displayWeather function with jsonified data
        })
        .catch(error => { //error handling
            console.error('Error fetching weather data:',error);
            alert('Error getting weather data');
        });

    //fetch upcoming weather
    fetch(forecastUrl)
        .then(response => response.json()) //jsonify the data
        .then(data => {
            displayHourlyForecast(data.list);  //calling displayHourlyForecast function
        })
        .catch(error => { //error handling
            console.error('Error fetching hourly forecast:',error)
            alert('Error fetching hourly forecast');
        });
}

//This function displays the weather data to the HTML
function displayWeather(data){
    //creating references to divs where info will be displayed
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv =  document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // //clear anything that was in the divs from a previous request
    // weatherInfoDiv.innerHTML = ' ';                                                     IF THESE ARE ACTIVE, CURRENTWEATHER WILL THROW AN ERROR
    // hourlyForecastDiv.innerHTML = ' ';
    // tempDivInfo.innerHTML = ' ';

    //error handling
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }
    else {
        //storing relevent data from API call in variable
        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°F</p>`;
        
        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>`;
        //input the weather data into the divs
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }

}

//This function displays the hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => { //iterate through the next 24 hours and extract relevant data
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = item.main.temp;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°F/span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml; //append content to the div
    });
}
//this function shows the relevant weather icon given by the API
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}