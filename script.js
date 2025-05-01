

// For my project, I'd like to build a weather app. The user will be able to enter any city into a search bar, and once they hit the search button they will see the current weather for the city,
// as well as an upcoming forecast. Some icons will also appear. I will be using an api from openweathermap.org. I will build the project using the fetch() function in JavaScript, along with HTML and CSS. 
// In the week 1 PR, I demonstrated the ability to recieve data from an API GET request, and display that data to the screen. For the Week 2 PR, I have created the prototype for the application. 
// I had initially had created the bare bones functionality of the app, which displays the current weather data for a city. (no forecast) But the city had to be hardcoded in to API call, (line 16 in script.js). 
// However, I spent some time each evening this week 'feature creeping' just for fun, and I've actually got the program pretty close to it's full functionality. I understand that it is now more
// than a prototype, but I figured I should submit what I have regardless of the project being ahead of schedule. 
// NOTE: the forecast city is still being hardcoded (line 17, currently set as 'Lockport'), and my next goal is to implement that feature via the search bar.
// After that, I need to add some styling (maybe some bootstrap?) to make the application look visually pleasing. 
// All of the code was written by me, following documentation from openweathermap.org.  

// PART 3:
// As of PR2, my project was mostly complete. I added the styling, and played around with the color pallete. I ended up staying with an Orange/Red theme, but I might change it later.
// Additionally, I added a function that capitalizes the first letter of every word in the weather description, as the API return is all lowercase. I did this using a RegEx.
//For PR4, im considering adding a "use current location" button.

//  PART 4:
// Added a "use current location button". Struggled with getting this to work, turns out I had location turned off in windows settings. Make sure yours in enabled for the service to work properly!
// I also redid the styling to make the ui larger, and using the Math.round method to remove the decimals that are included by default in the temperature


const apiKey = 'YOUR API KEY HERE'; //my api key from the weather app https://openweathermap.org/

//This function executes when the button is pushed, and it grabs the weather info from the API
function getWeather(){
    const city = document.getElementById('city').value; //stores the value input by the user in the search bar

    //error handling
    if (!city){ //if the search bar is blank
        alert('Please enter a city'); //notify the user and exit the function
        return
    }

    //storing URLS
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`; 

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

//This function will capitalize the first letter of every word in the description
function capitalizeWords(str){
    return str.replace(/\b\w/g, char => char.toUpperCase()); //Regex to capitalize first letter of each word
}

//This function displays the weather data to the HTML
function displayWeather(data){
    //creating references to divs where info will be displayed
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv =  document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    //clear anything that was in the divs from a previous request
    weatherInfoDiv.innerHTML = ' ';                                                     
    hourlyForecastDiv.innerHTML = ' ';
    tempDivInfo.innerHTML = ' ';

    //error handling
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }
    else {
        //storing relevent data from API call in variable
        const cityName = data.name;
        const temperature =  Math.round(data.main.temp); //using round to remove decimals
        const description = capitalizeWords(data.weather[0].description); //calling capitalizeWords function and storing output in const
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
    //Debugging
    if (!hourlyForecastDiv) {
        console.error("Element with ID 'hourly-forecast' not found."); //this led me to discover a typo in the div id in the html, I had named it "hourly-forcast", missing an 'e'
        return;
    }


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
                <span>${temperature}°F</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml; //append content to the div
    });
}

document.getElementById('location-btn').addEventListener('click', function() { //adding event listener for location btn
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( //using browser's built in geolocation method
            position => {
                useCurrentLocation(position.coords.latitude, position.coords.longitude); //calling useCurrentLocation function, using the coords from browsers geolocator
            },
            error => { //debugging
                console.error(error); 
                alert('Unable to retrieve your location.'); 
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});


//This function fetches the current weather and forecast using the geolocater within the browser
//ENSURE LOCATION SERVICES ARE ENABLED IN OS SETTINGS!!!
function useCurrentLocation(lat, lon){ //NOTE: couldnt get this to work for the longest time, turns out I had my location services turned off on my PC!
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; //using lat and lon coords
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`; 

        //fetch current weather using lat and lon
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

//this function shows the relevant weather icon given by the API
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
