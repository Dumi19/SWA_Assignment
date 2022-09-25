async function getForecast(){
    let url = "http://localhost:8080/forecast"
    try {
     let response = await fetch(url);
     return await response.json();
    } catch (error) {
     console.log(error);
    }     
}

async function renderForcast(city){
 let weather = await getForecast();
 let html = '';
 let a = weather.filter((w) => w.place.toLowerCase() == city.toLowerCase());
  if(a.length == 0){
    html += '<span>City does not exist</span>'
  }
 a.forEach(weather => {
   let date = new Date(weather.time);
   let hr = date.getUTCHours() +":" + addZeroBefore(date.getUTCMinutes());
   
   html += '<div class="col-md-3 card">'
   html +=  `<div>Place: ${weather.place} <br>
                                            From: ${weather.from} °C <br>
                                            To: ${weather.to} °C <br>
                                            Time: ${hr}</div> <br>`
   html += '</div>'
 });
 let container = document.querySelector(".row")
 container.innerHTML = html;

 function addZeroBefore(n) {
   return (n < 10 ? '0' : '') + n;
 }
}