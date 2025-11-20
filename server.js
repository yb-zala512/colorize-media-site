// IMPORTS
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// ----------- AI APIs (DeepAI) -----------
const DEEPAI_KEY = process.env.DEEPAI_KEY;  // <-- YOUR PRIVATE KEY

// Convert Media to 4K / 8K
app.post("/api/convert", async (req, res) => {
  try {
    if (!req.files || !req.files.media) {
      return res.json({ error: "No file uploaded" });
    }

    const file = req.files.media;
    const fetch = (await import("node-fetch")).default;

    const form = new FormData();
    form.append("image", file.data, file.name);

    const response = await fetch("https://api.deepai.org/api/torch-srgan", {
      method: "POST",
      headers: { "api-key": DEEPAI_KEY },
      body: form,
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.json({ error: "Conversion failed" });
  }
});

// Generate Description
app.post("/api/describe", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.json({ error: "No text found" });

    const fetch = (await import("node-fetch")).default;

    const response = await fetch("https://api.deepai.org/api/text-generator", {
      method: "POST",
      headers: {
        "api-key": DEEPAI_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `text=${encodeURIComponent(text)}`,
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.json({ error: "Description failed" });
  }
});

// ROUTE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
