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
      let a = res.filter((w) => w.place.toLowerCase() == city.toLowerCase());
      a.forEach(weather => {
        let date = new Date(weather.time);
        let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

        html += '<div class="col-md-3 card">'
        html += `<div>Place: ${weather.place} <br>
                                                    Type: ${weather.type} <br>
                                                    Unit: ${weather.unit} <br>
                                                    From: ${weather.from} <br>
                                                    To: ${weather.to} <br>                                                    
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
 * @param city - the city name
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
      getMinMaxTemp(city);
      let res = JSON.parse(request_.responseText);
      let html = '';
      let c = res.filter((w) => w.place.toLowerCase() == city.toLowerCase());

      if (c.length == 0) {
        html += '<span>City does not exist</span>'
      }
      c.forEach(weather => {
        let date = new Date(weather.time);
        let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

        html += '<div class="col-md-3 card">'
        html += `<div>Place: ${weather.place} <br>
                                                   From: ${weather.from} °C <br>
                                                   To: ${weather.to} °C <br>
                                                   Time: ${hr}</div> <br>`
        html += '</div>'
      });
      let container = document.querySelector(".data")
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
 * It gets the minimum and maximum temperature of a city from an API and displays it on the page.
 */
async function getMinMaxTemp() {
  request_.open('GET', `${baseUrl}/data`);
  request_.send()
  request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
      let data = JSON.parse(request_.responseText);
      let b = data.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "temperature");
      let minTemp = b.map(element => element.value).reduce((a, b) => Math.min(a, b));
      let maxTemp = b.map(element => element.value).reduce((a, b) => Math.max(a, b));
      let html = '';
      html += 'Minimum temperature: ' + minTemp + '<br>';
      html += 'Maximum temperature: ' + maxTemp + '<br>';
      let container = document.querySelector(".minMaxTemp")
      container.innerHTML = html;
    } else {
      throw new Error(`[${new Date().toISOString()}]: HTTP response: ${request_.status} ${request_.statusText}`);
    }
  }
}


