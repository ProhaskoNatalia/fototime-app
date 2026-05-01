import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// 🔥 Настройка загрузки файла в память
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

// 🚀 Главный endpoint генерации
app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Нет файла" });
    }

    const base64 = req.file.buffer.toString("base64");

    const prompt = `${req.body.gender}, стиль: ${req.body.style}, высокое качество, реалистичное фото`;

    // 🔥 Запрос к Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "ac732df83cea7fffac3b2c0c578c7c93e2a98c2c58f0bdf4ef8a7e6a2dff0a97",
        input: {
          prompt: prompt,
          init_image: `data:image/jpeg;base64,${base64}`,
          strength: 0.7
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Replicate error:", data);
      return res.status(500).json({ error: "Ошибка Replicate" });
    }

    let result = data;

    // ⏳ Ждём генерацию
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 2000));

      const check = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
        }
      });

      result = await check.json();
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: "Генерация не удалась" });
    }

    console.log("RESULT:", result);

    return res.json({
      success: true,
      image: result.output[0]
    });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

// 🧪 Проверка сервера
app.get("/", (req, res) => {
  res.send("AI server running 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));
