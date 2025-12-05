import Parser from "rss-parser";

const parser = new Parser();

// ❗ Tvoji podaci
const RSS_URL = "https://istraziglobus.com/index.xml"; 
const ONESIGNAL_APP_ID = "1e163b67-b061-4298-8b71-6531c3d33068";
const REST_API_KEY = "x4s23nbzuu52f3at7n4z6fsaf"; 

let lastPost = null;

export default async function handler(req, res) {
  
    // ***** KRITIČNA PROVERA ZA VERCEL CRON JOB *****
    const CRON_SECRET = process.env.CRON_SECRET;
    
    // Ako Vercel ne pošalje pravu šifru u zaglavlju, odbij zahtev (401 Unauthorized)
    if (req.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized access: Missing or invalid CRON_SECRET." });
    }
    // ************************************************

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

        await fetch("https://api.onesignal.com/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                rest_api_key: REST_API_KEY, 
                included_segments: ["Subscribed Users"],
                headings: { en: latest.title },
                contents: { en: "Novi članak je objavljen!" },
                url: latest.link
            })
        });
        
        return res.status(200).json({ message: "Push sent!" });
    }

    res.status(200).json({ message: "No new posts." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
}