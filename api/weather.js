export default async function handler(request, response) {
  const apiKey = process.env.WEATHER_API_KEY; 
  const { city, type, lat, lon } = request.query; 

  if (!city) {
    return response.status(400).json({ error: "Grad nije proslijeđen" });
  }

  // Ako JavaScript traži kvalitet vazduha (pollution)
  if (type === 'pollution' && lat && lon) {
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
      const res = await fetch(pollutionUrl);
      const data = await res.json();
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json({ error: "Greška prilikom dohvaćanja kvaliteta vazduha" });
    }
  }

  // U suprotnom, standardno vraćamo običnu vremensku prognozu
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(weatherUrl);
    const data = await res.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: "Greška prilikom dohvaćanja prognoze" });
  }
}