import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// загрузка файла в память
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    console.log("Файл:", req.file);
    console.log("Данные:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "Нет файла" });
    }

    // переводим фото в base64
    const base64 = req.file.buffer.toString("base64");

    // запрос в нейросеть
    const response = await fetch("https://api.neuralsolutions.online/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer a7955f38-99e0-40ae-b870-1fa861d8ae78",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: base64,
        gender: req.body.gender,
        style: req.body.style
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Ошибка API:", data);
      return res.status(500).json({ error: "Ошибка нейросети" });
    }

    return res.json({
      success: true,
      image: data.image
    });

  } catch (e) {
    console.error("Ошибка сервера:", e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

// проверка сервера
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));
