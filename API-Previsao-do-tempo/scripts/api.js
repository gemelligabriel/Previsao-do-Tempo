const cityName = document.getElementById("city__name");
const body = document.querySelector("body");

//mapa

const mapButton = document.querySelector("#map__button");
mapButton.addEventListener("click", (e) => {
  e.preventDefault();
  const mapa = document.querySelector("#map");
  const locationInput = document.getElementById("location__input");
  locationInput.classList.add("hidden");
  mapButton.classList.add("hidden");
  mapa.classList.remove("hidden");
});

window.addEventListener("load", () => {
  const map = L.map("map", {
    minZoom: 2,
    maxZoom: 18,
  }).setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    noWarp: true,
  }).addTo(map);

  setTimeout(() => map.invalidateSize(), 100);

  var popup = L.popup();

  async function onMapClick(e) {
    const mapaLat = e.latlng.lat;
    const mapaLon = e.latlng.lng;

    popup
      .setLatLng(e.latlng)
      .setContent("Buscando clima nesta posição...")
      .openOn(map);

    try {
      const weather = await fetchWeather(mapaLat, mapaLon);
      const dias = separandoOsDias(weather);
      alteraHtml(dias);
      const mapa = document.querySelector("#map");
      mapa.classList.add("hidden");
      cityNameChange("mapa");
    } catch (error) {
      throw error;
    }

    const locationInput = document.getElementById("location__input");
    const centralizado = document.querySelector("#centraliza");
    const tabelinha = document.querySelector("#tabelinha");
    const mapButton = document.querySelector("#map__button");
    mapButton.classList.remove("hidden");
    centralizado.classList.remove("centraliza");
    tabelinha.classList.remove("hidden");
    locationInput.classList.remove("hidden");
  }
  map.on("click", onMapClick);
});

//visual
function cityNameChange(location) {
  if (!location) {
    cityName.innerHTML = "Nenhuma cidade encontrada...";
  } else {
    cityName.innerHTML = location;
  }
}

//chat fez a força
function traduzirCodigo(codigo) {
  console.log(`o codigo é ${codigo}`);

  if (codigo === 0 || codigo === 1) return "Céu limpo ☀️";
  if ([2, 3].includes(codigo)) return "Parcialmente nublado ⛅";
  if ([45, 48].includes(codigo)) return "Nevoeiro 🌫️";
  if ([51, 53, 55, 56, 57].includes(codigo)) return "Garoa 🌦️";
  if ([61, 63, 65, 66, 67].includes(codigo)) return "Chuva 🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(codigo)) return "Neve ❄️";
  if ([80, 81, 82].includes(codigo)) return "Pancadas de chuva ⛈️";
  if ([95, 96, 99].includes(codigo)) return "Tempestade ⛈️";
  return "Desconhecido";
}

function imgCodigo(codigo) {
  if (codigo < 2) {
    body.classList = "";
    body.classList.add("sunny");
    return "./img/iconesHoras/sol.png";
  } else if (codigo === 3) {
    body.classList = "";
    body.classList.add("cloudy");
    return "./img/iconesHoras/parcialmenteNublado.png";
  } else if (codigo <= 48) {
    body.classList = "";
    body.classList.add("fog");
    return "./img/iconesHoras/nevoeiro.webp";
  } else if (codigo <= 57) {
    body.classList = "";
    body.classList.add("drizzle");
    return "./img/iconesHoras/chuva.png";
  } else if (codigo <= 67) {
    body.classList = "";
    body.classList.add("rain");
    return "./img/iconesHoras/chuva.png";
  } else if (codigo <= 82) {
    body.classList = "";
    body.classList.add("showers");
    return "./img/iconesHoras/tempestade.webp";
  } else if (codigo <= 86 && codigo !== 80 && codigo !== 81 && codigo !== 82) {
    body.classList = "";
    body.classList.add("snow");
    return "./img/iconesHoras/neve.png";
  } else if (codigo <= 99) {
    body.classList = "";
    body.classList.add("thunderstorm");
    return "./img/iconesHoras/tempestade.webp";
  } else {
    return;
  }
}

