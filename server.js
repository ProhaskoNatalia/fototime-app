import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    console.log("=== НОВЫЙ ЗАПРОС ===");

    if (!req.file) {
      return res.status(400).json({ error: "Нет файла" });
    }

    const gender = req.body.gender;
    const style = req.body.style;

    console.log("gender:", gender);
    console.log("style:", style);
    console.log("file size:", req.file.size);

    // пока просто тест
    return res.json({
      success: true,
      message: `OK: ${gender} + ${style}`
    });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/", (req, res) => {
  res.send("Server работает 🚀");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server started"));
