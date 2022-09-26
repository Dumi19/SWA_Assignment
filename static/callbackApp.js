const baseUrl = 'http://localhost:8080';
const request_ = new XMLHttpRequest();
async function getForecast(city){
request_.open('GET', `${baseUrl}/forecast`);
request_.send();  
request_.onload = async () => {
    if (request_.readyState === XMLHttpRequest.DONE && request_.status === 200) {
        let res = JSON.parse(request_.responseText);
            let html = '';
            let a = res.filter((w) => w.place.toLowerCase() == city.toLowerCase());
            a.forEach(weather => {
            let date = new Date(weather.time);
            let hr = date.getUTCHours() +":" + addZeroBefore(date.getUTCMinutes());
            
            html += '<div class="col-md-3 card">'
            html +=  `<div>Place: ${weather.place} <br>
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

