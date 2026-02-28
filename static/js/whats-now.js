document.addEventListener("DOMContentLoaded", function () {
const cityNameElement = document.getElementById("city-name");
    if (!cityNameElement) {
        return; 
    }
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
    "EUR": 1, 
    "USD": 1.08,  
    "GBP": 0.85, 
    "AUD": 1.66, 
    "JPY": 178.00, 
    "RSD": 117.20, 
    "RUB": 96.30, 
    "CNY": 7.78,  
    "AED": 4.12, 
    "TRY": 51.40,  
    "ARS": 1620.0, 
    "HKD": 8.42,  
    "ISK": 149.0, 
    "CUP": 26.20, 
    "MYR": 4.95, 
    "EGP": 58.40, 
    "SGD": 1.45, 
    "BRL": 6.10   
};

  const weatherAPIKey = "006710101db1b5a700d24c46ac3f67bb";
  
  const weatherTranslations = {
    // ČISTO VREME
    "clear sky": "☀️ Vedro",
    
    // OBLAČNOST
    "few clouds": "🌤️ Uglavnom sunčano",
    "scattered clouds": "⛅ Promenljivo oblačno",
    "broken clouds": "☁️ Oblačno",
    "overcast clouds": "🌥️ Tmurno",
    
    // KIŠA
    "light rain": "🌧️ Slaba kiša",
    "moderate rain": "☔ Umerena kiša",
    "heavy intensity rain": "💦 Jaka kiša",
    "rain": "🌧️ Kiša", // Dodato za opšti slučaj
    "shower rain": "☔ Pljusak", 
    
    // SNEG I LED
    "light snow": "🌨️ Slab sneg",
    "snow": "❄️ Sneg",
    "heavy snow": "🥶 Obilan sneg",
    "sleet": "🌧️/❄️ Susnežica",
    
    // OLUJE I EKSTREMNI USLOVI
    "thunderstorm": "⛈️ Oluja",
    "thunderstorm with rain": "⛈️ Oluja sa kišom",
    "tornado": "🌪️ Tornado",
    
    // MAGLA I IZMAGLICA
    "mist": "🌫️ Magla",
    "smoke": "🌫️ Dim",
    "haze": "🌫️ Izmaglica",
    "fog": "🌁 Magla",
    
    // OSTALO
    "drizzle": "💧 Rosulja" 
};

 const aqiTranslations = {
    1: "Dobar", 2: "Zadovoljavajući", 3: "Umjeren", 4: "Loš", 5: "Vrlo loš"
  };

  // Funkcija za dodeljivanje boje tekstu na osnovu AQI vrednosti
  function getAqiColor(aqi) {
      switch (aqi) {
          case 1: return '#4CAF50';    // 🟢 Zelena (Dobar)
          case 2: return '#FFEB3B';   // 🟡 Žuta (Zadovoljavajući)
          case 3: return '#FF9800';    // 🟠 Narandžasta (Umjeren)
          case 4: return '#F44336';    // 🔴 Crvena (Loš)
          case 5: return '#9C27B0';    // 🟣 Ljubičasta (Vrlo loš)
          default: return 'var(--ng-muted)';
      }
  }

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
      // 1. PODEŠAVANJE VREMENA (ISPRAVKA ZA VREMENSKU ZONU)
        const utcTime = new Date().getTime(); // Trenutno vreme u ms (po lokalnom sistemu)
        const localOffset = new Date().getTimezoneOffset() * 60000; // Razlika između lokalnog sistema i UTC u ms
        const currentUTCTime = utcTime + localOffset; // Trenutno čisto UTC vreme u ms

        // Vreme grada = UTC vreme + ofset zone grada (u sekundama * 1000)
        const cityOffset = data.weather.timezone * 1000;
        const localTime = new Date(currentUTCTime + cityOffset);
        document.getElementById("local-time").innerHTML =
            `🕒 Lokalno vreme: ${localTime.toLocaleTimeString('sr-RS', { timeStyle: 'short' })}`;

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

      // Postavite ikonu valute
const currencyIcon = "💵"; 

const currencyElement = document.getElementById("currency");

// KORISTIMO innerHTML za prikaz emotikona i teksta
if (city.currency === "EUR") {
    // Ako je EUR, prikaži samo lokalnu valutu sa ikonom
    currencyElement.innerHTML = `${currencyIcon} Lokalna valuta: EUR`;
} else if (exchangeRates[city.currency]) {
    // Za ostale valute, prikaži kurs sa ikonom
    currencyElement.innerHTML = `${currencyIcon} 1 EUR = ${exchangeRates[city.currency].toFixed(2)} ${city.currency}`;
} else {
    // Ako nema podataka
    currencyElement.innerHTML = `${currencyIcon} Nema podataka o valuti`;
}

     // 2. KVALITET VAZDUHA (SADA SA BOJOM - KORISTI innerHTML)
      const airQualityElement = document.getElementById("air-quality");
      
      if (data.airQuality && data.airQuality.list && data.airQuality.list[0]) {
          const aqi = data.airQuality.list[0].main.aqi;
          const aqiText = aqiTranslations[aqi] || "Nepoznato";
          const color = getAqiColor(aqi); 
          
          // PROMENJENO: Dodajemo !important da bi boja imala najviši prioritet
          airQualityElement.innerHTML =
              `<span style="color: ${color} !important;">💨 Kvalitet vazduha: ${aqiText} (${aqi}/5)</span>`;
      } else {
          airQualityElement.innerHTML = "💨 Kvalitet vazduha: Nema podataka";
      }

    // Kreiramo ime fajla (malo slova, bez razmaka)
const cityFileName = data.weather.name.toLowerCase().replace(/\s/g,'');

// Spajamo punu adresu sajta sa putanjom do slike
// Ovo osigurava da slika radi i na početnoj i u bilo kom članku
const fullImagePath = window.location.origin + "/slike/city/" + cityFileName + ".jpg";

// Dodeljujemo tu punu putanju slici
document.getElementById("location-image").src = fullImagePath;

// TEST: Ispisaće ti u konzoli (F12) tačnu putanju koju pokušava da učita
console.log("Pokušavam učitati sliku sa: " + fullImagePath);
}
  fetchAllData();
  setInterval(fetchAllData, 10000);
});