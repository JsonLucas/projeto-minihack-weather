const apiKey = 'b8e122626fb7493a9e98863509c239de';
const locationData = {
	cep: '',
	lat: '',
	lon: '',
	country: ''
};

function renderInitialCard(){
	const main = document.querySelector('.main');
	main.innerHTML = `
			<section class='section-enter-location'>
				<div class='container'>
					<div class='card-enter-location'>
						<div class='inputs'>
							<div class='fields'>
								<input type='text' placeholder='Digite o cep da sua cidade.'>
							</div>
							<div class='fields'>
								<input type='text' placeholder='Digite o país que se localiza.'>
							</div>
							<div class='btn'>
								<input type='button' value='Procurar. . .' onclick='getLocation()'>
							</div>
						</div>
					</div>
				</div>
			</section>`;
}

function getLocation(){
	const data = document.querySelectorAll('.fields > input');
	let cep, auxCep1, auxCep2;
	for(let i = 0; i < data.length; i++){
		switch(i){
			case 0:
			cep = data[i].value;
			if(cep[5] !== '-'){
				auxCep1 = data[i].value.substring(0, 5);
				auxCep2 = data[i].value.substring(5); //63870-000
				locationData.cep = `${auxCep1}-${auxCep2}`;
			}else{
				locationData.cep = cep;
			}
			break;
			case 1:
			locationData.country = data[i].value.toLowerCase();
			break;
		}
	}
	if(locationData.country === 'brasil'){
		locationData.country = 'BR';
	}
	getCoordinates(locationData);
}

function getCoordinates(locationData){
	const request = axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${locationData.cep},
		${locationData.country}&appid=${apiKey}`);
	request.then((response) => {
		const data = response.data;
		locationData.lat = data.lat;
		locationData.lon = data.lon;
		const confirmUseLocation = confirm('deseja que sua localização seja usada para mostrar o clima?');
		useLocation(confirmUseLocation);
	}).catch((error) => { console.log(error) });
}

function useLocation(confirmation){
	if(confirmation){
		getWeather();
	}else{
		alert('obrigado por utilizar nosso sistema :)');
	}
}

function getWeather(){
	const request = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}
		&lon=${locationData.lon}&appid=${apiKey}`);
	request.then((response) => {
		renderWeatherData(response.data);
	}).catch((error) => { console.log(error); });
}

function renderWeatherData(weatherData){
	const cardWeatherInformation = document.querySelector('.card-enter-location');
	document.querySelector('#shortcut-icon').setAttribute('href', `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`);
	cardWeatherInformation.innerHTML = `<div class='main-information'>
		<div><img src='http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png'></div>
		<div><label>Geral:</label> ${weatherData.weather[0].main}</div>
		<div><label>Descrição:</label> ${weatherData.weather[0].description}</div>
		<div><label>Mínima:</label> ${parseInt(weatherData.main.temp_min)-273} °C</div>
		<div><label>Máxima:</label> ${parseInt(weatherData.main.temp_max)-273} °C</div>
		<div><label>Temperatura Atual:</label> ${parseInt(weatherData.main.temp)-273} °C</div>
		<div><label>Sensação Térmica:</label> ${parseInt(weatherData.main.feels_like)-273} °C</div>
		<div><label>Velocidade do vento:</label> ${weatherData.wind.speed} m/s</div>
		<div><label>Direção:</label> ${weatherData.wind.deg}°</div>
		<div class='btn'><input type='button' value='Pesquisar novamente' onclick='renderInitialCard();'></div>
	</div>
	`;
}
