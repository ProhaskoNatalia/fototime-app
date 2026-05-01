import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";
import FormData from "form-data";

const app = express();
const upload = multer();

app.use(cors());

const API_KEY = "a7955f38-99e0-40ae-b870-1fa861d8ae78";

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("image", req.file.buffer, "photo.jpg");
    formData.append("gender", req.body.gender);
    formData.append("style", req.body.style);

    const response = await fetch("https://api.neuralsolutions.online/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      body: formData
    });

    const data = await response.json();
    res.json(data);

  } catch (e) {
    res.status(500).json({ error: "Ошибка генерации" });
  }
});

app.listen(3000);
