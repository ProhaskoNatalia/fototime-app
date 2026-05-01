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

    return res.json({
      success: true,
      message: "Сервер работает 🔥"
    });

  } catch (e) {
    console.error("Ошибка:", e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));
