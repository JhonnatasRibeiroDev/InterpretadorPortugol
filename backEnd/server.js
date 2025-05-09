const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/executar", (req, res) => {
  const { codigo } = req.body;

  const caminhoDelegua = "/usr/local/bin/delegua";
  const nomeArquivo = path.join(__dirname, "codigo_temp.alg");

  fs.writeFileSync(nomeArquivo, codigo);

  // ✅ especifica o dialeto portugol
const comando = `"${caminhoDelegua}" --dialeto portugol-studio "${nomeArquivo}"`;


  exec(comando, (err, stdout, stderr) => {
    fs.unlinkSync(nomeArquivo);

    if (err) {
      return res.status(500).json({ erro: stderr || err.message });
    }

    const linhas = stdout.split("\n");
    const apenasSaida = linhas
      .filter(linha =>
        !linha.startsWith("Usando") &&
        !linha.startsWith("Console") &&
        !linha.startsWith("Pressione") &&
        !linha.startsWith("delegua>")
      )
      .join("\n")
      .trim();

    res.json({ saida: apenasSaida });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
