import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// память для загрузки фото
const upload = multer({
  storage: multer.memoryStorage()
});

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const { gender, style } = req.body;

    // 🔥 формируем промпт
    const prompt = `
    portrait of a ${gender} in style ${style},
    high quality, realistic, studio lighting, photobooth style
    `;

    // 👉 используем OpenAI image generation
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: "Ошибка генерации" });
    }

    return res.json({
      success: true,
      image: data.data[0].url
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/", (req, res) => {
  res.send("Fototime AI server работает 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 🧪 Проверка сервера
app.get("/", (req, res) => {
  res.send("AI server running 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));
