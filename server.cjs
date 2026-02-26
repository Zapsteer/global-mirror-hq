const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const xml2js = require("xml2js");

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// 🔑 APNI GEMINI KEY YAHAN LIKHO
// ===============================
const GEMINI_API_KEY = "AIzaSyB6tDLX_EgXvRuaCl73vmY4CdzH704Obtk";

// ===============================
// SETTINGS
// ===============================
let settings = {
  autoImagePrompt: true,
  autoCaption: true
};

// ===============================
// RSS FEEDS
// ===============================
const RSS_FEEDS = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml",            source: "BBC News",     category: "world"      },
  { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", source: "BBC Tech",     category: "technology" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml",   source: "BBC Business", category: "business"   },
  { url: "https://rss.cnn.com/rss/edition.rss",              source: "CNN",          category: "world"      },
  { url: "https://feeds.skynews.com/feeds/rss/world.xml",    source: "Sky News",     category: "world"      },
];

// ===============================
// CATEGORY IMAGES
// ===============================
const CATEGORY_IMAGES = {
  world:         ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800","https://images.unsplash.com/photo-1526470498-9ae73c665de8?w=800","https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800"],
  technology:    ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=800","https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800","https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"],
  business:      ["https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800","https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800"],
  entertainment: ["https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800","https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800"],
  sports:        ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800","https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800"],
  health:        ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800","https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800"],
  science:       ["https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800","https://images.unsplash.com/photo-1532094349884-543559872e87?w=800"],
};

function getImage(category, seed) {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world;
  return pool[Math.abs(seed) % pool.length];
}

// ===============================
// GEMINI AI
// ===============================
async function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });
    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          resolve(text.trim());
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ===============================
// RSS HELPERS
// ===============================
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function extractImage(item) {
  if (item["media:content"]?.["$"]?.url) return item["media:content"]["$"].url;
  if (item["media:thumbnail"]?.["$"]?.url) return item["media:thumbnail"]["$"].url;
  if (item.enclosure?.["$"]?.url) return item.enclosure["$"].url;
  const match = item.description?.match(/<img[^>]+src="([^">]+)"/);
  if (match) return match[1];
  return null;
}

async function parseRSS(feed) {
  try {
    const xml = await fetchUrl(feed.url);
    const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });
    const items = parsed?.rss?.channel?.item;
    if (!items) return [];
    const list = Array.isArray(items) ? items : [items];
    return list.slice(0, 5).map((item, i) => {
      const title = item.title || "No Title";
      const existingImage = extractImage(item);
      return {
        id: String(Date.now() + Math.random() * 10000 + i),
        title,
        description: item.description?.replace(/<[^>]*>/g, "").slice(0, 300) || "",
        url: item.link || "",
        imageUrl: existingImage || getImage(feed.category, title.length + i),
        source: feed.source,
        category: feed.category,
        status: "fetched",
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
      };
    });
  } catch (err) {
    console.log("Feed error:", feed.source, err.message);
    return [];
  }
}

// ===============================
// ROUTES
// ===============================

app.get("/", (req, res) => {
  res.send("Global Mirror AI Server Running 🚀");
});

app.get("/api/settings", (req, res) => res.json(settings));

app.post("/api/settings", (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// 🎨 IMAGE
app.post("/api/generate-image", (req, res) => {
  const { title, category } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const imageUrl = getImage(category || "world", title.length + Math.floor(Math.random() * 10));
  console.log("🎨 Image for:", title.slice(0, 40));
  res.json({ imageUrl });
});

// 🤖 GEMINI - Instagram
app.post("/api/caption/instagram", async (req, res) => {
  const { title, description } = req.body;
  console.log("🤖 Instagram caption for:", title?.slice(0, 40));
  try {
    const caption = await callGemini(
      `Write an engaging Instagram caption for this news:\nTitle: ${title}\nDescription: ${description}\n\nRules:\n- Max 150 words\n- Start with an emoji\n- Add 5-8 hashtags at end\n- Ask a question to boost comments\n- Make it exciting and shareable\n\nOnly return the caption, nothing else.`
    );
    res.json({ caption });
  } catch (err) {
    console.log("Gemini error:", err.message);
    res.json({ caption: `📸 ${title}\n\n${description?.slice(0, 200)}\n\nWhat do you think? 👇\n\n#News #Trending #GlobalMirror #BreakingNews #WorldNews` });
  }
});

// 🤖 GEMINI - Facebook
app.post("/api/caption/facebook", async (req, res) => {
  const { title, description } = req.body;
  console.log("🤖 Facebook caption for:", title?.slice(0, 40));
  try {
    const caption = await callGemini(
      `Write an engaging Facebook post for this news:\nTitle: ${title}\nDescription: ${description}\n\nRules:\n- Max 300 words\n- Strong opening hook\n- Informative and engaging\n- Call to action (like & share)\n- 3-5 hashtags\n\nOnly return the post, nothing else.`
    );
    res.json({ caption });
  } catch (err) {
    console.log("Gemini error:", err.message);
    res.json({ caption: `🌍 ${title}\n\n${description}\n\nStay updated with Global Mirror!\n\n#GlobalMirror #News #WorldNews #BreakingNews` });
  }
});

// 🤖 GEMINI - YouTube Shorts
app.post("/api/caption/youtube", async (req, res) => {
  const { title, description } = req.body;
  console.log("🤖 YouTube caption for:", title?.slice(0, 40));
  try {
    const caption = await callGemini(
      `Write a YouTube Shorts description for this news:\nTitle: ${title}\nDescription: ${description}\n\nRules:\n- STRICT MAX 80 words\n- Start with 🔥 emoji\n- Very punchy and exciting\n- End with #Shorts #News #Trending #GlobalMirror\n\nOnly return the description, nothing else.`
    );
    res.json({ caption });
  } catch (err) {
    console.log("Gemini error:", err.message);
    res.json({ caption: `🔥 ${title}\n\n${description?.slice(0, 100)}\n\n#Shorts #News #Trending #GlobalMirror` });
  }
});

// 📰 RSS FETCH
app.get("/api/rss/fetch", async (req, res) => {
  try {
    console.log("📰 Fetching RSS...");
    const results = await Promise.all(RSS_FEEDS.map(parseRSS));
    const all = results.flat();
    console.log("✅ Fetched:", all.length, "articles");
    res.json(all);
  } catch (err) {
    console.log("RSS error:", err.message);
    res.status(500).json([]);
  }
});

// ===============================
// START
// ===============================
app.listen(5000, () => {
  console.log("🔥 Server: http://localhost:5000");
  console.log("🤖 Gemini AI: Ready");
});
