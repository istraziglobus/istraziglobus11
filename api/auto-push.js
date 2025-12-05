import Parser from "rss-parser";

const parser = new Parser();

// ❗ Tvoji podaci
const RSS_URL = "https://istraziglobus.com/index.xml"; 
const ONESIGNAL_APP_ID = "1e163b67-b061-4298-8b71-6531c3d33068";
const REST_API_KEY = "tigta6xqhukheefmg7d4z7dg4"; 
// ^ Koristimo tvoj Legacy Key (25 karaktera)

let lastPost = null;

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const latest = feed.items[0];

    // Ovu logiku pamćenja Vercel ne podržava pouzdano. 
    // Za sada, samo ćemo proveriti da li se šalje (radi testiranja):
    // Ako dobijemo 200 OK, znamo da funkcija radi.

    // Provera da li je URL funkcije već posjećen
    if (!global.lastPost) {
        global.lastPost = latest.link;
        return res.status(200).json({ message: "Initialized (First call)." });
    }

    // Provera za novi članak
    if (latest.link !== global.lastPost) {
        global.lastPost = latest.link;

        // ***** IZMENA za Legacy Key: Uklanjamo Authorization header i dodajemo rest_api_key u telo zahteva *****
        await fetch("https://api.onesignal.com/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                // UKLANJAMO: "Authorization": `Basic ${REST_API_KEY}`
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                // KLJUČNA IZMENA: Šaljemo ključ u telu za Legacy podršku
                rest_api_key: REST_API_KEY, 
                included_segments: ["Subscribed Users"],
                headings: { en: latest.title },
                contents: { en: "Novi članak je objavljen!" },
                url: latest.link
            })
        });
        // ****************************************************************************************************

        return res.status(200).json({ message: "Push sent!" });
    }

    res.status(200).json({ message: "No new posts." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
}