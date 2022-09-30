/* Creating a constant variable called baseUrl and assigning it the value of the url of the server.
also creating a constant variable called request_ and assigning it the value of a new XMLHttpRequest
object. */
const baseUrl = 'http://localhost:8080';
const request_ = new XMLHttpRequest();

/**
 * It takes a city name as a parameter, makes a GET request to the server, and then displays the
 * results in the browser.
 * @param city - The city name
 */
async function getForecast(city) {
  request_.open('GET', `${baseUrl}/forecast`);
  request_.send();
  request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
      let res = JSON.parse(request_.responseText);
      let html = '';
      const myCityWeatherList = res.filter((filter) => filter.place.toLowerCase() == city.toLowerCase()).map(weatherData)
      myCityWeatherList.forEach(weather => {
        let date = new Date(weather.time);
        let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

        html += '<div class="col-md-3 card">'
        html += `<div>Place: ${weather.data.getPlace()} <br>
                                                    Type: ${weather.data.getType()} <br>
                                                    Unit: ${weather.data.getUnit()} <br>
                                                    From: ${weather.data.getFrom()} <br>
                                                    To: ${weather.data.getTo()} <br>                                                    
                                                    Time: ${hr}</div> <br>`
        html += '</div>'
      });
      let container = document.querySelector(".row")
      container.innerHTML = html;

      function addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n;
      }
    } else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}

/**
 * It takes a city name as an argument, makes a GET request to the server, and then displays the data
 * in the browser.
 * @param  - the city name
 */
async function getCityWeather(city) {
  request_.open('GET', `${baseUrl}/data`);
  request_.send()
  request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
      let res = JSON.parse(request_.responseText);
      let html = '';
      let b = res.filter((w) => w.place.toLowerCase() == city.toLowerCase());
      b.forEach(cityWeather => {
        html += '<div class="col-md-2 card">'
        html += `<div>Place: ${cityWeather.place} <br>
                    Type: ${cityWeather.type} <br>
                    Value: ${cityWeather.value} ${cityWeather.unit}<br>
                    </div> <br>`
        html += '</div>'
      });
      let container = document.querySelector(".row")
      container.innerHTML = html
    } else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}

/**
 * It renders the forecast for a given city
 * @param city - the city to search for
 */
async function renderForecast(city) {
  request_.open('GET', `${baseUrl}/forecast`);
  request_.send()
  request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
      let res = JSON.parse(request_.responseText);
      getMinMaxTemp(city);
      let html = '';
      let listHtml = ''
      const myForcastList = res.filter((fc) => fc.place.toLowerCase() == city.toLowerCase()).map(forecast);

      myForcastList.forEach(weather => {
        let date = new Date(weather.data.getTime());
        let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

        if (weather.getPrecipitationTypes() !== undefined) { getList(weather.getPrecipitationTypes()) }
        if (weather.getDirections() !== undefined) { getList(weather.getDirections()) }

        html += '<div class="col-md-2 card">'
        html += `<div>Place: ${weather.data.getPlace()} <br>
                    Type: ${weather.data.getType()} <br>`

        if (listHtml !== '') {
          html += `${listHtml}`
        }
        html += `                     
                    Unit: ${weather.data.getUnit()} <br>
                    From: ${weather.getFrom()} <br>
                    To: ${weather.getTo()} <br>                                                    
                    Time: ${hr}</div> <br>`
        html += '</div>'
        listHtml = ''
      });
      let container = document.querySelector(".data")
      container.innerHTML = html;

      function addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n;
      }
      function getList(list) {
        listHtml += "<ul>"
        list.forEach(i => {
          listHtml += `<li>
                      ${i}
                    </li>`
        });
        listHtml += "</ul>"
      }
    } else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}

/**
 * It gets the latest data from the server and displays it on the page.
 */
async function latestData() {
  request_.open('GET', `${baseUrl}/data`);
  request_.send()
  request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
      let res = JSON.parse(request_.responseText);
      let html = '';
      let a = () => new Date(
        res.map(element => new Date(element.time))
          .map(Date.parse)
          .reduce((previous, current) => Math.max(previous, current))
      );
      const latestData = res.filter(element => new Date(element.time).getTime() === a().getTime());
      latestData.forEach(weather => {
        let date = new Date(weather.time);
        let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

        html += '<div class="col-md-2 card">'
        html += `<div>Place: ${weather.place} <br>
                  Type: ${weather.type} <br>
                  Unit: ${weather.value} ${weather.unit} <br>                                                
                  Time: ${hr}</div> <br>`
        html += '</div>'
      });

      let container = document.querySelector(".row")
      container.innerHTML = html;

      function addZeroBefore(n) {
        return (n < 10 ? '0' : '') + n;
      }
    } else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}

/**
 * It takes a city name as a parameter, makes a request to the server, filters the data based on the
 * city name, date.
 *  calculates the minimum and maximum temperature, average wind speed,
 * and total precipitation.
 * 
 * @param city - The name of the city to get the weather data for.
 */

async function getMinMaxTemp(city) {
  request_.open('GET', `${baseUrl}/data`);
  request_.send()
  request_.onload = async () => {

    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {

      let data = JSON.parse(request_.responseText);
      const myDataList = data.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "temperature").filter((w) => {
        let date = new Date(w.time);
        return date.getDate() == getPreviousDay();
      }).map(weatherData);
      let minTemp = myDataList.map(element => element.getValue()).reduce((a, b) => Math.min(a, b));
      let maxTemp = myDataList.map(element => element.getValue()).reduce((a, b) => Math.max(a, b));
      let html = '<div class="col-md-4 card">';
      html += 'Minimum temperature: ' + minTemp + '<br>';
      html += 'Maximum temperature: ' + maxTemp + '<br>';
      html += '</div>'

      const myDataListForWind = data.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "wind speed").filter((w) => {
        let date = new Date(w.time);
        return date.getDate() == getPreviousDay();
      }).map(weatherData);
      const averageWindSpeed = myDataListForWind.map(element => element.getValue()).reduce((a, b) => a + b, 0) / myDataListForWind.length;
      html += '<div class="col-md-4 card">';
      html += 'Average Wind Speed: ' + parseFloat(averageWindSpeed).toFixed(1) + '<br>';
      html += '</div>'

      const myDataListForPrecipitation = data.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "precipitation").filter((w) => {
        let date = new Date(w.time);
        return date.getDate() == getPreviousDay();
      }).map(weatherData);
      const totalPrecipitation = myDataListForPrecipitation.map(element => element.getValue()).reduce((a, b) => a + b, 0);
      html += '<div class="col-md-4 card">';
      html += 'Total Precipitation: ' + parseFloat(totalPrecipitation).toFixed(1) + '<br>';
      html += '</div>'

      function getPreviousDay() {
        let previous = new Date();
        previous.setDate(previous.getDate() - 1);
        return previous.getDate();
      }

      let container = document.querySelector(".minMaxTemp")
      container.innerHTML = html;
    }
    else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}


