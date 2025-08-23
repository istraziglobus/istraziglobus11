document.addEventListener("DOMContentLoaded", function () {
  const cities = [
    { name: "Reykjavik", currency: "ISK" },
    { name: "Tokyo", currency: "JPY" },
    { name: "Sydney", currency: "AUD" },
    { name: "New York", currency: "USD" },
    { name: "Belgrade", currency: "RSD" },
    { name: "Moscow", currency: "RUB" },
    { name: "Madrid", currency: "EUR" },
    { name: "Havana", currency: "CUP" },
    { name: "Kuala Lumpur", currency: "MYR" },
    { name: "Cairo", currency: "EGP" },
    { name: "Shanghai", currency: "CNY" },
    { name: "Dubai", currency: "AED" },
    { name: "Paris", currency: "EUR" },
    { name: "Los Angeles", currency: "USD" },
    { name: "Beijing", currency: "CNY" },
    { name: "Berlin", currency: "EUR" },
    { name: "Istanbul", currency: "TRY" },
    { name: "Buenos Aires", currency: "ARS" },
    { name: "Hong Kong", currency: "HKD" },
    { name: "London", currency: "GBP" },
    { name: "Singapore", currency: "SGD" },
    { name: "Rio de Janeiro", currency: "BRL" }
  ];

  const exchangeRates = {
    "EUR": 1, "USD": 1.17, "GBP": 0.86, "AUD": 1.80, "JPY": 172.15,
    "RSD": 117.24, "RUB": 93.75, "CNY": 8.41, "AED": 4.29, "TRY": 47.72,
    "ARS": 1518.57, "HKD": 9.16, "ISK": 143.20, "CUP": 28.05, "MYR": 4.92,
    "EGP": 56.49, "SGD": 1.50, "BRL": 6.07
  };

  const weatherAPIKey = "006710101db1b5a700d24c46ac3f67bb";
  
  const weatherTranslations = {
    "clear sky": "vedro",
    "few clouds": "uglavnom sunčano",
    "scattered clouds": "promenljivo oblačno",
    "broken clouds": "oblačno",
    "overcast clouds": "tmurno",
    "light rain": "slaba kiša",
    "moderate rain": "umerena kiša",
    "heavy intensity rain": "jaka kiša",
    "very heavy rain": "obilna kiša",
    "extreme rain": "ekstremna kiša",
    "freezing rain": "kiša koja se ledi",
    "light intensity shower rain": "slaba pljuskovita kiša",
    "shower rain": "pljusak",
    "heavy intensity shower rain": "jak pljusak",
    "ragged shower rain": "nepravilni pljuskovi",
    "light snow": "slab sneg",
    "snow": "sneg",
    "heavy snow": "obilan sneg",
    "sleet": "susnežica",
    "light shower sleet": "slaba susnežica",
    "shower sleet": "susnežica",
    "light rain and snow": "slaba kiša i sneg",
    "rain and snow": "kiša i sneg",
    "light shower snow": "slab snežni pljusak",
    "shower snow": "snežni pljusak",
    "heavy shower snow": "obilan snežni pljusak",
    "thunderstorm": "oluja",
    "thunderstorm with light rain": "oluja sa slabom kišom",
    "thunderstorm with rain": "oluja sa kišom",
    "thunderstorm with heavy rain": "oluja sa jakom kišom",
    "light thunderstorm": "slaba oluja",
    "heavy thunderstorm": "jaka oluja",
    "ragged thunderstorm": "nepravilna oluja",
    "thunderstorm with light drizzle": "oluja sa slabom rosuljom",
    "thunderstorm with drizzle": "oluja sa rosuljom",
    "thunderstorm with heavy drizzle": "oluja sa jakom rosuljom",
    "mist": "magla",
    "smoke": "dim",
    "haze": "izmaglica",
    "sand/dust whirls": "prašina/vrtlozi",
    "fog": "magla",
    "sand": "pesak",
    "dust": "prašina",
    "volcanic ash": "vulkanski pepeo",
    "squalls": "udari vetra",
    "tornado": "tornado"
  };

  const aqiTranslations = {
    1: "Dobar",
    2: "Zadovoljavajući",
    3: "Umjeren",
    4: "Loš",
    5: "Vrlo loš"
  };

  let currentIndex = Math.floor(Math.random() * cities.length);
  const cityCache = {};
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minuta

  async function fetchAllData() {
    const city = cities[currentIndex];
    const now = Date.now();
    const cached = cityCache[city.name];

    if (cached && now - cached.timestamp < CACHE_DURATION) {
        displayData(cached, city);
        currentIndex = (currentIndex + 1) % cities.length;
        return;
    }

    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${weatherAPIKey}`);
        const weatherData = await weatherResponse.json();

        const airPollutionResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${weatherAPIKey}`);
        const airPollutionData = await airPollutionResponse.json();

        const dataToCache = {
            weather: weatherData,
            airQuality: airPollutionData,
            timestamp: now
        };
        cityCache[city.name] = dataToCache;
        displayData(dataToCache, city);

    } catch (error) {
        console.error("Greška pri dohvatanju podataka:", error);
        document.getElementById("local-time").textContent = "Nema podataka";
        document.getElementById("weather").textContent = "Nema podataka";
        document.getElementById("currency").textContent = "";
        document.getElementById("air-quality").textContent = "";
    }
    
    currentIndex = (currentIndex + 1) % cities.length;
  }

  function displayData(data, city) {
      // 1. PODEŠAVANJE VREMENA (-2 SATA)
      const localTime = new Date(new Date().getTime() + data.weather.timezone * 1000);
      localTime.setHours(localTime.getHours() - 2);
      document.getElementById("local-time").textContent =
          `Lokalno vreme: ${localTime.toLocaleTimeString('sr-RS', { timeStyle: 'short' })}`;

      // Prikazuje ime grada i zastavu
      const countryCode = data.weather.sys.country.toLowerCase();
      document.getElementById("city-name").innerHTML = `
          ${data.weather.name}, ${data.weather.sys.country} 
          <img src="https://flagcdn.com/w320/${countryCode}.png" alt="Zastava" class="country-flag">
      `;

      // 3. PREVOD VREMENA IZ REČNIKA
      let description = data.weather.weather[0].description;
      if (weatherTranslations[description]) {
          description = weatherTranslations[description];
      }
      document.getElementById("weather").textContent = `${Math.round(data.weather.main.temp)}°C, ${description}`;

      const currencyElement = document.getElementById("currency");
      if (city.currency === "EUR") currencyElement.textContent = "Lokalna valuta: EUR";
      else if (exchangeRates[city.currency]) {
          currencyElement.textContent = `1 EUR = ${exchangeRates[city.currency].toFixed(2)} ${city.currency}`;
      } else currencyElement.textContent = "Nema podataka o valuti";

      // 2. KVALITET VAZDUHA (SA PREVODOM I OCENOM)
      if (data.airQuality && data.airQuality.list && data.airQuality.list[0]) {
          const aqi = data.airQuality.list[0].main.aqi;
          document.getElementById("air-quality").textContent = `Kvalitet vazduha: ${aqiTranslations[aqi]} (${aqi}/5)`;
      } else {
          document.getElementById("air-quality").textContent = "Kvalitet vazduha: Nema podataka";
      }

      document.getElementById("location-image").src = `/slike/city/${data.weather.name.toLowerCase().replace(/\s/g,'')}.jpg`;
  }

  fetchAllData();
  setInterval(fetchAllData, 10000);
});