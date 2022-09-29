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
  const myCityWeatherList = cityWeather.filter((filter) => filter.place.toLowerCase() == city.toLowerCase()).map(weatherData)
  let html = '';
  myCityWeatherList.forEach(cityWeather => {
    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${cityWeather.data.getPlace()} <br>
                    Type: ${cityWeather.data.getType()} <br>
                    Value: ${cityWeather.getValue()} ${cityWeather.data.getUnit()}<br>
                    </div> <br>`
    html += '</div>'
  });
  let contianerWeather = document.querySelector(".row")
  contianerWeather.innerHTML = html;
}

async function renderForecast(city){
  getMinMaxTemp(city);
  let weatherForecasts = await getForecast();
  let html = '';
  let listHtml = '' 

  const myForcastList = weatherForecasts.filter((fc) => fc.place.toLowerCase() == city.toLowerCase()).map(forecast);
  myForcastList.forEach(weather => {
    let date = new Date(weather.data.getTime());
    let hr = date.getUTCHours() +":" + addZeroBefore(date.getUTCMinutes());
       
     if(weather.getPrecipitationTypes() !== undefined){ getList(weather.getPrecipitationTypes())}
     if(weather.getDirections() !== undefined){ getList(weather.getDirections())}

    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${weather.data.getPlace()} <br>
                    Type: ${weather.data.getType()} <br>`
    if(listHtml !== ''){
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

  function getList(list){
      listHtml += "<ul>"
      list.forEach(i => {
        listHtml += `<li>
                  ${i}
                </li>`
      });
      listHtml +="</ul>"
  }
}

async function getMinMaxTemp(city)
{

  let d = await getData();
  const myDataList = d.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "temperature").filter((w) => {
    let date = new Date(w.time);
    return date.getDate() == getPreviousDay();
  }).map(weatherData);
  let minTemp = myDataList.map(element => element.getValue()).reduce((a, b) => Math.min(a, b));
  let maxTemp = myDataList.map(element => element.getValue()).reduce((a, b) => Math.max(a, b));
  let html = '<div class="col-md-4 card">';
  html += 'Minimum temperature: ' + minTemp + '<br>';
  html += 'Maximum temperature: ' + maxTemp + '<br>';
  html += '</div>'

  //Average wind speed for the last day
  const myDataListForWind = d.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "wind speed").filter((w) => {
    let date = new Date(w.time);
    return date.getDate() == getPreviousDay();
  }).map(weatherData);
  const averageWindSpeed = myDataListForWind.map(element => element.getValue()).reduce((a, b) => a + b, 0) / myDataListForWind.length;
  html += '<div class="col-md-4 card">';
  html += 'Average Wind Speed: ' + parseFloat(averageWindSpeed).toFixed(1) + '<br>';
  html += '</div>'

  //Total precipitation for the last day
  const myDataListForPrecipitation = d.filter((w) => w.place.toLowerCase() == city.toLowerCase()).filter((w) => w.type == "precipitation").filter((w) => {
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

async function latestData() {
  let weather = await getData();
  const myDataList = weather.map(weatherData)
  let html = '';
  let a = () => new Date(
    myDataList
      .map(element => new Date(element.data.getTime()))
      .map(Date.parse) // get dates in milliseconds (used for finding the latest date)
      .reduce((previous, current) => Math.max(previous, current))
  );
  const latestData = myDataList.filter(element => new Date(element.data.getTime()).getTime() === a().getTime());
  latestData.forEach(weather => {
    let date = new Date(weather.data.getTime());
    let hr = date.getUTCHours() + ":" + addZeroBefore(date.getUTCMinutes());

    html += '<div class="col-md-2 card">'
    html += `<div>Place: ${weather.data.getPlace()} <br>
                  Type: ${weather.data.getType()} <br>
                  Unit: ${weather.data.getUnit()} <br>
                  Value: ${weather.getValue()} <br>                                                   
                  Time: ${hr}</div> <br>`
    html += '</div>'
  });

  let container = document.querySelector(".row")
  container.innerHTML = html;

  function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }
}