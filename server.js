import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer();

app.use(cors());

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const { gender, style } = req.body;

    console.log("Получено:");
    console.log("gender:", gender);
    console.log("style:", style);
    console.log("file:", req.file ? "есть" : "нет");

    // 🔥 пока просто тестовый ответ
    return res.json({
      success: true,
      message: `Генерация: ${gender} + ${style}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/", (req, res) => {
  res.send("Server работает 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server started"));