export function mostrarCards(dias, i) {
  const dia = dias[i];
  let estado = null;
  if (dia.precipitacao <= 40) {
    estado = "chance relativamente baixa";
  } else if (dia.precipitacao <= 70) {
    estado = "chance consideravel";
  } else {
    estado = "vai sobrar nada";
  }
  const sectionInfos = document.querySelector("#section__infos");
  sectionInfos.querySelector(".average__temp__h2").innerHTML =
    `${dia.media.toFixed(0)}°`;
  sectionInfos.querySelector("#temp0_max").innerHTML =
    `${dia.maxima.toFixed(0)}°`;
  sectionInfos.querySelector("#temp0_min").innerHTML =
    `${dia.minima.toFixed(0)}°`;
  sectionInfos.querySelector("#vento").innerHTML = `${dia.vento}Km/hr`;
  sectionInfos.querySelector("#umidade").innerHTML = `${dia.umidade}%`;
  sectionInfos.querySelector("#chuva").innerHTML = `${dia.precipitacao}%`;
  sectionInfos.querySelector("#mensagem").innerHTML = estado;
  imgCodigo(dia.codigo);
}

function alteraHtml(dias) {
  const resumaoTemp = document.querySelector("#mensagemDebaixoDaTemp");
  resumaoTemp.innerHTML = traduzirCodigo(dias[0].codigo);
  const mainTemp = document.querySelector("#main__temp");
  mainTemp.innerHTML = `${dias[0].media.toFixed(0)}°C`;

  for (let i = 0; i < dias.length; i++) {
    let tempX = document.querySelector(`#day${i}_h3`);
    if (tempX) tempX.innerHTML = ` ${dias[i].media.toFixed(0)} °C`;
    let status = document.querySelector(`#day${i}_h4`);
    if (status) status.innerHTML = traduzirCodigo(dias[i].codigo);
    const imgDia = document.querySelector(`#day${i}_img`);
    if (imgDia) {
      imgDia.classList.add("weather__img");
      imgDia.src = imgCodigo(dias[i].codigo);
    }
  }
  imgCodigo(dias[0].codigo);
}

// separando os dias
function separandoOsDias(weather) {
  const diasSemana = [];
  for (let i = 0; i < 7; i++) {
    diasSemana.push({
      dia: weather.daily.time[i],
      maxima: weather.daily.temperature_2m_max[i],
      minima: weather.daily.temperature_2m_min[i],
      vento: weather.daily.windspeed_10m_max[i],
      media:
        (weather.daily.temperature_2m_max[i] +
          weather.daily.temperature_2m_min[i]) /
        2,
      umidade: weather.daily.relative_humidity_2m_max[i],
      codigo: weather.daily.weathercode[i],
      precipitacao: weather.daily.precipitation_probability_max[i],
    });
  }
  return diasSemana;
}

//apis
async function cidadePraLatLong(location) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json`,
    );
    const data = await response.json();
    if (data.length > 0) {
      console.log(data);
      return { lat: data[0].lat, lon: data[0].lon };
    }
    return null;
  } catch (error) {
    console.error("Erro na localização:", error);
    return null;
  }
}

async function fetchWeather(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relative_humidity_2m_max,precipitation_probability_max&timezone=auto`,
  );
  return response.json();
}

export async function updateWeather(city) {
  try {
    const localizacaoExata = await cidadePraLatLong(city);
    if (localizacaoExata) {
      cityNameChange(city);
      const lat = localizacaoExata.lat;
      const lon = localizacaoExata.lon;

      const weather = await fetchWeather(lat, lon);
      const dias = separandoOsDias(weather);
      alteraHtml(dias);
      return dias;
    } else {
      cityNameChange(null);
      return null;
    }
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
}
