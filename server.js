const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // biar bisa akses index.html langsung

// Endpoint POST untuk simpan data
app.post("/submit", (req, res) => {
  const data = req.body;

  // Baca data lama
  let existingData = [];
  if (fs.existsSync("data.json")) {
    const fileData = fs.readFileSync("data.json");
    existingData = JSON.parse(fileData);
  }

  // Tambah data baru
  existingData.push({
    ...data,
    waktu: new Date().toLocaleString("id-ID"),
  });

  // Simpan ke file
  fs.writeFileSync("data.json", JSON.stringify(existingData, null, 2));

  res.json({ message: "Registrasi berhasil!", data: data });
});

// Endpoint GET untuk lihat data
app.get("/data", (req, res) => {
  if (fs.existsSync("data.json")) {
    const fileData = fs.readFileSync("data.json");
    res.json(JSON.parse(fileData));
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
