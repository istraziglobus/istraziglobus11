module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'Grad nije proslijeđen.' });
  }

 // Čitamo ključ bezbjedno iz Vercel sistema (ne vidi se na GitHubu)
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API ključ nedostaje na serveru!' });
  }

  try {
    // Jezik stavljamo na "hr" da bi online sve radilo na čitkoj latinici
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=hr`
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Greška prilikom povezivanja sa OpenWeather servisom.' });
  }
};