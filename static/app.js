async function getForecast() {
  let url = "http://localhost:8080/forecast"
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getData() {
  let url = "http://localhost:8080/data"
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
async function getCityWeather(city) {
  let cityWeather = await getData();
  let html = '';
  let filter = cityWeather.filter((filter) => filter.place.toLowerCase() == city.toLowerCase());
  filter.forEach(cityWeather => {
    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${cityWeather.place} <br>
                    Type: ${cityWeather.type} <br>
                    Value: ${cityWeather.value} ${cityWeather.unit}<br>
                    </div> <br>`
    html += '</div>'
  });
  let contianerWeather = document.querySelector(".row")
  contianerWeather.innerHTML = html;
}


async function renderForecast(city){
  getMinMaxTemp(city);
  let weather = await getForecast();
  let html = '';
  let a = weather.filter((w) => w.place.toLowerCase() == city.toLowerCase());
  a.forEach(weather => {
    let date = new Date(weather.time);
    let hr = date.getUTCHours() +":" + addZeroBefore(date.getUTCMinutes());    

    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${weather.place} <br>
                    Type: ${weather.type} <br>
                    Unit: ${weather.unit} <br>
                    From: ${weather.from} <br>
                    To: ${weather.to} <br>                                                    
                    Time: ${hr}</div> <br>`
    html += '</div>'
  });
  let container = document.querySelector(".data")
  container.innerHTML = html;

  function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

}

async function getMinMaxTemp(city)
{
  let data = await getData();
  let b = data.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "temperature");
  let minTemp = b.map(element => element.value).reduce((a, b) => Math.min(a, b));
  let maxTemp = b.map(element => element.value).reduce((a, b) => Math.max(a, b));
  let html = '';
  html += 'Minimum temperature: ' + minTemp + '<br>';
  html += 'Maximum temperature: ' + maxTemp + '<br>';
  let container = document.querySelector(".minMaxTemp")
  container.innerHTML = html;
}

async function latestData() {
  let weather = await getData();
  let html = '';
  let a = () => new Date(
    weather
      .map(element => new Date(element.time))
      .map(Date.parse) // get dates in milliseconds (used for finding the latest date)
      .reduce((previous, current) => Math.max(previous, current))
  );
  const latestData = weather.filter(element => new Date(element.time).getTime() === a().getTime());
  latestData.forEach(weather => {
    let date = new Date(weather.time);
    let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${weather.place} <br>
                  Type: ${weather.type} <br>
                  Unit: ${weather.unit} <br>
                  Value: ${weather.value} <br>                                                   
                  Time: ${hr}</div> <br>`
    html += '</div>'
  });

  let container = document.querySelector(".row")
  container.innerHTML = html;

  function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }
}