import Parser from "rss-parser";

const parser = new Parser();

// ❗ PROMIJENI OVO
const RSS_URL = "https://istraziglobus.com/index.xml"; 

const ONESIGNAL_APP_ID = "1e163b67-b061-4298-8b71-6531c3d33068";
const REST_API_KEY = "x4s23nbzuu52f3at7n4z6fsaf"; 

let lastPost = null;

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const latest = feed.items[0];

    // Ako je prvi put — ne šaljemo notifikaciju, samo upišemo
    if (!lastPost) {
      lastPost = latest.link;
      return res.status(200).json({ message: "Initialized." });
    }

    // Ako ima novi članak
    if (latest.link !== lastPost) {
      lastPost = latest.link;

      await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${REST_API_KEY}`
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
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
