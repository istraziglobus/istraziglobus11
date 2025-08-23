document.addEventListener("DOMContentLoaded", function () {
  const cities = [
    { name: "Reykjavik", timezone: "Atlantic/Reykjavik" },
    { name: "Tokyo", timezone: "Asia/Tokyo" },
    { name: "Sydney", timezone: "Australia/Sydney" },
    { name: "New York", timezone: "America/New_York" },
    { name: "Beograd", timezone: "Europe/Belgrade" },
    { name: "Moskva", timezone: "Europe/Moscow" },
    { name: "Madrid", timezone: "Europe/Madrid" },
    { name: "Montevideo", timezone: "America/Montevideo" },
    { name: "Havana", timezone: "America/Havana" },
    { name: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur" },
    { name: "Kairo", timezone: "Africa/Cairo" },
    { name: "Šangaj", timezone: "Asia/Shanghai" },
    { name: "Dubai", timezone: "Asia/Dubai" },
    { name: "Pariz", timezone: "Europe/Paris" },
    { name: "Los Angeles", timezone: "America/Los_Angeles" },
    { name: "Peking", timezone: "Asia/Shanghai" },
    { name: "Berlin", timezone: "Europe/Berlin" },
    { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
    { name: "Mexico City", timezone: "America/Mexico_City" },
    { name: "Istanbul", timezone: "Europe/Istanbul" },
    { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires" },
    { name: "Hong Kong", timezone: "Asia/Hong_Kong" }
  ];
  
  // Izaberi nasumičan grad
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  const weatherAPIKey = "TVOJ_OPENWEATHERMAP_API_KEY";
  const unsplashKey = "TVOJ_UNSPLASH_API_KEY";
  
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&lang=hr&appid=${weatherAPIKey}`;
  
  // Povuci vreme sa drugog, pouzdanijeg servisa
  fetch(`https://timezoneapi.io/api/timezone/?${city.timezone}&token=tzpI6rXbL4t16rXzI34`)
    .then(res => res.json())
    .then(data => {
      const time = new Date(data.data.datetime.date_time_iso);
      document.getElementById("local-time").textContent = `Lokalno vreme: ${time.toLocaleTimeString('hr-HR', { timeStyle: 'short' })}`;
    })
    .catch(() => {
      document.getElementById("local-time").textContent = "Nema podataka o vremenu";
    });

  // Povuci vreme sa OpenWeatherMap-a
  fetch(weatherURL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("weather").textContent = `${Math.round(data.main.temp)}°C, ${data.weather[0].description}`;
    })
    .catch(() => {
      document.getElementById("weather").textContent = "Nema podataka o vremenu";
    });

  // Povuci sliku sa Unsplash-a
  fetch(`https://api.unsplash.com/search/photos?query=${city.name}&client_id=${unsplashKey}&orientation=landscape`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        document.getElementById("location-image").src = data.results[0].urls.regular;
      }
    })
    .catch(() => {
      document.getElementById("location-image").alt = "Slika nije dostupna";
    });
});