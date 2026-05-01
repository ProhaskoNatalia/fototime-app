import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// ⚠️ ВАЖНО — именно memoryStorage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // до 10MB
});

app.use(cors());
app.use(express.json());

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    console.log("=== REQUEST ===");

    if (!req.file) {
      console.log("❌ нет файла");
      return res.status(400).json({ error: "Файл не пришёл" });
    }

    console.log("✅ файл есть:", req.file.originalname);
    console.log("size:", req.file.size);

    const { gender, style } = req.body;

    console.log("gender:", gender);
    console.log("style:", style);

    // просто тест ответ
    return res.json({
      success: true,
      message: `OK: ${gender} + ${style}`
    });

  } catch (err) {
    console.error("🔥 SERVER CRASH:", err);
    return res.status(500).json({ error: "Краш сервера" });
  }
});

app.get("/", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("SERVER RUNNING"));
