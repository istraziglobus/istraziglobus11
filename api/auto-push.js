export default async function handler(req, res) {
  const CRON_SECRET = process.env.CRON_SECRET;

  // PRAVILAN način čitanja header-a na Vercelu
  const secret = req.headers["x-cron-secret"];

  if (!secret || secret !== CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const postUrl = "https://www.istraziglobus.com";
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";

    const response = await fetch(oneSignalUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["Subscribed Users"],
        headings: { en: "Novi članak je objavljen!" },
        contents: { en: "Kliknite da pročitate najnoviji sadržaj na Istraži Globus." },
        url: postUrl,
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      message: "Notification sent successfully",
      onesignal_response: data,
    });

  } catch (error) {
    console.error("Greška u auto-push:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
